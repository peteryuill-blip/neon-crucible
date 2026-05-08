# NEON CRUCIBLE: COMPLETE SYSTEMS ARCHITECTURE AUDIT
Report Date: Fri May  8 20:19:09 +07 2026
Current Commit: 382a1eeca09e933d8cd051e3a932f146e711afcb
--------------------------------------------------

## 1. PROJECT STRUCTURE (FILE TREE)
.:
ARTWORK_DISPLAY_SYSTEM.md
AUDIT_REPORT.csv
CHANGE_LOG.csv
COMMISSIONS_IMAGES_FIX.md
CONTACT_LOGOS_UPDATE.md
CREATIVEWORK_SCHEMA_IMPLEMENTATION.md
DATABASE_CLEANUP_REPORT.md
DATABASE_STANDARDIZATION_DELIVERABLES
DATABASE_STANDARDIZATION_DELIVERABLES.tar.gz
DATABASE_STANDARDIZATION_SUMMARY.md
DB_IMAGE_AUDIT_SUMMARY.json
DB_IMAGE_INVENTORY.csv
DEEP_ARCHIVE_IMPLEMENTATION_PLAN.md
DEPLOYMENT.md
DESIGN_SYSTEM.md
Dockerfile
EXCEPTION_REPORT.csv
GOOGLE_INDEXING_DIAGNOSTIC_REPORT.md
GOOGLE_SEARCH_CONSOLE_SETUP.md
GSC_QUICK_START.md
IMAGE_AUDIT_SUMMARY.json
IMAGE_INVENTORY.csv
PROJECT_666_SITE_DOCUMENTATION.md
README.md
SEO_AUDIT_REPORT.md
SITE_ARCHITECTURE.md
TASK_22_ISSUE_LOG.md
TOP_20_LARGEST_IMAGES.md
VALIDATION_REPORT.txt
WORKS_EXPORT.csv
WORKS_EXPORT.json
WORKS_EXPORT.md
WORKS_INFORMATION_PACKAGE
WORKS_INFORMATION_PACKAGE.tar.gz
WORKS_SUMMARY.md
alignment_manifest.json
architecture_audit.md
backups
bigbang_manifest.json
celestial_secrets_manifest.json
check-thr3e.mjs
client
components.json
covenant_manifest.json
data_export
database_backup_2026-03-19.sql
delete-test-works.mjs
docker-compose.yml
drizzle
drizzle.config.ts
echoes_manifest.json
equinox_manifest.json
export-works.mjs
ideas.md
image_export
image_export_2026-03-19.tar.gz.sha256
master-audit.md
neon-identity-concepts.md
package.json
patches
ph1_manifest.json
ph1a_manifest.json
ph4_batch1_manifest.json
ph4_batch2_manifest.json
ph4_batch3_manifest.json
pnpm-lock.yaml
press_manifest.json
railway.toml
scripts
seed-gallery.mjs
server
shared
test-phase.mjs
thr3e_manifest.json
thumbnail_status.md
todo.md
tsconfig.json
tsconfig.node.json
vite.config.ts
vitest.config.ts

./DATABASE_STANDARDIZATION_DELIVERABLES:
AUDIT_REPORT.csv
CHANGE_LOG.csv
EXCEPTION_REPORT.csv
VALIDATION_REPORT.txt

./WORKS_INFORMATION_PACKAGE:
WORKS_EXPORT.csv
WORKS_EXPORT.json
WORKS_EXPORT.md
WORKS_SUMMARY.md

./backups:
works_backup_2026-01-28T22-13-51.json
works_backup_20260128_211627.json

./client:
index.html
public
src

./client/public:
android-chrome-192x192.png
android-chrome-512x512.png
apple-touch-icon.png
email-neon.jpg
favicon-16x16.png
favicon-32x32.png
favicon.ico
instagram-neon.jpg
poe-logo.png
robots.txt
sitemap.xml
whatsapp-neon.jpg

./client/src:
App.tsx
_core
components
const.ts
contexts
hooks
index.css
lib
main.tsx
pages

./client/src/_core:
hooks

./client/src/_core/hooks:
useAuth.ts

./client/src/components:
AIChatBox.tsx
AdminLayout.tsx
ArtworkSchema.tsx
DashboardLayout.tsx
DashboardLayoutSkeleton.tsx
ErrorBoundary.tsx
ImageUpload.tsx
Layout.tsx
Lightbox.tsx
ManusDialog.tsx
Map.tsx
SearchDialog.tsx
ui

./client/src/components/ui:
accordion.tsx
alert-dialog.tsx
alert.tsx
aspect-ratio.tsx
avatar.tsx
badge.tsx
breadcrumb.tsx
button-group.tsx
button.tsx
calendar.tsx
card.tsx
carousel.tsx
chart.tsx
checkbox.tsx
collapsible.tsx
command.tsx
context-menu.tsx
dialog.tsx
drawer.tsx
dropdown-menu.tsx
empty.tsx
field.tsx
form.tsx
hover-card.tsx
input-group.tsx
input-otp.tsx
input.tsx
item.tsx
kbd.tsx
label.tsx
menubar.tsx
navigation-menu.tsx
pagination.tsx
popover.tsx
progress.tsx
radio-group.tsx
resizable.tsx
scroll-area.tsx
select.tsx
separator.tsx
sheet.tsx
sidebar.tsx
skeleton.tsx
slider.tsx
sonner.tsx
spinner.tsx
switch.tsx
table.tsx
tabs.tsx
textarea.tsx
toggle-group.tsx
toggle.tsx
tooltip.tsx

./client/src/contexts:
ThemeContext.tsx

./client/src/hooks:
useCanonicalUrl.ts
useComposition.ts
useDebounce.ts
useMobile.tsx
usePersistFn.ts

./client/src/lib:
trpc.ts
utils.ts

./client/src/pages:
About.tsx
Archive.tsx
Commissions.tsx
ComponentShowcase.tsx
Contact.tsx
Crucible.tsx
CrucibleWorks.tsx
Dashboard.tsx
Descent.tsx
Home.tsx
Login.tsx
Neon.tsx
NeonIdentity.tsx
NotFound.tsx
Practice.tsx
Statistics.tsx
Voices.tsx
WorkDetail.tsx
Works.tsx
admin

./client/src/pages/admin:
AdminArchive.tsx
AdminDashboard.tsx
AdminEssays.tsx
AdminMetaquestions.tsx
AdminPhases.tsx
AdminWorks.tsx

./data_export:
archive_files.csv
essays.csv
metaquestions.csv
phases.csv
press_clippings.csv
users.csv
works.csv

./drizzle:
0000_regular_wither.sql
0001_melodic_the_captain.sql
0002_neat_sleepwalker.sql
0003_omniscient_rattler.sql
0004_bouncy_susan_delgado.sql
0005_lying_riptide.sql
0006_fancy_bishop.sql
0007_awesome_justice.sql
meta
migrations
relations.ts
schema.ts

./drizzle/meta:
0000_snapshot.json
0001_snapshot.json
0002_snapshot.json
0003_snapshot.json
0004_snapshot.json
0005_snapshot.json
0006_snapshot.json
0007_snapshot.json
_journal.json

./drizzle/migrations:

./image_export:
manifest.json

./patches:
wouter@3.7.1.patch

