/**
 * Image Extraction Script — Task 3
 * Downloads all work images from the Manus CDN (files.manuscdn.com + CloudFront)
 * and saves them locally with their original key structure.
 *
 * Output:
 *   image_export/full/   — full-resolution images (works.imageUrl)
 *   image_export/thumbs/ — thumbnails (works.thumbnailUrl, if different)
 *   image_export/manifest.json — maps work ID → local file paths
 *
 * Usage: node scripts/extract-images.mjs
 */

import { createConnection } from "mysql2/promise";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname, basename } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import https from "https";
import http from "http";
import { createWriteStream } from "fs";

const require = createRequire(import.meta.url);
require("dotenv").config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");
const exportDir = join(projectRoot, "image_export");
const fullDir = join(exportDir, "full");
const thumbsDir = join(exportDir, "thumbs");

mkdirSync(fullDir, { recursive: true });
mkdirSync(thumbsDir, { recursive: true });

const DB_URL = process.env.DATABASE_URL;
if (!DB_URL) {
  console.error("ERROR: DATABASE_URL environment variable not set");
  process.exit(1);
}

const urlMatch = DB_URL.match(
  /mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)/
);
if (!urlMatch) {
  console.error("ERROR: Could not parse DATABASE_URL");
  process.exit(1);
}
const [, user, password, host, port, database] = urlMatch;

// Derive a safe local filename from a URL or key
function safeFilename(urlOrKey) {
  if (!urlOrKey) return null;
  // If it's a full URL, extract the path
  try {
    const u = new URL(urlOrKey);
    return u.pathname.replace(/^\/+/, "").replace(/\//g, "_");
  } catch {
    // It's a key like "works/ph1/filename.jpg"
    return urlOrKey.replace(/\//g, "_");
  }
}

// Download a URL to a local file path
function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    if (existsSync(destPath)) {
      resolve({ skipped: true, path: destPath });
      return;
    }

    const protocol = url.startsWith("https") ? https : http;
    const file = createWriteStream(destPath);

    const request = protocol.get(url, { timeout: 30000 }, (response) => {
      // Follow redirects
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        file.close();
        downloadFile(response.headers.location, destPath).then(resolve).catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        file.close();
        try { require("fs").unlinkSync(destPath); } catch {}
        reject(new Error(`HTTP ${response.statusCode} for ${url}`));
        return;
      }

      response.pipe(file);
      file.on("finish", () => {
        file.close();
        resolve({ skipped: false, path: destPath });
      });
    });

    request.on("error", (err) => {
      file.close();
      try { require("fs").unlinkSync(destPath); } catch {}
      reject(err);
    });

    request.on("timeout", () => {
      request.destroy();
      file.close();
      try { require("fs").unlinkSync(destPath); } catch {}
      reject(new Error(`Timeout downloading ${url}`));
    });
  });
}

async function main() {
  console.log("=== neon-crucible Image Extraction ===");
  console.log(`Output: ${exportDir}`);
  console.log("");

  const conn = await createConnection({
    host,
    port: parseInt(port),
    user,
    password,
    database,
    ssl: { rejectUnauthorized: false },
  });

  const [works] = await conn.query(
    `SELECT id, title, slug, imageUrl, imageKey, thumbnailUrl FROM works WHERE imageUrl IS NOT NULL OR thumbnailUrl IS NOT NULL ORDER BY id`
  );

  await conn.end();

  console.log(`Found ${works.length} works with images\n`);

  const manifest = {};
  let downloaded = 0;
  let skipped = 0;
  let errors = 0;

  for (let i = 0; i < works.length; i++) {
    const work = works[i];
    const progress = `[${String(i + 1).padStart(3, "0")}/${works.length}]`;
    const entry = {
      id: work.id,
      title: work.title,
      slug: work.slug,
      full: null,
      thumb: null,
    };

    // Download full image
    if (work.imageUrl) {
      const filename = safeFilename(work.imageUrl);
      const destPath = join(fullDir, filename);
      try {
        const result = await downloadFile(work.imageUrl, destPath);
        entry.full = {
          originalUrl: work.imageUrl,
          originalKey: work.imageKey || null,
          localPath: `image_export/full/${filename}`,
        };
        if (result.skipped) {
          skipped++;
          process.stdout.write(`${progress} SKIP  ${work.slug || work.id}\n`);
        } else {
          downloaded++;
          process.stdout.write(`${progress} OK    ${work.slug || work.id}\n`);
        }
      } catch (err) {
        errors++;
        entry.full = { originalUrl: work.imageUrl, error: err.message };
        process.stdout.write(`${progress} ERROR ${work.slug || work.id}: ${err.message}\n`);
      }
    }

    // Download thumbnail (only if different from full image)
    if (work.thumbnailUrl && work.thumbnailUrl !== work.imageUrl) {
      const filename = safeFilename(work.thumbnailUrl);
      const destPath = join(thumbsDir, filename);
      try {
        const result = await downloadFile(work.thumbnailUrl, destPath);
        entry.thumb = {
          originalUrl: work.thumbnailUrl,
          localPath: `image_export/thumbs/${filename}`,
        };
        if (!result.skipped) downloaded++;
      } catch (err) {
        errors++;
        entry.thumb = { originalUrl: work.thumbnailUrl, error: err.message };
      }
    } else if (work.thumbnailUrl) {
      // Same as full image — point to same file
      entry.thumb = entry.full;
    }

    manifest[work.id] = entry;
  }

  // Write manifest
  const manifestPath = join(exportDir, "manifest.json");
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf8");

  console.log("\n=== Summary ===");
  console.log(`  Works processed:   ${works.length}`);
  console.log(`  Files downloaded:  ${downloaded}`);
  console.log(`  Files skipped:     ${skipped} (already existed)`);
  console.log(`  Errors:            ${errors}`);
  console.log(`  Manifest:          ${manifestPath}`);

  if (errors > 0) {
    console.log("\n⚠ Some images failed. Check manifest.json for details.");
    process.exit(1);
  } else {
    console.log("\n✓ Image extraction complete");
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
