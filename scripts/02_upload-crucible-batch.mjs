/**
 * upload-crucible-batch.mjs
 *
 * Bulk upload Crucible Year works to R2 and the database.
 *
 * PRIMARY SOURCE:    CY_HYPER_UNIFIED_FEATURE_MATRIX.json  (Oracle V7 output)
 * SUPPLEMENTAL:      crucible_companion.csv  (ink, dimensions, prose fields)
 *
 * Workflow:
 *   1. Re-run the Oracle → new JSON is generated
 *   2. Drop JSON into ~/neon-crucible/scripts/
 *   3. Run: node scripts/upload-crucible-batch.mjs --dry-run
 *   4. Run: node scripts/upload-crucible-batch.mjs --tcodes T_291,T_292  (test)
 *   5. Run: node scripts/upload-crucible-batch.mjs  (full batch — skips existing)
 *
 * Safety features:
 *   --dry-run        Validates everything, uploads nothing
 *   --tcodes T_x,T_y Upload only specified works
 *   --force          Re-upload even if work already has imageUrl in DB
 *   Resume-safe:     Works with imageUrl already set are skipped automatically
 *
 * Files needed in ~/neon-crucible/scripts/:
 *   - CY_HYPER_UNIFIED_FEATURE_MATRIX.json  (Oracle output, update after each run)
 *   - crucible_companion.csv                (ink/dimensions/prose, update when available)
 *
 * Image files needed in /storage/emulated/0/NEON/Website_IMAGE_Dump/:
 *   - T_001.jpg, T_002.jpg ... T_294.jpg  (only publishable ones needed)
 *
 * Required env vars (Railway project variables):
 *   R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY,
 *   R2_BUCKET_NAME, R2_PUBLIC_URL, DATABASE_URL
 */