./scripts:
01_migration.sql
02_upload-crucible-batch.mjs
CY_HYPER_UNIFIED_FEATURE_MATRIX.json
add-cost-of-being-real.ts
cleanup-duplicates.ts
crucible_companion.csv
export-csv.mjs
extract-images.mjs
insert-ph4-final.mjs
migrate-images-to-r2.mjs
query-heroes.mjs
seed-archive.mjs
seed.mjs
upload-alignment.ts
upload-bigbang-s3.ts
upload-bigbang-ts.ts
upload-bigbang.mjs
upload-celestial-secrets.ts
upload-covenant.ts
upload-echoes.ts
upload-equinox.ts
upload-ph1.ts
upload-ph1a.ts
upload-ph4-batch1.ts
upload-ph4-batch2.ts
upload-ph4-batch3.ts
upload-ph4-final.mjs
upload-ph4a-docs.mjs
upload-press.ts
upload-thr3e.ts
upload_bigbang.py

./server:
_core
admin.dashboard.test.ts
admin.test.ts
auth.logout.test.ts
contact.test.ts
contact.ts
db.test.ts
db.ts
gallery.sorting.test.ts
gallery.test.ts
index.ts
localAuth.test.ts
phase.create.test.ts
routers.ts
search.test.ts
sitemap.ts
statistics.test.ts
storage.ts
work.update.test.ts
works.featured.test.ts

./server/_core:
context.ts
cookies.ts
dataApi.ts
env.ts
imageGeneration.ts
index.ts
llm.ts
localAuth.ts
map.ts
notification.ts
oauth.ts
sdk.ts
systemRouter.ts
trpc.ts
types
vite.ts
voiceTranscription.ts

./server/_core/types:
cookie.d.ts
manusTypes.ts

./shared:
_core
const.ts
types.ts

./shared/_core:
errors.ts

## 2. ENVIRONMENT INVENTORY (KEYS ONLY)
R2_ACCOUNT_ID
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
DATABASE_URL
R2_BUCKET_NAME
R2_PUBLIC_URL

## 3. PACKAGE & BUILD SPECIFICATIONS
{
  "name": "neon-crucible",
  "version": "1.0.0",
  "type": "module",
  "license": "MIT",
  "scripts": {
    "dev": "NODE_ENV=development tsx watch server/_core/index.ts",
    "build": "vite build && esbuild server/_core/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist --external:./vite.config.ts --external:../../vite.config",
    "start": "NODE_ENV=production node dist/index.js",
    "check": "tsc --noEmit",
    "format": "prettier --write .",
    "test": "vitest run",
    "db:push": "drizzle-kit generate && drizzle-kit migrate"
  },
  "dependencies": {
    "@aws-sdk/client-s3": "^3.693.0",
    "@aws-sdk/s3-request-presigner": "^3.693.0",
    "@hookform/resolvers": "^5.2.2",
    "@radix-ui/react-accordion": "^1.2.12",
    "@radix-ui/react-alert-dialog": "^1.1.15",
    "@radix-ui/react-aspect-ratio": "^1.1.7",
    "@radix-ui/react-avatar": "^1.1.10",
    "@radix-ui/react-checkbox": "^1.3.3",
    "@radix-ui/react-collapsible": "^1.1.12",
    "@radix-ui/react-context-menu": "^2.2.16",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-dropdown-menu": "^2.1.16",
    "@radix-ui/react-hover-card": "^1.1.15",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-menubar": "^1.1.16",
    "@radix-ui/react-navigation-menu": "^1.2.14",
    "@radix-ui/react-popover": "^1.1.15",
    "@radix-ui/react-progress": "^1.1.7",
    "@radix-ui/react-radio-group": "^1.3.8",
    "@radix-ui/react-scroll-area": "^1.2.10",
    "@radix-ui/react-select": "^2.2.6",
    "@radix-ui/react-separator": "^1.1.7",
    "@radix-ui/react-slider": "^1.3.6",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-switch": "^1.2.6",
    "@radix-ui/react-tabs": "^1.1.13",
    "@radix-ui/react-toggle": "^1.1.10",
    "@radix-ui/react-toggle-group": "^1.1.11",
    "@radix-ui/react-tooltip": "^1.2.8",
    "@tanstack/react-query": "^5.90.2",
    "@trpc/client": "^11.6.0",
    "@trpc/react-query": "^11.6.0",
    "@trpc/server": "^11.6.0",
    "axios": "^1.12.0",
    "bcryptjs": "^3.0.3",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.1.1",
    "cookie": "^1.0.2",
    "date-fns": "^4.1.0",
    "dotenv": "^17.2.2",
    "drizzle-orm": "^0.44.5",
    "embla-carousel-react": "^8.6.0",
    "express": "^4.21.2",
    "framer-motion": "^12.23.22",
    "input-otp": "^1.4.2",
    "jose": "6.1.0",
    "lucide-react": "^0.453.0",
    "mysql2": "^3.15.0",
    "nanoid": "^5.1.5",
    "next-themes": "^0.4.6",
    "pg": "^8.16.3",
    "react": "^19.2.1",
    "react-day-picker": "^9.11.1",
    "react-dom": "^19.2.1",
    "react-helmet-async": "^2.0.5",
    "react-hook-form": "^7.64.0",
    "react-resizable-panels": "^3.0.6",
    "recharts": "^2.15.2",
    "sonner": "^2.0.7",
    "streamdown": "^1.4.0",
    "superjson": "^1.13.3",
    "tailwind-merge": "^3.3.1",
    "tailwindcss-animate": "^1.0.7",
    "vaul": "^1.1.2",
    "wouter": "^3.3.5",
    "zod": "^4.1.12"
  },
  "devDependencies": {
    "@builder.io/vite-plugin-jsx-loc": "^0.1.1",
    "@tailwindcss/typography": "^0.5.15",
    "@tailwindcss/vite": "^4.1.3",
    "@types/bcryptjs": "^3.0.0",
    "@types/express": "4.17.21",
    "@types/google.maps": "^3.58.1",
    "@types/node": "^24.7.0",
    "@types/react": "^19.2.1",
    "@types/react-dom": "^19.2.1",
    "@vitejs/plugin-react": "^5.0.4",
    "add": "^2.0.6",
    "autoprefixer": "^10.4.20",
    "drizzle-kit": "^0.31.4",
    "esbuild": "^0.25.0",
    "pnpm": "^10.15.1",
    "postcss": "^8.4.47",
    "prettier": "^3.6.2",
    "tailwindcss": "^4.1.14",
    "tsx": "^4.19.1",
    "tw-animate-css": "^1.4.0",
    "typescript": "5.9.3",
    "vite": "^7.1.7",
    "vite-plugin-manus-runtime": "^0.0.57",
    "vitest": "^2.1.4"
  },
  "packageManager": "pnpm@10.4.1+sha512.c753b6c3ad7afa13af388fa6d808035a008e30ea9993f58c6663e2bc5ff21679aa834db094987129aa4d488b86df57f7b634981b2f827cdcacc698cc0cfb88af",
  "pnpm": {
    "patchedDependencies": {
      "wouter@3.7.1": "patches/wouter@3.7.1.patch"
    },
    "overrides": {
      "tailwindcss>nanoid": "3.3.7"
    }
  }
}

