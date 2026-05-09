#!/usr/bin/env node
/**
 * Generate scaled image variants from full-size R2 assets
 * Creates: _large.jpg (1200w), _medium.jpg (600w), _thumb.jpg (300w)
 */

import { S3Client, GetObjectCommand, PutObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import sharp from "sharp";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// R2 / S3 config — reads from env or uses defaults
const R2_ENDPOINT = process.env.R2_ENDPOINT || process.env.VITE_R2_ENDPOINT || "";
const R2_ACCESS_KEY = process.env.R2_ACCESS_KEY_ID || process.env.VITE_R2_ACCESS_KEY_ID || "";
const R2_SECRET_KEY = process.env.R2_SECRET_ACCESS_KEY || process.env.VITE_R2_SECRET_ACCESS_KEY || "";
const R2_BUCKET = process.env.R2_BUCKET || process.env.VITE_R2_BUCKET || "neon-crucible-assets";

const SIZES = [
  { suffix: "_large", width: 1200 },
  { suffix: "_medium", width: 600 },
  { suffix: "_thumb", width: 300 },
];

const s3 = new S3Client({
  region: "auto",
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY,
    secretAccessKey: R2_SECRET_KEY,
  },
});

const TEMP_DIR = path.join(__dirname, "..", "tmp-image-processing");

async function ensureTempDir() {
  try {
    await fs.mkdir(TEMP_DIR, { recursive: true });
  } catch {}
}

async function downloadImage(key) {
  const command = new GetObjectCommand({ Bucket: R2_BUCKET, Key: key });
  const response = await s3.send(command);
  const chunks = [];
  for await (const chunk of response.Body) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

async function uploadImage(key, buffer, contentType = "image/jpeg") {
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });
  await s3.send(command);
  console.log(`  Uploaded: ${key}`);
}

async function processImage(fullKey) {
  console.log(`\nProcessing: ${fullKey}`);
  
  // Skip if not a full image
  if (!fullKey.endsWith("_full.jpg")) {
    console.log(`  Skipped (not _full.jpg)`);
    return;
  }

  const baseKey = fullKey.replace("_full.jpg", "");
  
  // Check which sizes already exist
  const existingSizes = [];
  for (const size of SIZES) {
    const sizeKey = `${baseKey}${size.suffix}.jpg`;
    try {
      await s3.send(new GetObjectCommand({ Bucket: R2_BUCKET, Key: sizeKey }));
      existingSizes.push(size.suffix);
    } catch {
      // Doesn't exist, will generate
    }
  }
  
  if (existingSizes.length === SIZES.length) {
    console.log(`  All variants already exist`);
    return;
  }

  // Download full image
  console.log(`  Downloading full image...`);
  const fullBuffer = await downloadImage(fullKey);
  const metadata = await sharp(fullBuffer).metadata();
  console.log(`  Original: ${metadata.width}x${metadata.height}`);

  // Generate each missing size
  for (const size of SIZES) {
    if (existingSizes.includes(size.suffix)) {
      console.log(`  ${size.suffix}: already exists`);
      continue;
    }

    const sizeKey = `${baseKey}${size.suffix}.jpg`;
    console.log(`  Generating ${size.suffix} (${size.width}px wide)...`);
    
    const resizedBuffer = await sharp(fullBuffer)
      .resize(size.width, null, { 
        withoutEnlargement: true,
        fit: "inside",
      })
      .jpeg({ quality: 85, progressive: true })
      .toBuffer();

    await uploadImage(sizeKey, resizedBuffer);
  }
}

async function listAllFullImages(prefix = "works/crucible/") {
  const keys = [];
  let continuationToken = null;
  
  do {
    const command = new ListObjectsV2Command({
      Bucket: R2_BUCKET,
      Prefix: prefix,
      ContinuationToken: continuationToken,
      MaxKeys: 1000,
    });
    
    const response = await s3.send(command);
    for (const obj of response.Contents || []) {
      if (obj.Key.endsWith("_full.jpg")) {
        keys.push(obj.Key);
      }
    }
    continuationToken = response.NextContinuationToken;
  } while (continuationToken);
  
  return keys;
}

async function main() {
  console.log("=== Image Size Generator ===");
  console.log(`Bucket: ${R2_BUCKET}`);
  console.log(`Endpoint: ${R2_ENDPOINT || "(not set — will fail)"}`);
  
  if (!R2_ENDPOINT || !R2_ACCESS_KEY || !R2_SECRET_KEY) {
    console.error("\nERROR: Missing R2 credentials. Set these env vars:");
    console.error("  R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY");
    console.error("\nOr add them to a .env file and run with:");
    console.error("  node --env-file=.env scripts/generate-image-sizes.mjs");
    process.exit(1);
  }

  await ensureTempDir();

  // Find all full-size images
  console.log("\nScanning bucket for _full.jpg images...");
  const fullImages = await listAllFullImages();
  console.log(`Found ${fullImages.length} full-size images`);

  // Process each
  let processed = 0;
  let skipped = 0;
  
  for (const key of fullImages) {
    try {
      await processImage(key);
      processed++;
    } catch (err) {
      console.error(`  FAILED: ${err.message}`);
      skipped++;
    }
  }

  console.log(`\n=== Done ===`);
  console.log(`Processed: ${processed}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Total: ${fullImages.length}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
