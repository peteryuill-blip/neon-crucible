#!/usr/bin/env node
/**
 * generate-image-sizes.mjs
 * Quarantined Local Image Processing — No Cloud Uploads
 * Environment: Termux / Node.js / Sharp
 *
 * Reads:   ./pull/T_*.jpg  (or t_*.jpg)
 * Outputs: /storage/emulated/0/NEON/T_1000/T_xxx_full.webp
 *          /storage/emulated/0/NEON/T_1000/T_xxx_lg.webp
 *          /storage/emulated/0/NEON/T_1000/T_xxx_md.webp
 *          /storage/emulated/0/NEON/T_1000/T_xxx_sm.webp
 *
 * ALL four sizes are generated for EVERY source image.
 * Skips any output files that already exist (no duplicates).
 * Strictly maintains original aspect ratio. No cropping.
 */

import { readdir, mkdir, stat, access } from "node:fs/promises";
import { join, basename, extname } from "node:path";
import sharp from "sharp";

/* ─── Config ─── */
const SOURCE_DIR = "./pull";
const OUTPUT_DIR = "/storage/emulated/0/NEON/T_1000";

// ALL sizes generated for every image — gallery picks later
const SIZES = {
  full: { width: 2400, quality: 85, suffix: "_full" },
  lg:   { width: 1600, quality: 82, suffix: "_lg" },
  md:   { width: 900,  quality: 80, suffix: "_md" },
  sm:   { width: 450,  quality: 78, suffix: "_sm" },
};

/* ─── Helpers ─── */
const ensureDir = async (dir) => {
  try {
    await mkdir(dir, { recursive: true });
  } catch {
    // exists
  }
};

const fileExists = async (path) => {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};

const getBaseName = (filename) => {
  return basename(filename, extname(filename));
};

const processImage = async (filePath) => {
  const base = getBaseName(filePath);
  const inputBuffer = await sharp(filePath).toBuffer();
  const metadata = await sharp(inputBuffer).metadata();

  console.log(`\n▸ Processing: ${basename(filePath)}`);
  console.log(`  Original: ${metadata.width}×${metadata.height}px`);

  const results = [];
  let skipped = 0;

  for (const [key, config] of Object.entries(SIZES)) {
    const outputName = `${base}${config.suffix}.webp`;
    const outputPath = join(OUTPUT_DIR, outputName);

    // Skip if already exists
    if (await fileExists(outputPath)) {
      const outStat = await stat(outputPath);
      const kb = (outStat.size / 1024).toFixed(1);
      console.log(`  ⊘ ${key.toUpperCase().padEnd(4)}  ${outputName.padEnd(30)}  ALREADY EXISTS  ${kb} KB`);
      skipped++;
      continue;
    }

    const aspectRatio = metadata.width / metadata.height;
    const targetWidth = Math.min(config.width, metadata.width);
    const targetHeight = Math.round(targetWidth / aspectRatio);

    await sharp(inputBuffer)
      .resize(targetWidth, targetHeight, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({
        quality: config.quality,
        effort: 6,
        smartSubsample: true,
      })
      .toFile(outputPath);

    const outStat = await stat(outputPath);
    results.push({
      size: key,
      file: outputName,
      dimensions: `${targetWidth}×${targetHeight}`,
      bytes: outStat.size,
    });
  }

  results.forEach((r) => {
    const kb = (r.bytes / 1024).toFixed(1);
    console.log(`  ✓ ${r.size.toUpperCase().padEnd(4)}  ${r.file.padEnd(30)}  ${r.dimensions.padEnd(12)}  ${kb} KB`);
  });

  return { generated: results.length, skipped };
};

/* ─── Main ─── */
const main = async () => {
  await ensureDir(OUTPUT_DIR);

  const entries = await readdir(SOURCE_DIR, { withFileTypes: true });

  const sourceImages = entries
    .filter((e) => {
      if (!e.isFile()) return false;
      const lower = e.name.toLowerCase();
      return lower.startsWith("t_") && lower.endsWith(".jpg");
    })
    .map((e) => join(SOURCE_DIR, e.name));

  if (sourceImages.length === 0) {
    console.log(`No T_*.jpg files found in ${SOURCE_DIR}`);
    process.exit(0);
  }

  console.log(`\n╔════════════════════════════════════════════════════╗`);
  console.log(`║  QUARANTINED LOCAL IMAGE PROCESSOR                 ║`);
  console.log(`║  Source: ${SOURCE_DIR.padEnd(37)}  ║`);
  console.log(`║  Output: ${OUTPUT_DIR.padEnd(37)}  ║`);
  console.log(`╚════════════════════════════════════════════════════╝`);
  console.log(`Found ${sourceImages.length} image(s) to process.`);
  console.log(`Skipping any files already present in output.\n`);

  let processed = 0;
  let failed = 0;
  let totalGenerated = 0;
  let totalSkipped = 0;

  for (const imgPath of sourceImages) {
    try {
      const { generated, skipped } = await processImage(imgPath);
      totalGenerated += generated;
      totalSkipped += skipped;
      processed++;
    } catch (err) {
      console.error(`  ✗ FAILED: ${basename(imgPath)} — ${err.message}`);
      failed++;
    }
  }

  console.log(`\n────────────────────────────────────────────────────`);
  console.log(`Done.  Images scanned: ${processed}  Failed: ${failed}`);
  console.log(`Generated: ${totalGenerated}  Skipped (already exist): ${totalSkipped}`);
  console.log(`────────────────────────────────────────────────────\n`);
};

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
