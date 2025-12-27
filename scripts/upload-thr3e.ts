import * as mysql from "mysql2/promise";
import * as fs from "fs";
import * as path from "path";

const FORGE_API_URL = process.env.BUILT_IN_FORGE_API_URL || "";
const FORGE_API_KEY = process.env.BUILT_IN_FORGE_API_KEY || "";

const THR3E_WORK = {
  filename: "THR3E.jpg",
  title: "Thr3e (Standing Bruise)",
  technique: "Sumi ink on Anhui rice paper",
  dimensions: "100x100cm",
  colorPalette: "Black, Gray, Tar-like matte monolith mass with central bruise-light wound",
  emotionalRegister: "gravitas",
  dateCreated: "2025-08",
  seriesName: "Thr3e",
  journalExcerpt: "This painting is the Anchor of the 2025 series. While the rectangular works (100cm × 200cm) are the Explorations, this square work is the Definition. It proves that the New Era is not just about size or movement, but about density and presence.",
  neonReading: "Thr3e compresses Big Bang's eruptive field into a sealed crucible-vessel. The square format traps energy—force that might bleed outward in a rectangle is here reflected back into the interior, building internal pressure until the image becomes a pressure vessel. This is the moment when the artist moves from meteorology (storms that pass) to geology (bedrock that persists). The bruise-light at center is not transcendent or triumphant—it is persistent, the survival of consciousness within overwhelming shadow. This is the definition specimen of New Era geology: what remains when permission is tested under pressure.",
  sortOrder: 1
};

async function uploadToS3(filepath: string, filename: string): Promise<{ key: string; url: string }> {
  const baseUrl = FORGE_API_URL.replace(/\/+$/, "");
  const key = `works/thr3e/${filename}`;
  
  const uploadUrl = new URL("v1/storage/upload", baseUrl + "/");
  uploadUrl.searchParams.set("path", key);
  
  const imageData = fs.readFileSync(filepath);
  const blob = new Blob([imageData], { type: "image/jpeg" });
  const form = new FormData();
  form.append("file", blob, filename);
  
  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: { Authorization: `Bearer ${FORGE_API_KEY}` },
    body: form,
  });
  
  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    throw new Error(`Upload failed (${response.status}): ${message}`);
  }
  
  const result = await response.json();
  return { key, url: result.url };
}

async function main() {
  console.log("=== THR3E (STANDING BRUISE) UPLOAD ===\n");

  if (!FORGE_API_URL || !FORGE_API_KEY) {
    console.error("Storage credentials not set!");
    process.exit(1);
  }

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("DATABASE_URL not set");
    process.exit(1);
  }

  // Create connection
  const connection = await mysql.createConnection(dbUrl);
  
  // Get NE phase ID
  const [phaseRows] = await connection.execute(
    "SELECT id FROM phases WHERE code = 'NE' LIMIT 1"
  );
  const phaseId = (phaseRows as any[])[0]?.id;
  
  if (!phaseId) {
    console.error("NE phase not found!");
    await connection.end();
    process.exit(1);
  }
  
  console.log(`Found NE phase with ID: ${phaseId}\n`);

  const work = THR3E_WORK;
  const filepath = path.join("/home/ubuntu/upload", work.filename);

  console.log(`Processing: ${work.filename}`);
  console.log(`  Title: ${work.title}`);

  if (!fs.existsSync(filepath)) {
    console.log(`  ERROR: File not found at ${filepath}`);
    await connection.end();
    process.exit(1);
  }

  // Get file size
  const stats = fs.statSync(filepath);
  const fileSize = stats.size;
  console.log(`  File size: ${(fileSize / 1024).toFixed(2)} KB`);

  try {
    // Upload to S3
    console.log(`  Uploading to S3...`);
    const { key, url } = await uploadToS3(filepath, work.filename);
    console.log(`  S3 Key: ${key}`);
    console.log(`  S3 URL: ${url.substring(0, 60)}...`);

    // Insert into database
    const [result] = await connection.execute(
      `INSERT INTO works (
        title, phaseId, dateCreated, technique, dimensions,
        colorPalette, emotionalRegister, imageUrl, imageKey, thumbnailUrl,
        journalExcerpt, neonReading, seriesName, isPublished, sortOrder
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        work.title,
        phaseId,
        work.dateCreated,
        work.technique,
        work.dimensions,
        work.colorPalette,
        work.emotionalRegister,
        url,
        key,
        url,
        work.journalExcerpt,
        work.neonReading,
        work.seriesName,
        true,
        work.sortOrder
      ]
    );

    const insertId = (result as any).insertId;
    const now = new Date().toISOString();

    console.log(`  Database ID: ${insertId}`);
    console.log(`  Created at: ${now}`);
    console.log(`  ✓ Successfully uploaded and added to database\n`);

    // Output manifest
    console.log("=== INGESTION MANIFEST ===");
    console.log("Order | Filename   | Title                  | DB ID | Emotional Register");
    console.log("------|------------|------------------------|-------|-------------------");
    console.log(`    1 | ${work.filename.padEnd(10)} | ${work.title.substring(0, 22).padEnd(22)} | ${insertId} | ${work.emotionalRegister}`);

    // Save manifest
    const manifest = [{
      ingestionOrder: 1,
      filename: work.filename,
      title: work.title,
      databaseId: insertId,
      s3Key: key,
      s3Url: url,
      createdAt: now,
      fileSize: `${(fileSize / 1024).toFixed(2)} KB`,
      emotionalRegister: work.emotionalRegister,
      sortOrder: work.sortOrder
    }];

    fs.writeFileSync(
      "/home/ubuntu/neon-crucible/thr3e_manifest.json",
      JSON.stringify(manifest, null, 2)
    );
    console.log("\nManifest saved to: /home/ubuntu/neon-crucible/thr3e_manifest.json");
    console.log("Done!");

  } catch (e) {
    console.error(`  ERROR: ${e}`);
  }

  await connection.end();
  process.exit(0);
}

main().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