## 4. SERVER CORE LOGIC (ENTRY POINT)
File: server/_core/index.ts
import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerLocalAuthRoutes } from "./localAuth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { sitemapHandler } from "../sitemap";

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Simple health check endpoint for Railway/Docker (no auth, no tRPC overhead)
  app.get("/api/health", (_req, res) => {
    res.status(200).json({ ok: true, timestamp: Date.now() });
  });

  // Local auth routes: POST /api/auth/login, POST /api/auth/logout
  registerLocalAuthRoutes(app);
  // Sitemap
  app.get("/sitemap.xml", sitemapHandler);

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Railway injects PORT; listen on 0.0.0.0 so the container is reachable
  const port = parseInt(process.env.PORT || "3000");

  server.listen(port, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${port}/`);
  });
}

startServer().catch(console.error);

## 5. STATIC ASSET & VITE LOGIC
File: server/_core/vite.ts
import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";

export async function setupVite(app: Express, server: Server) {
  // Dynamic imports so vite and vite.config are NEVER bundled into dist/index.js
  // (vite is a devDependency — not present in the production container)
  const [{ createServer: createViteServer }, viteConfigModule] = await Promise.all([
    import("vite"),
    import("../../vite.config"),
  ]);

  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfigModule.default,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

## 6. DATABASE SCHEMA & DATA MODELS
server/storage.ts
/**
 * storage.ts — Cloudflare R2 storage helpers
 *
 * Replaces the Manus Forge API storage proxy with direct Cloudflare R2 access
 * using the AWS S3-compatible API. The public interface (storagePut / storageGet)
 * is identical to the previous implementation so no call-site changes are needed.
 *
 * Required environment variables:
 *   R2_ACCOUNT_ID       — Cloudflare account ID
 *   R2_ACCESS_KEY_ID    — R2 API token key ID
 *   R2_SECRET_ACCESS_KEY — R2 API token secret
 *   R2_BUCKET_NAME      — R2 bucket name (e.g. "neon-crucible-assets")
 *   R2_PUBLIC_URL       — Public base URL for the bucket
 *                         (e.g. "https://pub-xxx.r2.dev" or custom domain)
 *
 * Cloudflare R2 setup:
 *   1. Create a bucket in the Cloudflare dashboard
 *   2. Enable "Public access" on the bucket (or use a custom domain)
 *   3. Create an R2 API token with "Object Read & Write" permissions
 *   4. Set the five env vars above
 */

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ENV } from "./_core/env";

// ─── S3 client (lazily initialised) ─────────────────────────────────────────

let _client: S3Client | null = null;

function getClient(): S3Client {
  if (_client) return _client;

  const { r2AccountId, r2AccessKeyId, r2SecretAccessKey } = ENV;

  if (!r2AccountId || !r2AccessKeyId || !r2SecretAccessKey) {
    throw new Error(
      "R2 credentials missing: set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY"
    );
  }

  _client = new S3Client({
    region: "auto",
    endpoint: `https://${r2AccountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: r2AccessKeyId,
      secretAccessKey: r2SecretAccessKey,
    },
  });

  return _client;
}

function getBucketName(): string {
  const name = ENV.r2BucketName;
  if (!name) throw new Error("R2_BUCKET_NAME environment variable is not set");
  return name;
}

function getPublicUrl(): string {
  const url = ENV.r2PublicUrl;
  if (!url) throw new Error("R2_PUBLIC_URL environment variable is not set");
  return url.replace(/\/+$/, "");
}

function normalizeKey(relKey: string): string {
  return relKey.replace(/^\/+/, "");
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Upload bytes to R2 and return the public URL.
 * The R2 bucket must have public access enabled for the URL to be directly accessible.
 *
 * @param relKey      Object key (path within the bucket), e.g. "works/abc123.jpg"
 * @param data        File content as Buffer, Uint8Array, or string
 * @param contentType MIME type, defaults to "application/octet-stream"
 */
export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream"
): Promise<{ key: string; url: string }> {
  const client = getClient();
  const bucket = getBucketName();
  const key = normalizeKey(relKey);

  const body: Buffer =
    typeof data === "string"
      ? Buffer.from(data, "utf-8")
      : Buffer.from(data as Uint8Array);

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );

  const url = `${getPublicUrl()}/${key}`;
  return { key, url };
}

/**
 * Generate a presigned GET URL for a private object, or return the public URL
 * if the bucket is publicly accessible.
 *
 * @param relKey      Object key (path within the bucket)
 * @param expiresIn   Presigned URL expiry in seconds (default 3600 = 1 hour)
 */
export async function storageGet(
  relKey: string,
  expiresIn = 3600
): Promise<{ key: string; url: string }> {
  const client = getClient();
  const bucket = getBucketName();
  const key = normalizeKey(relKey);

  // If a public URL is configured, return it directly (no signing needed)
  if (ENV.r2PublicUrl) {
    return { key, url: `${getPublicUrl()}/${key}` };
  }

  // Fallback: generate a presigned URL for private buckets
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  const url = await getSignedUrl(client, command, { expiresIn });
  return { key, url };
}
server/db.ts
import { eq, desc, asc, and, like, sql, isNotNull } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, 
  phases, InsertPhase, Phase,
  works, InsertWork, Work,
  essays, InsertEssay, Essay,
  metaquestions, InsertMetaquestion, Metaquestion,
  archiveFiles, InsertArchiveFile, ArchiveFile,
  pressClippings, InsertPressClipping, PressClipping
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============ USER QUERIES ============

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function setUserRole(openId: string, role: "user" | "admin"): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot set user role: database not available");
    return;
  }
  await db.update(users).set({ role }).where(eq(users.openId, openId));
}

// ============ PHASES QUERIES ============

export async function getAllPhases(): Promise<Phase[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(phases).orderBy(asc(phases.sortOrder));
}

export async function getPhaseById(id: number): Promise<Phase | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(phases).where(eq(phases.id, id)).limit(1);
  return result[0];
}

export async function getPhaseByCode(code: string): Promise<Phase | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(phases).where(eq(phases.code, code)).limit(1);
  return result[0];
}

export async function createPhase(phase: InsertPhase): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(phases).values(phase);
}

export async function updatePhase(id: number, data: Partial<InsertPhase>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(phases).set(data).where(eq(phases.id, id));
}

export async function deletePhase(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(phases).where(eq(phases.id, id));
}

// ============ WORKS QUERIES ============

export interface WorksFilter {
  phaseId?: number;
  technique?: string;
  emotionalRegister?: string;
  seriesName?: string;
  featured?: boolean; // Filter by featured/selected works
  search?: string;
  isPublished?: boolean;
  limit?: number;
  offset?: number;
  sortBy?: 'phase' | 'date_newest' | 'date_oldest' | 'title' | 'random';
}