import "dotenv/config";
import { S3Client, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { readFileSync, existsSync, statSync, createReadStream } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import mysql from "mysql2/promise";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── CLI flags ───────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const FORCE = args.includes("--force");

const TCODES_IDX = args.indexOf("--tcodes");
const TCODES_FILTER = TCODES_IDX !== -1
  ? new Set(args[TCODES_IDX + 1].split(",").map(s => s.trim()))
  : null;

const JSON_PATH = join(__dirname, "CY_HYPER_UNIFIED_FEATURE_MATRIX.json");
const COMPANION_PATH = join(__dirname, "crucible_companion.csv");
const IMAGE_DIR = process.env.CRUCIBLE_IMAGE_DIR
  || "/storage/emulated/0/NEON/Website_IMAGE_Dump";

// ─── Surface name lookup ─────────────────────────────────────────────────────

const SURFACE_NAMES = {
  S1: "First Test Sheet",
  S2: "Hongxing Fine Mulberry",
  S3: "Tan Xi Special Pure",
  S4: "Tanpi Sandalwood Bark",
  S5: "Water-Damaged Lot",
  S6: "Red Star Dan Xuan",
  S7: "Jing Xian Processed",
  S8: "Heavy Pulp Fiber",
  S9: "Multi-Session Stage",
  S10: "Red Star Ink Field",
  S11: "Red Star Moxin Leather",
  S12: "Red Star Mo Yun Bark",
};

// Known area_cm2 → dimensions string
const AREA_TO_DIMS = {
  20000: "100x200cm",
  9800:  "70x140cm",
  9660:  "70x138cm",
  17460: "97x180cm",
  12600: "70x180cm",
  13580: "97x140cm",
  16380: "70x234cm",
};

// ─── Validation ──────────────────────────────────────────────────────────────

const REQUIRED_VARS = [
  "R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY",
  "R2_BUCKET_NAME", "R2_PUBLIC_URL", "DATABASE_URL",
];
for (const v of REQUIRED_VARS) {
  if (!process.env[v]) {
    console.error(`MISSING ENV VAR: ${v}`);
    process.exit(1);
  }
}
if (!existsSync(JSON_PATH)) {
  console.error(`Feature matrix not found: ${JSON_PATH}`);
  console.error("Copy CY_HYPER_UNIFIED_FEATURE_MATRIX.json into scripts/");
  process.exit(1);
}
if (!existsSync(IMAGE_DIR)) {
  console.error(`Image directory not found: ${IMAGE_DIR}`);
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

// ─── Image size profiles ─────────────────────────────────────────────────────

const SIZES = [
  { suffix: "thumb",  width: 400,  quality: 80 },
  { suffix: "card",   width: 800,  quality: 82 },
  { suffix: "detail", width: 1600, quality: 85 },
  { suffix: "full",   width: 2400, quality: 87 },
];

// ─── CSV parser ──────────────────────────────────────────────────────────────

function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter(l => l.trim());
  const headers = parseCSVLine(lines[0]);
  return lines.slice(1).map(line => {
    const values = parseCSVLine(line);
    const row = {};
    headers.forEach((h, i) => row[h] = values[i] ?? "");
    return row;
  });
}

function parseCSVLine(line) {
  const result = [];
  let current = "", inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (c === "," && !inQuotes) {
      result.push(current); current = "";
    } else {
      current += c;
    }
  }
  result.push(current);
  return result;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function r2Key(tCode, sovereignId, suffix) {
  return `works/crucible/${sovereignId}_${tCode}_${suffix}.jpg`;
}

function pubUrl(key) {
  return `${PUBLIC_URL}/${key}`;
}

async function processImage(srcPath, tCode, sovereignId) {
  const buffer = readFileSync(srcPath);
  const results = {};
  for (const size of SIZES) {
    const raw = await sharp(buffer)
      .resize(size.width, null, { withoutEnlargement: true })
      .jpeg({ quality: size.quality, progressive: true, mozjpeg: true })
      .toBuffer();
    const optimised = Buffer.from(raw);
    const key = r2Key(tCode, sovereignId, size.suffix);
    results[size.suffix] = { key, url: pubUrl(key), buffer: optimised, bytes: optimised.length };
  }
  return results;
}

async function upload(buffer, key) {
  const body = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
  await r2.send(new PutObjectCommand({
    Bucket: BUCKET, Key: key, Body: body,
    ContentType: "image/jpeg",
    CacheControl: "public, max-age=31536000, immutable",
  }));
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log("=".repeat(70));
  console.log("CRUCIBLE BULK UPLOAD — Oracle V7 JSON pipeline");
  console.log("=".repeat(70));
  console.log(`Mode:      ${DRY_RUN ? "DRY RUN (nothing uploaded or written)" : "LIVE"}`);
  console.log(`Source:    ${JSON_PATH}`);
  console.log(`Images:    ${IMAGE_DIR}`);
  if (TCODES_FILTER) console.log(`Filter:    ${[...TCODES_FILTER].join(", ")}`);
  console.log("");

  // Load feature matrix
  const matrix = JSON.parse(readFileSync(JSON_PATH, "utf-8"));
  console.log(`Oracle:    ${matrix.app} ${matrix.version}`);
  console.log(`Works:     ${matrix.totals.rows} total`);

  // Load companion CSV if it exists
  const companion = {};
  if (existsSync(COMPANION_PATH)) {
    const rows = parseCSV(readFileSync(COMPANION_PATH, "utf-8"));
    for (const r of rows) companion[r.t_code] = r;
    console.log(`Companion: ${rows.length} rows loaded (ink, dimensions, prose)`);
  } else {
    console.log(`Companion: not found — ink/dimensions will be blank`);
  }
  console.log("");

  // Build upload queue: publishable only
  let queue = matrix.works.filter(w => w.disp === "SA" || w.disp === "SHP");
  if (TCODES_FILTER) {
    queue = queue.filter(w => TCODES_FILTER.has(w.t_code));
  }
  console.log(`Queued:    ${queue.length} publishable works (SA + SHP)`);
  console.log(`Withheld:  ${matrix.works.length - matrix.works.filter(w => w.disp === "SA" || w.disp === "SHP").length} works (the Tithe — private)`);
  console.log("");

  // Connect to DB
  const conn = await mysql.createConnection(process.env.DATABASE_URL);

  // Get Crucible phase ID
  const [phaseRows] = await conn.execute(
    "SELECT id FROM phases WHERE code = 'Crucible' LIMIT 1"
  );
  if (!phaseRows.length) {
    console.error("Crucible phase not found. Run 01_migration.sql first.");
    await conn.end();
    process.exit(1);
  }
  const phaseId = phaseRows[0].id;
  console.log(`Phase ID:  ${phaseId} (Crucible)\n`);

  const stats = { total: queue.length, uploaded: 0, skipped: 0, noFile: 0, failed: 0 };
  const failures = [];

  for (let i = 0; i < queue.length; i++) {
    const w = queue[i];
    const tc = w.t_code;
    const cid = w.cid; // sovereign ID e.g. "666249"
    const comp = companion[tc] || {};
    const progress = `[${String(i + 1).padStart(3)}/${queue.length}]`;

    console.log(`${progress} ${tc} / ${cid}  W${w.wk}  ${w.surface}  ${w.disp}  ★${w.rating}`);

    // Resolve dimensions
    const dims = comp.dimensions
      || AREA_TO_DIMS[Math.round(w.area_cm2)]
      || "";

    if (!dims) {
      console.log(`  SKIP — no dimensions available`);
      stats.noFile++;
      failures.push({ tc, reason: "missing dimensions" });
      continue;
    }

    // Find image
    const imgPath = join(IMAGE_DIR, `${tc}.jpg`);
    if (!existsSync(imgPath)) {
      console.log(`  SKIP — image not found: ${tc}.jpg`);
      stats.noFile++;
      failures.push({ tc, reason: "image file missing" });
      continue;
    }

    const fileMB = (statSync(imgPath).size / 1024 / 1024).toFixed(1);
    console.log(`  Image:  ${fileMB} MB  Dims: ${dims}`);

    // Skip if already uploaded (unless --force)
    if (!FORCE) {
      const [existing] = await conn.execute(
        "SELECT id, imageUrl FROM works WHERE tCode = ? LIMIT 1", [tc]
      );
      if (existing.length && existing[0].imageUrl) {
        console.log(`  SKIP — already in DB with imageUrl`);
        stats.skipped++;
        continue;
      }
    }

    if (DRY_RUN) {
      console.log(`  DRY RUN — would optimise + upload + write DB`);
      stats.uploaded++;
      console.log("");
      continue;
    }

    try {
      // Optimise
      console.log(`  Optimising...`);
      const sizes = await processImage(imgPath, tc, cid);
      for (const [s, info] of Object.entries(sizes)) {
        console.log(`    ${s.padEnd(7)} ${String(Math.round(info.bytes / 1024)).padStart(4)} KB`);
      }

      // Upload
      console.log(`  Uploading to R2...`);
      for (const [, info] of Object.entries(sizes)) {
        await upload(info.buffer, info.key);
      }

      // Build DB row values
      const surfaceName = SURFACE_NAMES[w.surface] || comp.surface_name || "";
      const mediumStr = `Sumi ink on ${surfaceName}`;
      const conceptTags = comp.concept_tags
        ? JSON.stringify(comp.concept_tags.split("|").map(s => s.trim()).filter(Boolean))
        : JSON.stringify([]);

      const fullUrl = sizes.full.url;
      const fullKey = sizes.full.key;
      const thumbUrl = sizes.thumb.url;

      // Ambient data as JSON string (for future use in data pages)
      const ambientData = JSON.stringify({
        phase: w.phase,
        weekday: w.weekday,
        week_avg_rating: w.week_avg_rating,
        week_count: w.week_count,
        week_kill_pct: w.week_kill_pct,
        ambient_hours: w.ambient_hours,
        ambient_jester: w.ambient_jester,
        ambient_steps: w.ambient_steps,
        ambient_energy: w.ambient_energy,
        ambient_walking: w.ambient_walking,
        ambient_sciatica: w.ambient_sciatica,
        ambient_rest_days: w.ambient_rest_days,
        ambient_mega_walk: w.ambient_mega_walk,
        area_m2: w.area_m2,
      });

      // Upsert: update if exists, insert if not
      const [existingRows] = await conn.execute(
        "SELECT id FROM works WHERE tCode = ? LIMIT 1", [tc]
      );

      const fields = [
        cid,            // title (publication ID)
        tc,             // slug (URL identifier)
        phaseId,
        w.date,
        w.date.slice(0, 4),
        mediumStr,
        dims,
        comp.color_palette || null,
        comp.emotional_register || null,
        fullUrl,
        fullKey,
        thumbUrl,
        comp.curatorial_hook || null,
        comp.neon_reading || null,
        conceptTags,
        comp.series_name || null,
        tc,             // tCode
        cid,            // sovereignId
        w.surface,
        surfaceName,
        comp.ink || null,
        w.disp,
        w.hrs ?? null,
        w.rating ?? null,
        w.wk ?? null,
        w.orient || null,
        ambientData,    // stored in technicalObservation as JSON until schema extended
        comp.discovery_note || null,
        true,           // isPublished
        w.t_num,        // sortOrder
      ];

      if (existingRows.length) {
        await conn.execute(
          `UPDATE works SET
            title=?, slug=?, phaseId=?, dateCreated=?, year=?,
            medium=?, dimensions=?, colorPalette=?, emotionalRegister=?,
            imageUrl=?, imageKey=?, thumbnailUrl=?,
            curatorialHook=?, neonReading=?, conceptTags=?, seriesName=?,
            tCode=?, sovereignId=?, surface=?, surfaceName=?, ink=?,
            disposition=?, hours=?, rating=?, weekNumber=?, orientation=?,
            technicalObservation=?, discoveryNote=?,
            isPublished=?, sortOrder=?
          WHERE tCode=?`,
          [...fields, tc]
        );
        console.log(`  UPDATED DB row`);
      } else {
        await conn.execute(
          `INSERT INTO works (
            title, slug, phaseId, dateCreated, year,
            medium, dimensions, colorPalette, emotionalRegister,
            imageUrl, imageKey, thumbnailUrl,
            curatorialHook, neonReading, conceptTags, seriesName,
            tCode, sovereignId, surface, surfaceName, ink,
            disposition, hours, rating, weekNumber, orientation,
            technicalObservation, discoveryNote,
            isPublished, sortOrder
          ) VALUES (${fields.map(() => "?").join(",")})`,
          fields
        );
        console.log(`  INSERTED DB row`);
      }

      stats.uploaded++;
      console.log(`  OK`);
    } catch (err) {
      console.log(`  FAILED: ${err.message}`);
      stats.failed++;
      failures.push({ tc, reason: err.message });
    }
    console.log("");
  }

  await conn.end();

  // Summary
  console.log("=".repeat(70));
  console.log("SUMMARY");
  console.log("=".repeat(70));
  console.log(`Total queued:         ${stats.total}`);
  console.log(`Uploaded/written:     ${stats.uploaded}`);
  console.log(`Skipped (exists):     ${stats.skipped}`);
  console.log(`Skipped (no file):    ${stats.noFile}`);
  console.log(`Failed:               ${stats.failed}`);
  if (failures.length) {
    console.log("\nFAILURES:");
    for (const f of failures) console.log(`  ${f.tc}: ${f.reason}`);
  }
  if (DRY_RUN) console.log("\n(DRY RUN — nothing was uploaded or written to DB)");
}

main().catch(err => {
  console.error("FATAL:", err);
  process.exit(1);
});
