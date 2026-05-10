/**
 * generate-image-sizes.mjs
 *
 * Processes raw high-res images from ./pull/ into three
 * web-optimised WebP sizes, preserving exact aspect ratio.
 *
 * Output: ./public/works/crucible/
 *   [name]_lg.webp  — 2400px wide max
 *   [I'vename]_md.webp  — 1200px wide max
 *   [name]_sm.webp  —  600px wide max
 *
 * Usage:
 *   node scripts/generate-image-sizes.mjs
 *   node scripts/generate-image-sizes.mjs --file T_249.jpg
 *   node scripts/generate-image-sizes.mjs --dry-run
 *
 * Requirements:
 *   npm install --cpu=wasm32 sharp   (Android/Termux)
 *   npm install sharp                (desktop)
 */

import sharp from "sharp";
import { readdirSync, existsSync, mkdirSync, statSync } from "fs";
import { join, basename, extname, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT      = join(__dirname, "..");

const SRC_DIR  = "/storage/emulated/0/NEON/Website_IMAGE_Dump";
const DEST_DIR = "/storage/emulated/0/NEON/T_100p";

const SIZES = [
  { suffix: "_lg", width: 2400, quality: 87 },
  { suffix: "_md", width: 1200, quality: 84 },
  { suffix: "_sm", width:  600, quality: 80 },
];

const SUPPORTED = new Set([".jpg", ".jpeg", ".png", ".webp", ".tiff"]);

// ─── CLI ─────────────────────────────────────────────────────────────────────

const args     = process.argv.slice(2);
const DRY_RUN  = args.includes("--dry-run");
const FILE_IDX = args.indexOf("--file");
const SINGLE   = FILE_IDX !== -1 ? args[FILE_IDX + 1] : null;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function log(msg) { console.log(msg); }

function ensureDir(dir) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function getSourceFiles() {
  if (!existsSync(SRC_DIR)) {
    console.error(`Source directory not found: ${SRC_DIR}`);
    process.exit(1);
  }
  const all = readdirSync(SRC_DIR).filter(f => SUPPORTED.has(extname(f).toLowerCase()));
  if (SINGLE) {
    const match = all.filter(f => f === SINGLE);
    if (!match.length) {
      console.error(`File not found in pull/: ${SINGLE}`);
      process.exit(1);
    }
    return match;
  }
  return all;
}

async function processImage(filename) {
  const srcPath  = join(SRC_DIR, filename);
  const stem     = basename(filename, extname(filename)); // e.g. "T_249"
  const fileMB   = (statSync(srcPath).size / 1024 / 1024).toFixed(1);

  log(`\n[${stem}] ${fileMB} MB`);

  // Read source once
  const srcBuffer = sharp(srcPath);
  const meta      = await srcBuffer.metadata();
  const { width: origW, height: origH } = meta;

  log(`  Original: ${origW} × ${origH}px`);

  for (const size of SIZES) {
    const destPath = join(DEST_DIR, `${stem}${size.suffix}.webp`);

    // Skip if already exists (resume-safe)
    if (existsSync(destPath) && !DRY_RUN) {
      log(`  ${size.suffix}: already exists — skip`);
      continue;
    }

    // Calculate output dimensions preserving exact aspect ratio
    // Only downscale — never upscale
    const targetW = Math.min(size.width, origW);
    const scale   = targetW / origW;
    const targetH = Math.round(origH * scale);

    if (DRY_RUN) {
      log(`  ${size.suffix}: would write ${targetW} × ${targetH}px → ${basename(destPath)}`);
      continue;
    }

    // Process: Buffer.from() is required for sharp wasm32 (Android/Termux)
    // SharedArrayBuffer from sharp wasm is not accepted by fs.writeFile directly
    const raw = await sharp(srcPath)
      .resize(targetW, targetH, {
        fit: "fill",            // exact dimensions, no cropping, no padding
        withoutEnlargement: true,
      })
      .webp({
        quality:      size.quality,
        effort:       4,        // 0-6 compression effort; 4 is good balance
        smartSubsample: true,
      })
      .toBuffer();

    const buf = Buffer.from(raw); // critical for wasm32 compatibility

    const { writeFileSync } = await import("fs");
    writeFileSync(destPath, buf);

    const outKB = (buf.length / 1024).toFixed(0);
    log(`  ${size.suffix}: ${targetW} × ${targetH}px  ${outKB} KB → ${basename(destPath)}`);
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log("════════════════════════════════════════════════");
  console.log("CRUCIBLE IMAGE PROCESSOR");
  console.log(`Mode:    ${DRY_RUN ? "DRY RUN" : "LIVE"}`);
  console.log(`Source:  ${SRC_DIR}`);
  console.log(`Dest:    ${DEST_DIR}`);
  console.log("════════════════════════════════════════════════");

  if (!DRY_RUN) ensureDir(DEST_DIR);

  const files = getSourceFiles();
  log(`\nFound ${files.length} image(s) to process\n`);

  let ok = 0, failed = 0;
  const failures = [];

  for (const file of files) {
    try {
      await processImage(file);
      ok++;
    } catch (err) {
      console.error(`  ERROR: ${err.message}`);
      failed++;
      failures.push({ file, reason: err.message });
    }
  }

  console.log("\n════════════════════════════════════════════════");
  console.log(`Processed: ${ok}  Failed: ${failed}`);
  if (failures.length) {
    failures.forEach(f => console.log(`  FAIL  ${f.file}: ${f.reason}`));
  }
  if (DRY_RUN) console.log("\n(DRY RUN — no files written)");
}

main().catch(err => { console.error("FATAL:", err); process.exit(1); });