export async function getWorks(filter: WorksFilter = {}): Promise<Work[]> {
  const db = await getDb();
  if (!db) return [];

  const conditions = [];
  
  if (filter.phaseId !== undefined) {
    conditions.push(eq(works.phaseId, filter.phaseId));
  }
  if (filter.technique) {
    conditions.push(eq(works.technique, filter.technique));
  }
  if (filter.emotionalRegister) {
    conditions.push(eq(works.emotionalRegister, filter.emotionalRegister));
  }
  if (filter.seriesName) {
    conditions.push(eq(works.seriesName, filter.seriesName));
  }
  if (filter.featured !== undefined) {
    conditions.push(eq(works.featured, filter.featured));
  }
  if (filter.isPublished !== undefined) {
    conditions.push(eq(works.isPublished, filter.isPublished));
  }
  if (filter.search) {
    conditions.push(like(works.title, `%${filter.search}%`));
  }

  let query = db.select().from(works);
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as typeof query;
  }
  
  // Apply sorting based on sortBy parameter
  if (filter.sortBy === 'date_newest') {
    query = query.orderBy(desc(works.dateCreated), desc(works.createdAt)) as typeof query;
  } else if (filter.sortBy === 'date_oldest') {
    query = query.orderBy(asc(works.dateCreated), asc(works.createdAt)) as typeof query;
  } else if (filter.sortBy === 'title') {
    query = query.orderBy(asc(works.title)) as typeof query;
  } else if (filter.sortBy === 'random') {
    query = query.orderBy(sql`RAND()`) as typeof query;
  } else {
    // Default or 'phase': sort by works.sortOrder within the filtered phase, then by date
    // sortOrder is sequential per phase (1, 2, 3...), so this gives chronological order within phase
    query = query.orderBy(asc(works.sortOrder), desc(works.dateCreated), desc(works.createdAt)) as typeof query;
  }
  
  if (filter.limit) {
    query = query.limit(filter.limit) as typeof query;
  }
  if (filter.offset) {
    query = query.offset(filter.offset) as typeof query;
  }

  return query;
}

export async function getWorksCount(filter: WorksFilter = {}): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  const conditions = [];
  
  if (filter.phaseId !== undefined) {
    conditions.push(eq(works.phaseId, filter.phaseId));
  }
  if (filter.technique) {
    conditions.push(eq(works.technique, filter.technique));
  }
  if (filter.emotionalRegister) {
    conditions.push(eq(works.emotionalRegister, filter.emotionalRegister));
  }
  if (filter.seriesName) {
    conditions.push(eq(works.seriesName, filter.seriesName));
  }
  if (filter.featured !== undefined) {
    conditions.push(eq(works.featured, filter.featured));
  }
  if (filter.isPublished !== undefined) {
    conditions.push(eq(works.isPublished, filter.isPublished));
  }
  if (filter.search) {
    conditions.push(like(works.title, `%${filter.search}%`));
  }

  let query = db.select({ count: sql<number>`count(*)` }).from(works);
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as typeof query;
  }

  const result = await query;
  return result[0]?.count ?? 0;
}

export async function getWorkById(id: number): Promise<Work | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(works).where(eq(works.id, id)).limit(1);
  return result[0];
}

export async function createWork(work: InsertWork): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(works).values(work);
}

export async function updateWork(id: number, data: Partial<InsertWork>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(works).set(data).where(eq(works.id, id));
}

export async function deleteWork(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(works).where(eq(works.id, id));
}

// ============ SEARCH QUERIES ============

export interface SearchResult {
  type: 'work' | 'phase' | 'essay';
  id: number;
  title: string;
  description?: string;
  imageUrl?: string;
  phaseCode?: string;
  emotionalRegister?: string;
  seriesName?: string;
  category?: string;
}

export async function searchArchive(query: string, limit = 20): Promise<SearchResult[]> {
  const db = await getDb();
  if (!db || !query.trim()) return [];

  const searchTerm = `%${query.trim()}%`;
  const results: SearchResult[] = [];

  // Search works (title, technique, series, emotional register)
  const workResults = await db
    .select({
      id: works.id,
      title: works.title,
      imageUrl: works.imageUrl,
      phaseCode: phases.code,
      emotionalRegister: works.emotionalRegister,
      seriesName: works.seriesName,
      technique: works.technique,
    })
    .from(works)
    .leftJoin(phases, eq(works.phaseId, phases.id))
    .where(
      and(
        eq(works.isPublished, true),
        sql`(
          ${works.title} LIKE ${searchTerm} OR
          ${works.technique} LIKE ${searchTerm} OR
          ${works.seriesName} LIKE ${searchTerm} OR
          ${works.emotionalRegister} LIKE ${searchTerm}
        )`
      )
    )
    .limit(limit);

  results.push(
    ...workResults.map(w => ({
      type: 'work' as const,
      id: w.id,
      title: w.title,
      imageUrl: w.imageUrl ?? undefined,
      phaseCode: w.phaseCode ?? undefined,
      emotionalRegister: w.emotionalRegister ?? undefined,
      seriesName: w.seriesName ?? undefined,
      description: w.technique ?? undefined,
    }))
  );

  // Search phases (code, title, description)
  const phaseResults = await db
    .select({
      id: phases.id,
      code: phases.code,
      title: phases.title,
      description: phases.description,
    })
    .from(phases)
    .where(
      sql`(
        ${phases.code} LIKE ${searchTerm} OR
        ${phases.title} LIKE ${searchTerm} OR
        ${phases.description} LIKE ${searchTerm}
      )`
    )
    .limit(10);

  results.push(
    ...phaseResults.map(p => ({
      type: 'phase' as const,
      id: p.id,
      title: `${p.code}: ${p.title}`,
      description: p.description ?? undefined,
      phaseCode: p.code,
    }))
  );

  // Search essays (title, content)
  const essayResults = await db
    .select({
      id: essays.id,
      title: essays.title,
      category: essays.category,
      content: essays.content,
    })
    .from(essays)
    .where(
      and(
        eq(essays.isPublished, true),
        sql`(
          ${essays.title} LIKE ${searchTerm} OR
          ${essays.content} LIKE ${searchTerm}
        )`
      )
    )
    .limit(10);

  results.push(
    ...essayResults.map(e => ({
      type: 'essay' as const,
      id: e.id,
      title: e.title,
      category: e.category ?? undefined,
      description: e.content ? e.content.substring(0, 150) + '...' : undefined,
    }))
  );

  return results.slice(0, limit);
}

// ============ ESSAYS QUERIES ============

export async function getAllEssays(publishedOnly = true): Promise<Essay[]> {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(essays);
  if (publishedOnly) {
    query = query.where(eq(essays.isPublished, true)) as typeof query;
  }
  return query.orderBy(asc(essays.sortOrder));
}

export async function getEssaysByCategory(category: string): Promise<Essay[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(essays)
    .where(and(eq(essays.category, category), eq(essays.isPublished, true)))
    .orderBy(asc(essays.sortOrder));
}

export async function getEssayBySlug(slug: string): Promise<Essay | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(essays).where(eq(essays.slug, slug)).limit(1);
  return result[0];
}

export async function getEssayById(id: number): Promise<Essay | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(essays).where(eq(essays.id, id)).limit(1);
  return result[0];
}

export async function createEssay(essay: InsertEssay): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(essays).values(essay);
}

export async function updateEssay(id: number, data: Partial<InsertEssay>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(essays).set(data).where(eq(essays.id, id));
}

export async function deleteEssay(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(essays).where(eq(essays.id, id));
}

// ============ METAQUESTIONS QUERIES ============

export async function getAllMetaquestions(): Promise<Metaquestion[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(metaquestions).orderBy(asc(metaquestions.sortOrder));
}

export async function createMetaquestion(mq: InsertMetaquestion): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(metaquestions).values(mq);
}

