/**
 * migrate-images-to-r2.mjs
 *
 * Migrates all artwork images from the local image_export/ directory
 * (downloaded from Manus CDN in Task 3) to Cloudflare R2.
 *
 * After migration, updates the imageUrl and thumbnailUrl fields in the
 * database to point to the new R2 public URLs.
 *
 * Prerequisites:
 *   1. Run Task 3 image extraction first (scripts/extract-images.mjs)
 *   2. Set environment variables:
 *        R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY,
 *        R2_BUCKET_NAME, R2_PUBLIC_URL, DATABASE_URL
 *   3. pnpm install (or npm install) to have @aws-sdk/client-s3 available
 *
 * Usage:
 *   node scripts/migrate-images-to-r2.mjs
 *   node scripts/migrate-images-to-r2.mjs --dry-run   # preview only, no uploads
 *   node scripts/migrate-images-to-r2.mjs --limit 10  # migrate first 10 works
 */

import "dotenv/config";
import { S3Client, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { readFileSync, existsSync } from "fs";
import { join, extname, dirname } from "path";
import { fileURLToPath } from "url";
import mysql from "mysql2/promise";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, "..");
const MANIFEST_PATH = join(PROJECT_ROOT, "image_export", "manifest.json");

// ─── CLI flags ───────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const LIMIT_IDX = args.indexOf("--limit");
const LIMIT = LIMIT_IDX !== -1 ? parseInt(args[LIMIT_IDX + 1], 10) : Infinity;

// ─── Validation ──────────────────────────────────────────────────────────────

const REQUIRED_VARS = [
  "R2_ACCOUNT_ID",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "R2_BUCKET_NAME",
  "R2_PUBLIC_URL",
  "DATABASE_URL",
];

for (const v of REQUIRED_VARS) {
  if (!process.env[v]) {
    console.error(`❌ Missing required environment variable: ${v}`);
    process.exit(1);
  }
}

if (!existsSync(MANIFEST_PATH)) {
  console.error(`❌ Manifest not found at ${MANIFEST_PATH}`);
  console.error("   Run scripts/extract-images.mjs first (Task 3).");
  process.exit(1);
}

// ─── R2 client ───────────────────────────────────────────────────────────────

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const BUCKET = process.env.R2_BUCKET_NAME;
const PUBLIC_URL = process.env.R2_PUBLIC_URL.replace(/\/+$/, "");

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getMimeType(filePath) {
  const ext = extname(filePath).toLowerCase();
  const map = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".avif": "image/avif",
  };
  return map[ext] ?? "application/octet-stream";
}

async function objectExists(key) {
  try {
    await r2.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
    return true;
  } catch {
    return false;
  }
}

async function uploadToR2(localPath, r2Key) {
  if (DRY_RUN) {
    console.log(`  [DRY RUN] Would upload: ${localPath} → r2://${BUCKET}/${r2Key}`);
    return `${PUBLIC_URL}/${r2Key}`;
  }

  if (await objectExists(r2Key)) {
    console.log(`  ⏭  Already exists: ${r2Key}`);
    return `${PUBLIC_URL}/${r2Key}`;
  }

  const body = readFileSync(localPath);
  const contentType = getMimeType(localPath);

  await r2.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: r2Key,
      Body: body,
      ContentType: contentType,
    })
  );

  return `${PUBLIC_URL}/${r2Key}`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("=".repeat(60));
  console.log("  Neon Crucible — Image Migration to Cloudflare R2");
  console.log("=".repeat(60));
  if (DRY_RUN) console.log("  ⚠️  DRY RUN MODE — no files will be uploaded");
  console.log(`  Bucket: ${BUCKET}`);
  console.log(`  Public URL: ${PUBLIC_URL}`);
  console.log("");

  const manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf-8"));
  const workIds = Object.keys(manifest);
  const toProcess = LIMIT < Infinity ? workIds.slice(0, LIMIT) : workIds;

  console.log(`  Works to migrate: ${toProcess.length} of ${workIds.length}`);
  console.log("");

  // Connect to database
  const conn = await mysql.createConnection(process.env.DATABASE_URL);

  let uploaded = 0;
  let skipped = 0;
  let errors = 0;
  const urlUpdates = []; // { workId, imageUrl, thumbnailUrl }

  for (const workId of toProcess) {
    const entry = manifest[workId];
    const localPath = entry.full?.localPath;

    if (!localPath || !existsSync(localPath)) {
      console.log(`  ⚠️  Work ${workId}: local file not found (${localPath})`);
      skipped++;
      continue;
    }

    const ext = extname(localPath) || ".jpg";
    const r2Key = `works/${workId}${ext}`;

    process.stdout.write(`  [${uploaded + skipped + errors + 1}/${toProcess.length}] Work ${workId}: `);

    try {
      const newUrl = await uploadToR2(localPath, r2Key);
      console.log(`✓ ${newUrl}`);
      urlUpdates.push({ workId: parseInt(workId, 10), imageUrl: newUrl, thumbnailUrl: newUrl });
      uploaded++;
    } catch (err) {
      console.log(`✗ ERROR: ${err.message}`);
      errors++;
    }
  }

  console.log("");
  console.log("─".repeat(60));
  console.log(`  Upload summary: ${uploaded} uploaded, ${skipped} skipped, ${errors} errors`);

  // Update database
  if (!DRY_RUN && urlUpdates.length > 0) {
    console.log("");
    console.log(`  Updating database URLs for ${urlUpdates.length} works...`);

    for (const { workId, imageUrl, thumbnailUrl } of urlUpdates) {
      await conn.execute(
        "UPDATE works SET imageUrl = ?, thumbnailUrl = ?, updatedAt = NOW() WHERE id = ?",
        [imageUrl, thumbnailUrl, workId]
      );
    }

    console.log(`  ✓ Database updated`);
  } else if (DRY_RUN) {
    console.log(`  [DRY RUN] Would update ${urlUpdates.length} database rows`);
  }

  await conn.end();

  console.log("");
  console.log("=".repeat(60));
  if (errors > 0) {
    console.log(`  ⚠️  Completed with ${errors} errors. Re-run to retry failed uploads.`);
    process.exit(1);
  } else {
    console.log("  ✓ Migration complete");
    process.exit(0);
  }
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
