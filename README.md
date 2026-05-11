# Neon Crucible — peteryuill.art

Personal archive and operational infrastructure for Peter Yuill's 7-year artistic practice (2018–2025). Built with React 19, Express 4, tRPC 11, Drizzle ORM, and Tailwind CSS 4.

**Live site:** 
[peter-yuill.com](https://peter-yuill.com)

---

## What This Is

A full-stack web application serving as:
- **Public archive** — 152+ works organised by phase, technique, and emotional register
- **Neon AI interface** — conversational access to the practice via a custom LLM system
- **Admin dashboard** — private CMS for managing works, phases, essays, and press

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 7, Tailwind CSS 4, shadcn/ui |
| Backend | Node.js 22, Express 4, tRPC 11 |
| Database | MySQL 8 / TiDB via Drizzle ORM 0.44 |
| Storage | Cloudflare R2 (S3-compatible) |
| Auth | Local bcrypt/JWT (no OAuth dependency) |
| Testing | Vitest |
| Deployment | Railway (Docker) |

---

## Quick Start

```bash
# Install
pnpm install

# Configure environment (see DEPLOYMENT.md for all variables)
# Minimum required: DATABASE_URL, JWT_SECRET, ADMIN_PASSWORD_HASH

# Start dev server
pnpm dev

# Run tests
pnpm test
```

---

## Project Structure

```
client/src/
  pages/          — Public pages (Home, Works, Neon, About, etc.)
  pages/admin/    — Admin dashboard pages (protected, /manage/*)
  components/     — Reusable UI components
  hooks/          — Custom React hooks
server/
  _core/          — Framework plumbing (auth, context, env, LLM)
  routers.ts      — All tRPC procedures
  db.ts           — Database query helpers
  storage.ts      — Cloudflare R2 helpers
drizzle/
  schema.ts       — Database schema (7 tables)
  migrations/     — SQL migrations
scripts/
  export-csv.mjs          — Export all tables as CSV
  extract-images.mjs      — Download images from CDN
  migrate-images-to-r2.mjs — Upload images to Cloudflare R2
```

---

## Admin Access

Navigate to `/login` and enter the admin password. The password hash is stored in `ADMIN_PASSWORD_HASH` (bcrypt, cost factor 12).

To generate a new hash:
```bash
node -e "const b=require('bcryptjs'); b.hash('yourpassword',12).then(console.log)"
```

---

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full instructions covering Railway, Docker Compose, Cloudflare R2 setup, and database import.

---

## Data Export

The `database_backup_2026-03-19.sql` file in this repository contains a full MySQL dump of all 7 tables. Individual CSVs are in `data_export/`.

Image archive: `image_export_2026-03-19.tar.gz` (229MB, 152 images)
SHA256: `6238368e62cb05aa2750b01afd0a342947f3fc44a10b6cd81beb7b18ca8d6f7c`

---

## License

Private — all rights reserved. Source code shared for transparency and portability.
# Updated