export async function updateMetaquestion(id: number, data: Partial<InsertMetaquestion>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(metaquestions).set(data).where(eq(metaquestions.id, id));
}

export async function deleteMetaquestion(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(metaquestions).where(eq(metaquestions.id, id));
}

// ============ ARCHIVE FILES QUERIES ============

export async function getAllArchiveFiles(publishedOnly = true): Promise<ArchiveFile[]> {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(archiveFiles);
  if (publishedOnly) {
    query = query.where(eq(archiveFiles.isPublished, true)) as typeof query;
  }
  return query.orderBy(asc(archiveFiles.sortOrder), desc(archiveFiles.createdAt));
}

export async function getArchiveFileById(id: number): Promise<ArchiveFile | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(archiveFiles).where(eq(archiveFiles.id, id)).limit(1);
  return result[0];
}

export async function createArchiveFile(file: InsertArchiveFile): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(archiveFiles).values(file);
}

export async function updateArchiveFile(id: number, data: Partial<InsertArchiveFile>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(archiveFiles).set(data).where(eq(archiveFiles.id, id));
}

export async function deleteArchiveFile(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(archiveFiles).where(eq(archiveFiles.id, id));
}

// ============ PHASE THUMBNAILS ============

export async function getWorksByPhaseId(phaseId: number, limit: number = 3): Promise<{ id: number; title: string; thumbnailUrl: string | null; imageUrl: string | null }[]> {
  const db = await getDb();
  if (!db) return [];
  const result = await db.select({
    id: works.id,
    title: works.title,
    thumbnailUrl: works.thumbnailUrl,
    imageUrl: works.imageUrl,
  }).from(works)
    .where(and(eq(works.phaseId, phaseId), eq(works.isPublished, true)))
    .orderBy(asc(works.sortOrder), desc(works.createdAt))
    .limit(limit);
  return result;
}


// ============ PRESS CLIPPINGS QUERIES ============

export async function getAllPressClippings(publishedOnly = true): Promise<PressClipping[]> {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(pressClippings);
  if (publishedOnly) {
    query = query.where(eq(pressClippings.isPublished, true)) as typeof query;
  }
  return query.orderBy(asc(pressClippings.sortOrder), desc(pressClippings.createdAt));
}

export async function getPressClippingById(id: number): Promise<PressClipping | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(pressClippings).where(eq(pressClippings.id, id)).limit(1);
  return result[0];
}

export async function createPressClipping(clipping: InsertPressClipping): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(pressClippings).values(clipping);
}

export async function updatePressClipping(id: number, data: Partial<InsertPressClipping>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(pressClippings).set(data).where(eq(pressClippings.id, id));
}

export async function deletePressClipping(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(pressClippings).where(eq(pressClippings.id, id));
}

// ============ SERIES NAMES ============

export async function getDistinctSeriesNames(): Promise<string[]> {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.selectDistinct({ seriesName: works.seriesName })
    .from(works)
    .where(and(
      eq(works.isPublished, true),
      isNotNull(works.seriesName)
    ))
    .orderBy(asc(works.seriesName));
  
  return result.map(r => r.seriesName).filter((s): s is string => s !== null);
}

// ============ STATISTICS QUERIES ============

export interface WorksByPhase {
  phaseId: number;
  phaseCode: string;
  phaseTitle: string;
  year: string;
  count: number;
}

export interface TechniqueDistribution {
  technique: string;
  count: number;
}

export interface SizeRange {
  range: string;
  count: number;
}

export interface CollectionStatistics {
  totalWorks: number;
  worksByPhase: WorksByPhase[];
  techniqueDistribution: TechniqueDistribution[];
  sizeRanges: SizeRange[];
  totalPhases: number;
  yearSpan: string;
}

export async function getCollectionStatistics(): Promise<CollectionStatistics> {
  const db = await getDb();
  if (!db) {
    return {
      totalWorks: 0,
      worksByPhase: [],
      techniqueDistribution: [],
      sizeRanges: [],
      totalPhases: 0,
      yearSpan: "2018-2025",
    };
  }

  // Total works count
  const totalWorksResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(works)
    .where(eq(works.isPublished, true));
  const totalWorks = totalWorksResult[0]?.count ?? 0;

  // Works by phase
  const worksByPhaseResult = await db
    .select({
      phaseId: phases.id,
      phaseCode: phases.code,
      phaseTitle: phases.title,
      year: phases.year,
      count: sql<number>`count(${works.id})`,
    })
    .from(phases)
    .leftJoin(works, and(eq(works.phaseId, phases.id), eq(works.isPublished, true)))
    .groupBy(phases.id, phases.code, phases.title, phases.year)
    .orderBy(asc(phases.sortOrder));

  const worksByPhase: WorksByPhase[] = worksByPhaseResult.map(row => ({
    phaseId: row.phaseId,
    phaseCode: row.phaseCode,
    phaseTitle: row.phaseTitle,
    year: row.year,
    count: row.count,
  }));

  // Technique distribution
  const techniqueResult = await db
    .select({
      technique: works.technique,
      count: sql<number>`count(*)`,
    })
    .from(works)
    .where(and(eq(works.isPublished, true), isNotNull(works.technique)))
    .groupBy(works.technique)
    .orderBy(desc(sql<number>`count(*)`));

  const techniqueDistribution: TechniqueDistribution[] = techniqueResult.map(row => ({
    technique: row.technique ?? "Unknown",
    count: row.count,
  }));

  // Size ranges (parse dimensions and categorize)
  const allWorks = await db
    .select({ dimensions: works.dimensions })
    .from(works)
    .where(and(eq(works.isPublished, true), isNotNull(works.dimensions)));

  const sizeRanges: { [key: string]: number } = {
    "Small (<50cm)": 0,
    "Medium (50-100cm)": 0,
    "Large (100-150cm)": 0,
    "Monumental (>150cm)": 0,
  };

  allWorks.forEach(work => {
    if (!work.dimensions) return;
    
    // Parse dimensions like "56cm x 76cm"
    const match = work.dimensions.match(/(\d+)cm\s*x\s*(\d+)cm/);
    if (match) {
      const height = parseInt(match[1]);
      const width = parseInt(match[2]);
      const maxDimension = Math.max(height, width);

      if (maxDimension < 50) {
        sizeRanges["Small (<50cm)"]++;
      } else if (maxDimension < 100) {
        sizeRanges["Medium (50-100cm)"]++;
      } else if (maxDimension < 150) {
        sizeRanges["Large (100-150cm)"]++;
      } else {
        sizeRanges["Monumental (>150cm)"]++;
      }
    }
  });

  const sizeRangesArray: SizeRange[] = Object.entries(sizeRanges).map(([range, count]) => ({
    range,
    count,
  }));

  // Total phases
  const totalPhasesResult = await db.select({ count: sql<number>`count(*)` }).from(phases);
  const totalPhases = totalPhasesResult[0]?.count ?? 0;

  return {
    totalWorks,
    worksByPhase,
    techniqueDistribution,
    sizeRanges: sizeRangesArray,
    totalPhases,
    yearSpan: "2018-2025",
  };
}


// ============ GALLERY QUERIES ============

