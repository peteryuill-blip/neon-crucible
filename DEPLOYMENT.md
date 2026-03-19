# Neon Crucible — Deployment Guide

This document covers everything needed to deploy `peteryuill.art` on Railway (recommended) or any Docker-compatible host, fully independent of the Manus platform.

---

## Prerequisites

- Node.js 22 LTS and pnpm 10 (local development)
- Docker and Docker Compose (local production testing)
- A [Railway](https://railway.app) account
- A [Cloudflare](https://cloudflare.com) account with R2 enabled

---

## Part 1 — One-Time Setup

### 1.1 Generate a bcrypt password hash for admin login

The site uses a local password login at `/login`. You need to generate a bcrypt hash of your chosen admin password and store it as `ADMIN_PASSWORD_HASH`.

```bash
node -e "const b=require('bcryptjs'); b.hash('YOUR_CHOSEN_PASSWORD', 12).then(console.log)"
```

Save the output (starts with `$2b$12$...`). This is your `ADMIN_PASSWORD_HASH` value.

### 1.2 Generate a JWT secret

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Save the output. This is your `JWT_SECRET` value.

### 1.3 Create a Cloudflare R2 bucket

1. Log in to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Go to **R2 Object Storage** → **Create bucket**
3. Name it `neon-crucible-assets` (or your preferred name)
4. Enable **Public Access** on the bucket settings page
5. Note the **Public bucket URL** (format: `https://pub-xxx.r2.dev`)

### 1.4 Create an R2 API token

1. In the Cloudflare dashboard → **R2** → **Manage R2 API tokens**
2. Click **Create API token**
3. Permissions: **Object Read & Write**
4. Scope: **Specific bucket** → select `neon-crucible-assets`
5. Save the **Access Key ID** and **Secret Access Key**

### 1.5 Migrate images to R2

After setting up R2 credentials, run the migration script to upload all 152 artwork images:

```bash
# Dry run first to verify
R2_ACCOUNT_ID=xxx R2_ACCESS_KEY_ID=xxx R2_SECRET_ACCESS_KEY=xxx \
R2_BUCKET_NAME=neon-crucible-assets R2_PUBLIC_URL=https://pub-xxx.r2.dev \
DATABASE_URL=mysql://... \
node scripts/migrate-images-to-r2.mjs --dry-run

# Full migration
node scripts/migrate-images-to-r2.mjs
```

This script is **idempotent** — safe to re-run if interrupted.

---

## Part 2 — Deploy to Railway

Railway is the recommended host. It provides managed MySQL, SSL, and custom domain support.

### 2.1 Create a new Railway project

1. Go to [railway.app](https://railway.app) → **New Project**
2. Choose **Deploy from GitHub repo** → select `peteryuill-blip/neon-crucible`
3. Railway will detect `railway.toml` and use the Dockerfile automatically

### 2.2 Add a MySQL database

1. In your Railway project → **Add a Service** → **Database** → **MySQL**
2. Once provisioned, click the MySQL service → **Variables** tab
3. Copy the `DATABASE_URL` value

### 2.3 Set environment variables

In Railway → your app service → **Variables** tab, add:

| Variable | Value |
|---|---|
| `DATABASE_URL` | From Railway MySQL plugin |
| `JWT_SECRET` | Generated in step 1.2 |
| `ADMIN_PASSWORD_HASH` | Generated in step 1.1 |
| `R2_ACCOUNT_ID` | Your Cloudflare account ID |
| `R2_ACCESS_KEY_ID` | From step 1.4 |
| `R2_SECRET_ACCESS_KEY` | From step 1.4 |
| `R2_BUCKET_NAME` | `neon-crucible-assets` |
| `R2_PUBLIC_URL` | `https://pub-xxx.r2.dev` |
| `PORT` | `3000` (Railway sets this automatically) |

### 2.4 Import the database

1. Connect to Railway MySQL using the connection string from the Variables tab
2. Import the SQL dump:

```bash
mysql -h HOST -P PORT -u USER -p DATABASE < database_backup_2026-03-19.sql
```

Or use a GUI tool like TablePlus or DBeaver with the Railway MySQL credentials.

### 2.5 Set a custom domain

1. Railway → your app service → **Settings** → **Domains**
2. Add `peteryuill.art`
3. Update your DNS: add a `CNAME` record pointing `peteryuill.art` to the Railway-provided domain

### 2.6 Deploy

Railway deploys automatically on every push to `main`. The first deploy will take 3–5 minutes to build.

---

## Part 3 — Local Docker Testing

Test the full production stack locally before deploying:

```bash
# 1. Create a .env file with required values (see env.example for all variables)
cp env.example .env
# Edit .env with your actual values

# 2. Build and start
docker compose up --build

# 3. The app is available at http://localhost:3000
# Admin login at http://localhost:3000/login

# 4. Stop
docker compose down
```

---

## Part 4 — Local Development (without Docker)

```bash
# Install dependencies
pnpm install

# Start dev server (hot reload)
pnpm dev

# Run tests
pnpm test

# Type check
pnpm check

# Push schema changes to database
pnpm db:push
```

---

## Part 5 — Environment Variable Reference

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | MySQL connection string |
| `JWT_SECRET` | ✅ | Session cookie signing secret (min 32 chars) |
| `ADMIN_PASSWORD_HASH` | ✅ | bcrypt hash of admin password |
| `R2_ACCOUNT_ID` | ✅ | Cloudflare account ID |
| `R2_ACCESS_KEY_ID` | ✅ | R2 API token key ID |
| `R2_SECRET_ACCESS_KEY` | ✅ | R2 API token secret |
| `R2_BUCKET_NAME` | ✅ | R2 bucket name |
| `R2_PUBLIC_URL` | ✅ | Public base URL for R2 bucket |
| `PORT` | Optional | Server port (default: 3000) |
| `BUILT_IN_FORGE_API_URL` | Optional | Manus LLM API (Neon AI chat) |
| `BUILT_IN_FORGE_API_KEY` | Optional | Manus LLM API key |
| `VITE_FRONTEND_FORGE_API_URL` | Optional | Manus LLM API (frontend) |
| `VITE_FRONTEND_FORGE_API_KEY` | Optional | Manus LLM API key (frontend) |

---

## Part 6 — Changing the Admin Password

To change the admin password after deployment:

1. Generate a new bcrypt hash:
   ```bash
   node -e "const b=require('bcryptjs'); b.hash('NEWPASSWORD', 12).then(console.log)"
   ```
2. Update `ADMIN_PASSWORD_HASH` in Railway Variables (or your `.env` file)
3. Redeploy (Railway auto-deploys on variable change)

---

## Part 7 — Manus Features After Migration

The following features depended on Manus and their status after migration:

| Feature | Status | Notes |
|---|---|---|
| Admin login | ✅ Portable | Local bcrypt/JWT at `/login` |
| Image storage (new uploads) | ✅ Portable | Cloudflare R2 |
| Existing images | ✅ Portable | Run `migrate-images-to-r2.mjs` |
| Database | ✅ Portable | Railway MySQL or any MySQL host |
| Neon AI chat (`/neon`) | ⚠️ Requires LLM key | Replace `BUILT_IN_FORGE_API_*` with OpenAI/Anthropic keys |
| Owner notifications | ⚠️ Requires Manus | Remove or replace `notifyOwner()` calls |
| Analytics | ⚠️ Requires Manus | Replace `VITE_ANALYTICS_*` with Plausible/Umami |

---

## Part 8 — Troubleshooting

**Login not working:** Verify `ADMIN_PASSWORD_HASH` is set and is a valid bcrypt hash starting with `$2b$`.

**Images not loading:** Verify `R2_PUBLIC_URL` matches the bucket's public URL exactly, and that public access is enabled on the R2 bucket.

**Database connection errors:** Ensure `DATABASE_URL` uses the correct format: `mysql://user:password@host:port/database`

**Build fails on Railway:** Check that all required environment variables are set before the first deploy.
