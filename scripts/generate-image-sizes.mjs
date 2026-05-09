#!/usr/bin/env node
import { readdir, mkdir, stat, access } from "node:fs/promises";
import { join, basename, extname } from "node:path";
import { Jimp } from "jimp";

const SOURCE_DIR = "/storage/emulated/0/NEON/Website_IMAGE_Dump";
const OUTPUT_DIR = "/storage/emulated/0/NEON/T_1000";

const SIZES = {
  full: { width: 2400, quality: 85, suffix: "_full" },
  lg:   { width: 1600, quality: 82, suffix: "_lg" },
  md:   { width: 900,  quality: 80, suffix: "_md" },
  sm:   { width: 450,  quality: 78, suffix: "_sm" },
};

const ensureDir = async (dir) => { try { await mkdir(dir, { recursive: true }); } catch {} };
const fileExists = async (path) => { try { await access(path); return true; } catch { return false; } };
const getBaseName = (filename) => basename(filename, extname(filename));

const processImage = async (filePath) => {
  const base = getBaseName(filePath);
  console.log(`\n▸ Processing: ${basename(filePath)}`);
  const image = await Jimp.read(filePath);
  const w = image.bitmap.width;
  const h = image.bitmap.height;
  console.log(`  Original: ${w}×${h}px`);
  const results = [];
  let skipped = 0;
  for (const [key, cfg] of Object.entries(SIZES)) {
    const outName = `${base}${cfg.suffix}.webp`;
    const outPath = join(OUTPUT_DIR, outName);
    if (await fileExists(outPath)) {
      const st = await stat(outPath);
      console.log(`  ⊘ ${key.toUpperCase().padEnd(4)}  ${outName.padEnd(30)}  ALREADY EXISTS  ${(st.size/1024).toFixed(1)} KB`);
      skipped++;
      continue;
    }
    const ratio = w / h;
    const tw = Math.min(cfg.width, w);
    const th = Math.round(tw / ratio);
    const resized = image.clone().resize({ w: tw, h: th });
    await resized.write(outPath, { format: "webp", quality: cfg.quality });
    const st = await stat(outPath);
    results.push({ size: key, file: outName, dim: `${tw}×${th}`, bytes: st.size });
  }
  results.forEach(r => console.log(`  ✓ ${r.size.toUpperCase().padEnd(4)}  ${r.file.padEnd(30)}  ${r.dim.padEnd(12)}  ${(r.bytes/1024).toFixed(1)} KB`));
  return { generated: results.length, skipped };
};

const main = async () => {
  await ensureDir(OUTPUT_DIR);
  const entries = await readdir(SOURCE_DIR, { withFileTypes: true });
  const imgs = entries.filter(e => e.isFile() && e.name.toLowerCase().startsWith("t_") && e.name.toLowerCase().endsWith(".jpg")).map(e => join(SOURCE_DIR, e.name));
  if (!imgs.length) { console.log(`No T_*.jpg in ${SOURCE_DIR}`); process.exit(0); }
  console.log(`\n╔════════════════════════════════════════════════════╗`);
  console.log(`║  QUARANTINED LOCAL IMAGE PROCESSOR                 ║`);
  console.log(`║  Source: ${SOURCE_DIR.padEnd(37)}  ║`);
  console.log(`║  Output: ${OUTPUT_DIR.padEnd(37)}  ║`);
  console.log(`╚════════════════════════════════════════════════════╝`);
  console.log(`Found ${imgs.length} image(s). Skipping existing files.\n`);
  let ok = 0, fail = 0, gen = 0, skip = 0;
  for (const p of imgs) {
    try { const r = await processImage(p); gen += r.generated; skip += r.skipped; ok++; }
    catch (e) { console.error(`  ✗ FAILED: ${basename(p)} — ${e.message}`); fail++; }
  }
  console.log(`\n────────────────────────────────────────────────────`);
  console.log(`Done.  Scanned: ${ok}  Failed: ${fail}  Generated: ${gen}  Skipped: ${skip}`);
  console.log(`────────────────────────────────────────────────────\n`);
};
main().catch(e => { console.error("Fatal:", e); process.exit(1); });