export interface GalleryFilter {
  phase?: string;      // Phase code e.g. "PH1", "NE"
  excludePhase?: string; // Exclude a phase code e.g. "Crucible"
  series?: string;     // Series name
  year?: string;       // Year string e.g. "2025"
  medium?: string;     // Medium string
  search?: string;     // Search across title, series, neonReading, conceptTags
  sort?: 'title-asc' | 'title-desc' | 'year-desc' | 'year-asc';
}

export async function getGalleryWorks(filter: GalleryFilter = {}): Promise<Work[]> {
  const db = await getDb();
  if (!db) return [];

  const conditions = [eq(works.isPublished, true)];

  // Phase filter: lookup phase by code, then filter by phaseId
  if (filter.phase) {
    const phaseResult = await db.select({ id: phases.id })
      .from(phases)
      .where(eq(phases.code, filter.phase))
      .limit(1);
    if (phaseResult.length > 0) {
      conditions.push(eq(works.phaseId, phaseResult[0].id));
    } else {
      return []; // Invalid phase code
    }
  }

  // Exclude phase filter
  if (filter.excludePhase) {
    const excludeResult = await db.select({ id: phases.id })
      .from(phases)
      .where(eq(phases.code, filter.excludePhase))
      .limit(1);
    if (excludeResult.length > 0) {
      conditions.push(sql`${works.phaseId} != ${excludeResult[0].id} OR ${works.phaseId} IS NULL`);
    }
  }

  if (filter.series) {
    conditions.push(eq(works.seriesName, filter.series));
  }

  if (filter.year) {
    conditions.push(eq(works.year, filter.year));
  }

  if (filter.medium) {
    conditions.push(eq(works.medium, filter.medium));
  }

  if (filter.search) {
    const searchTerm = `%${filter.search.trim()}%`;
    conditions.push(
      sql`(
        ${works.title} LIKE ${searchTerm} OR
        ${works.seriesName} LIKE ${searchTerm} OR
        ${works.neonReading} LIKE ${searchTerm} OR
        CAST(${works.conceptTags} AS CHAR) LIKE ${searchTerm}
      )`
    );
  }

  let query = db.select().from(works).where(and(...conditions));

  // Sorting
  if (filter.sort === 'title-asc') {
    query = query.orderBy(asc(works.title)) as typeof query;
  } else if (filter.sort === 'title-desc') {
    query = query.orderBy(desc(works.title)) as typeof query;
  } else if (filter.sort === 'year-asc') {
    // Oldest first: prioritize works with full dates, then year-only
    query = query.orderBy(
      sql`CASE WHEN ${works.dateCreated} IS NULL OR ${works.dateCreated} = '' THEN 1 ELSE 0 END`,
      asc(sql`COALESCE(${works.dateCreated}, ${works.year})`),
      asc(works.title)
    ) as typeof query;
  } else {
    // Default: year-desc (newest first): prioritize works with full dates, then year-only
    query = query.orderBy(
      sql`CASE WHEN ${works.dateCreated} IS NULL OR ${works.dateCreated} = '' THEN 1 ELSE 0 END`,
      desc(sql`COALESCE(${works.dateCreated}, ${works.year})`),
      asc(works.sortOrder)
    ) as typeof query;
  }

  return await query;
}

export async function getGalleryWorksCount(filter: GalleryFilter = {}): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  const conditions = [eq(works.isPublished, true)];

  if (filter.phase) {
    const phaseResult = await db.select({ id: phases.id })
      .from(phases)
      .where(eq(phases.code, filter.phase))
      .limit(1);
    if (phaseResult.length > 0) {
      conditions.push(eq(works.phaseId, phaseResult[0].id));
    } else {
      return 0;
    }
  }

  if (filter.excludePhase) {
    const excludeResult = await db.select({ id: phases.id })
      .from(phases)
      .where(eq(phases.code, filter.excludePhase))
      .limit(1);
    if (excludeResult.length > 0) {
      conditions.push(sql`${works.phaseId} != ${excludeResult[0].id} OR ${works.phaseId} IS NULL`);
    }
  }

  if (filter.series) {
    conditions.push(eq(works.seriesName, filter.series));
  }

  if (filter.year) {
    conditions.push(eq(works.year, filter.year));
  }

  if (filter.medium) {
    conditions.push(eq(works.medium, filter.medium));
  }

  if (filter.search) {
    const searchTerm = `%${filter.search.trim()}%`;
    conditions.push(
      sql`(
        ${works.title} LIKE ${searchTerm} OR
        ${works.seriesName} LIKE ${searchTerm} OR
        ${works.neonReading} LIKE ${searchTerm} OR
        CAST(${works.conceptTags} AS CHAR) LIKE ${searchTerm}
      )`
    );
  }

  const result = await db.select({ count: sql<number>`count(*)` })
    .from(works)
    .where(and(...conditions));

  return result[0]?.count ?? 0;
}

export async function getWorkBySlug(slug: string): Promise<Work | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(works)
    .where(and(eq(works.slug, slug), eq(works.isPublished, true)))
    .limit(1);
  return result[0];
}

export interface GalleryFilterOptions {
  phases: { code: string; title: string }[];
  series: string[];
  years: string[];
  mediums: string[];
}

export async function getGalleryFilterOptions(): Promise<GalleryFilterOptions> {
  const db = await getDb();
  if (!db) return { phases: [], series: [], years: [], mediums: [] };

  // Get phases that have works
  const phaseResults = await db
    .select({ code: phases.code, title: phases.title })
    .from(phases)
    .innerJoin(works, eq(works.phaseId, phases.id))
    .groupBy(phases.id)
    .orderBy(asc(phases.sortOrder));

  // Get distinct series
  const seriesResults = await db
    .select({ seriesName: works.seriesName })
    .from(works)
    .where(isNotNull(works.seriesName))
    .groupBy(works.seriesName)
    .orderBy(asc(works.seriesName));

  // Get distinct years
  const yearResults = await db
    .select({ year: works.year })
    .from(works)
    .where(isNotNull(works.year))
    .groupBy(works.year)
    .orderBy(desc(works.year));

  // Get distinct mediums
  const mediumResults = await db
    .select({ medium: works.medium })
    .from(works)
    .where(isNotNull(works.medium))
    .groupBy(works.medium)
    .orderBy(asc(works.medium));

  return {
    phases: phaseResults.map(r => ({ code: r.code, title: r.title })),
    series: seriesResults.map(r => r.seriesName).filter((s): s is string => s !== null),
    years: yearResults.map(r => r.year).filter((y): y is string => y !== null),
    mediums: mediumResults.map(r => r.medium).filter((m): m is string => m !== null),
  };
}

## 7. FRONTEND SITEMAP (REACT ROUTES)
        <Route path="/" component={Home} />
        <Route path="/works" component={Works} />
        <Route path="/works/:slug" component={WorkDetail} />
        <Route path="/practice" component={Practice} />
        <Route path="/crucible" component={Crucible} />
        <Route path="/crucible/works" component={CrucibleWorks} />
        <Route path="/neon" component={Neon} />
        <Route path="/neon/identity" component={NeonIdentity} />
        <Route path="/about" component={About} />
        <Route path="/archive" component={Archive} />
        <Route path="/statistics" component={Statistics} />
        <Route path="/commissions" component={Commissions} />
        <Route path="/contact" component={Contact} />
        <Route path="/voices" component={Voices} />
        <Route path="/descent" component={Descent} />
        <Route path="/dashboard" component={Dashboard} />
      <Route path="/manage">
      <Route path="/manage/works">
      <Route path="/manage/phases">
      <Route path="/manage/essays">
      <Route path="/manage/metaquestions">
      <Route path="/manage/archive">
      <Route path="/login" component={Login} />

## 8. INFRASTRUCTURE & API ROUTERS
File: server/routers.ts
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import * as db from "./db";
import { storagePut } from "./storage";
import { nanoid } from "nanoid";
import { contactRouter } from "./contact";

// Admin check middleware
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ============ PHASES ============
  phases: router({
    list: publicProcedure.query(async () => {
      return db.getAllPhases();
    }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getPhaseById(input.id);
      }),
    
    getByCode: publicProcedure
      .input(z.object({ code: z.string() }))
      .query(async ({ input }) => {
        return db.getPhaseByCode(input.code);
      }),
    
    getWorkThumbnails: publicProcedure
      .input(z.object({ phaseId: z.number(), limit: z.number().optional().default(3) }))
      .query(async ({ input }) => {
        return db.getWorksByPhaseId(input.phaseId, input.limit);
      }),
    
    create: adminProcedure
      .input(z.object({
        code: z.string().min(1).max(16),
        title: z.string().min(1).max(255),
        year: z.string().min(1).max(16),
        description: z.string().optional(),
        emotionalTemperature: z.string().optional(),
        color: z.string().optional(),
        sortOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.createPhase(input);
        return { success: true };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        code: z.string().min(1).max(16).optional(),
        title: z.string().min(1).max(255).optional(),
        year: z.string().min(1).max(16).optional(),
        description: z.string().optional(),
        emotionalTemperature: z.string().optional(),
        color: z.string().optional(),
        sortOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updatePhase(id, data);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deletePhase(input.id);
        return { success: true };
      }),
  }),

  // ============ WORKS ============
  works: router({
    list: publicProcedure
      .input(z.object({
        phaseId: z.number().optional(),
        technique: z.string().optional(),
        emotionalRegister: z.string().optional(),
        seriesName: z.string().optional(),
        featured: z.boolean().optional(), // Filter by featured/selected works
        search: z.string().optional(),
        sortBy: z.enum(['phase', 'date_newest', 'date_oldest', 'title', 'random']).optional().default('date_newest'),
        limit: z.number().min(1).max(100).optional().default(12),
        offset: z.number().min(0).optional().default(0),
      }).optional())
      .query(async ({ input }) => {
        const filter = { ...input, isPublished: true };
        const [items, total] = await Promise.all([
          db.getWorks(filter),
          db.getWorksCount(filter),
        ]);
        return { items, total, limit: filter.limit, offset: filter.offset };
      }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getWorkById(input.id);
      }),
    
    getDistinctSeries: publicProcedure
      .query(async () => {
        return db.getDistinctSeriesNames();
      }),
    
    create: adminProcedure
      .input(z.object({
        title: z.string().min(1).max(255),
        phaseId: z.number().optional(),
        dateCreated: z.string().optional(),
        technique: z.string().optional(),
        dimensions: z.string().optional(),
        colorPalette: z.string().optional(),
        emotionalRegister: z.string().optional(),
        imageUrl: z.string().optional(),
        imageKey: z.string().optional(),
        thumbnailUrl: z.string().optional(),
        journalExcerpt: z.string().optional(),
        neonReading: z.string().optional(),
        seriesName: z.string().optional(),
        featured: z.boolean().optional(), // Mark as featured/selected work
        isPublished: z.boolean().optional(),
        sortOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.createWork(input);
        return { success: true };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().min(1).max(255).optional(),
        phaseId: z.number().nullable().optional(),
        dateCreated: z.string().optional(),
        technique: z.string().optional(),
        dimensions: z.string().optional(),
        colorPalette: z.string().optional(),
        emotionalRegister: z.string().optional(),
        imageUrl: z.string().optional(),
        imageKey: z.string().optional(),
        thumbnailUrl: z.string().optional(),
        journalExcerpt: z.string().optional(),
        neonReading: z.string().optional(),
        seriesName: z.string().optional(),
        featured: z.boolean().optional(), // Mark as featured/selected work
        isPublished: z.boolean().optional(),
        sortOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateWork(id, data);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteWork(input.id);
        return { success: true };
      }),
  }),

  // ============ ESSAYS ============
  essays: router({
    list: publicProcedure
      .input(z.object({ category: z.string().optional() }).optional())
      .query(async ({ input }) => {
        if (input?.category) {
          return db.getEssaysByCategory(input.category);
        }
        return db.getAllEssays(true);
      }),
    
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return db.getEssayBySlug(input.slug);
      }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getEssayById(input.id);
      }),
    
    create: adminProcedure
      .input(z.object({
        title: z.string().min(1).max(255),
        slug: z.string().min(1).max(128),
        description: z.string().optional(),
        content: z.string().optional(),
        category: z.string().optional(),
        phaseId: z.number().optional(),
        isPublished: z.boolean().optional(),
        sortOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.createEssay(input);
        return { success: true };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().min(1).max(255).optional(),
        slug: z.string().min(1).max(128).optional(),
        description: z.string().optional(),
        content: z.string().optional(),
        category: z.string().optional(),
        phaseId: z.number().nullable().optional(),
        isPublished: z.boolean().optional(),
        sortOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateEssay(id, data);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteEssay(input.id);
        return { success: true };
      }),
  }),

  // ============ METAQUESTIONS ============
  metaquestions: router({
    list: publicProcedure.query(async ({ ctx }) => {
      const metaquestions = await db.getAllMetaquestions();
      // Filter out private answers for non-admin users
      const isAdmin = ctx.user?.role === 'admin';
      return metaquestions.map(mq => ({
        ...mq,
        // Hide answer if it's marked private and user is not admin
        answer: (mq.isAnswerPrivate && !isAdmin) ? null : mq.answer,
      }));
    }),
    
    // Admin-only endpoint to get all metaquestions with answers
    listWithAnswers: adminProcedure.query(async () => {
      return db.getAllMetaquestions();
    }),
    
    create: adminProcedure
      .input(z.object({
        question: z.string().min(1),
        answer: z.string().optional(),
        isAnswered: z.boolean().optional(),
        isAnswerPrivate: z.boolean().optional().default(true),
        sortOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.createMetaquestion(input);
        return { success: true };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        question: z.string().min(1).optional(),
        answer: z.string().optional(),
        isAnswered: z.boolean().optional(),
        isAnswerPrivate: z.boolean().optional(),
        sortOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateMetaquestion(id, data);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteMetaquestion(input.id);
        return { success: true };
      }),
  }),

  // ============ ARCHIVE FILES ============
  archiveFiles: router({
    list: publicProcedure.query(async () => {
      return db.getAllArchiveFiles(true);
    }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getArchiveFileById(input.id);
      }),
    
    create: adminProcedure
      .input(z.object({
        filename: z.string().min(1).max(255),
        fileType: z.string().optional(),
        fileSize: z.string().optional(),
        fileUrl: z.string().optional(),
        fileKey: z.string().optional(),
        description: z.string().optional(),
        category: z.string().optional(),
        isPublished: z.boolean().optional(),
        sortOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.createArchiveFile(input);
        return { success: true };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        filename: z.string().min(1).max(255).optional(),
        fileType: z.string().optional(),
        fileSize: z.string().optional(),
        fileUrl: z.string().optional(),
        fileKey: z.string().optional(),
        description: z.string().optional(),
        category: z.string().optional(),
        isPublished: z.boolean().optional(),
        sortOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateArchiveFile(id, data);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteArchiveFile(input.id);
        return { success: true };
      }),
  }),

  // ============ PRESS CLIPPINGS ============
  pressClippings: router({
    getAll: publicProcedure.query(async () => {
      return db.getAllPressClippings(true);
    }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getPressClippingById(input.id);
      }),
    
    create: adminProcedure
      .input(z.object({
        title: z.string().min(1).max(255),
        source: z.string().min(1).max(128),
        author: z.string().optional(),
        date: z.string().optional(),
        excerpt: z.string().optional(),
        fullText: z.string().optional(),
        url: z.string().optional(),
        imageUrl: z.string().optional(),
        phaseId: z.number().optional(),
        category: z.string().optional(),
        isPublished: z.boolean().optional(),
        sortOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.createPressClipping(input);
        return { success: true };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().min(1).max(255).optional(),
        source: z.string().min(1).max(128).optional(),
        author: z.string().optional(),
        date: z.string().optional(),
        excerpt: z.string().optional(),
        fullText: z.string().optional(),
        url: z.string().optional(),
        imageUrl: z.string().optional(),
        phaseId: z.number().nullable().optional(),
        category: z.string().optional(),
        isPublished: z.boolean().optional(),
        sortOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updatePressClipping(id, data);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deletePressClipping(input.id);
        return { success: true };
      }),
  }),

  // ============ FILE UPLOAD ============
  upload: router({
    // Upload work image
    workImage: adminProcedure
      .input(z.object({
        filename: z.string(),
        contentType: z.string(),
        base64Data: z.string(),
      }))
      .mutation(async ({ input }) => {
        const buffer = Buffer.from(input.base64Data, 'base64');
        const ext = input.filename.split('.').pop() || 'jpg';
        const key = `works/${nanoid()}-${Date.now()}.${ext}`;
        const { url } = await storagePut(key, buffer, input.contentType);
        return { key, url };
      }),
    
    // Upload archive file
    archiveFile: adminProcedure
      .input(z.object({
        filename: z.string(),
        contentType: z.string(),
        base64Data: z.string(),
      }))
      .mutation(async ({ input }) => {
        const buffer = Buffer.from(input.base64Data, 'base64');
        const ext = input.filename.split('.').pop() || 'bin';
        const key = `archive/${nanoid()}-${Date.now()}.${ext}`;
        const { url } = await storagePut(key, buffer, input.contentType);
        return { key, url };
      }),
  }),

  // ============ GALLERY ============
  gallery: router({
    getAll: publicProcedure
      .input(z.object({
        phase: z.string().optional(),
        excludePhase: z.string().optional(),
        series: z.string().optional(),
        year: z.string().optional(),
        medium: z.string().optional(),
        search: z.string().optional(),
        sort: z.enum(['title-asc', 'title-desc', 'year-desc', 'year-asc']).optional(),
      }).optional())
      .query(async ({ input }) => {
        const filter = input ?? {};
        const [items, total] = await Promise.all([
          db.getGalleryWorks(filter),
          db.getGalleryWorksCount(filter),
        ]);
        return { items, total };
      }),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const work = await db.getWorkBySlug(input.slug);
        if (!work) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Work not found' });
        }
        // Get phase info
        let phase = null;
        if (work.phaseId) {
          phase = await db.getPhaseById(work.phaseId);
        }
        return { ...work, phase };
      }),

    getFilterOptions: publicProcedure
      .query(async () => {
        return db.getGalleryFilterOptions();
      }),

    create: adminProcedure
      .input(z.object({
        title: z.string().min(1).max(255),
        slug: z.string().min(1).max(128),
        year: z.string().min(1).max(16),
        dateCreated: z.string().optional(),
        medium: z.string().min(1).max(128),
        dimensions: z.string().min(1).max(128),
        seriesName: z.string().min(1).max(128),
        phaseId: z.number().optional(),
        curatorialHook: z.string().optional(),
        neonReading: z.string().optional(),
        conceptTags: z.array(z.string()).optional(),
        imageUrl: z.string().optional(),
        imageKey: z.string().optional(),
        colorPalette: z.string().optional(),
        emotionalRegister: z.string().optional(),
        isPublished: z.boolean().optional().default(true),
      }))
      .mutation(async ({ input }) => {
        const work = await db.createWork(input);
        return { success: true, work };
      }),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().min(1).max(255).optional(),
        slug: z.string().min(1).max(128).optional(),
        year: z.string().min(1).max(16).optional(),
        dateCreated: z.string().optional(),
        medium: z.string().min(1).max(128).optional(),
        dimensions: z.string().min(1).max(128).optional(),
        seriesName: z.string().min(1).max(128).optional(),
        phaseId: z.number().nullable().optional(),
        curatorialHook: z.string().optional(),
        neonReading: z.string().optional(),
        conceptTags: z.array(z.string()).optional(),
        imageUrl: z.string().optional(),
        imageKey: z.string().optional(),
        colorPalette: z.string().optional(),
        emotionalRegister: z.string().optional(),
        isPublished: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateWork(id, data);
        return { success: true };
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteWork(input.id);
        return { success: true };
      }),

    uploadImage: adminProcedure
      .input(z.object({
        filename: z.string(),
        contentType: z.string(),
        data: z.string(), // base64 encoded image
      }))
      .mutation(async ({ input }) => {
        // Convert base64 to buffer
        const base64Data = input.data.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");
        
        // Generate unique filename
        const ext = input.filename.split(".").pop() || "jpg";
        const uniqueFilename = `works/${nanoid()}.${ext}`;
        
        // Upload to S3
        const result = await storagePut(uniqueFilename, buffer, input.contentType);
        
        return { url: result.url, key: uniqueFilename };
      }),
  }),

  // ============ SEARCH ============
  search: router({
    query: publicProcedure
      .input(z.object({
        q: z.string().min(1),
        limit: z.number().optional().default(20),
      }))
      .query(async ({ input }) => {
        return db.searchArchive(input.q, input.limit);
      }),
  }),

  // ============ STATISTICS ============
  statistics: router({
    collection: publicProcedure.query(async () => {
      return db.getCollectionStatistics();
    }),
  }),
  
  // ============ CONTACT ============
  contact: contactRouter,
});

export type AppRouter = typeof appRouter;

## 9. GIT HISTORY (LAST 10 ENTRIES)
382a1ee fix: restore missing CrucibleWorks import for architectural stability
dfd7747 fix: delete package-lock.json, keep pnpm-lock.yaml only
d66382e fix: remove sharp from package.json, update lockfile
5983532 feat: separate crucible works gallery, exclude from main works page
b1f8a22 nav: crucible moves to top position
a958f61 fix: natural image dimensions on home page grid
1f81749 feat: proxy crucible stats, natural image aspect ratio
e43c9b7 fix: update static snapshot to week 18 numbers
8f0f1d1 feat: Crucible page fetches live stats from NEON SIGNS API
8dd45cc fix: remove all em-dashes from public copy
