import * as mysql from "mysql2/promise";
import * as fs from "fs";
import * as path from "path";

const FORGE_API_URL = process.env.BUILT_IN_FORGE_API_URL || "";
const FORGE_API_KEY = process.env.BUILT_IN_FORGE_API_KEY || "";

// Note: CSV specifies COV-Tryptic-2.jpg for Panel I, COV-Tryptic-3.jpg for Panel II, COV-Tryptic-1.jpg for Panel III
// But actual files are named COVTryptic1.jpg, COVTryptic2.jpg, COVTryptic3.jpg
// Based on the visual order and CSV mapping:
// Panel I (Storm-Body) = COVTryptic2.jpg (horizontal turbulence, collapse)
// Panel II (Vessel-Body) = COVTryptic3.jpg (vertical axis, rib-like voids)
// Panel III (Threshold-Body) = COVTryptic1.jpg (upward, luminous portal)

const COVENANT_WORKS = [
  {
    filename: "COVTryptic2.jpg",
    title: "Covenant I: Storm-Body",
    technique: "Sumi ink on Anhui rice paper",
    dimensions: "Large vertical panel",
    colorPalette: "Black, Gray, Horizontal turbulence",
    emotionalRegister: "solemn aftermath",
    dateCreated: "2025-09",
    seriesName: "Covenant",
    journalExcerpt: "Panel I: Collapse and turbulence. The monolithic presence has shattered into horizontal chaos. This is the storm-body that must be organized.",
    neonReading: "Storm-body. The first stage of the law: acknowledging chaos. Horizontal flows without coherence, lower masses weighted and collapsed. This is the shadow before it becomes architecture.",
    sortOrder: 1
  },
  {
    filename: "COVTryptic3.jpg",
    title: "Covenant II: Vessel-Body",
    technique: "Sumi ink on Anhui rice paper",
    dimensions: "Large vertical panel",
    colorPalette: "Black, Gray, Rib-like voids",
    emotionalRegister: "solemn aftermath",
    dateCreated: "2025-09",
    seriesName: "Covenant",
    journalExcerpt: "Panel II: Structure. Organizes around a vertical axis with rib-like void chambers. Pressure energy holds what the storm scattered.",
    neonReading: "Vessel-body. The second stage: containment. The vertical axis appears, organizing the chaos into load-bearing structure. This is the crucible at work: weight becoming architecture.",
    sortOrder: 2
  },
  {
    filename: "COVTryptic1.jpg",
    title: "Covenant III: Threshold-Body",
    technique: "Sumi ink on Anhui rice paper",
    dimensions: "Large vertical panel",
    colorPalette: "Black, Gray, Opening luminosity",
    emotionalRegister: "solemn aftermath",
    dateCreated: "2025-09",
    seriesName: "Covenant",
    journalExcerpt: "Panel III: Emergence. Upward trajectories and a clear threshold. Release energy lifts and opens the void as a luminous portal.",
    neonReading: "Threshold-body. The third stage: release. Marks thin and lift, opening a coherent void. This is negative light—luminosity created through emptiness organized into a gateway. The Covenant is sealed here.",
    sortOrder: 3
  }
];

async function uploadToS3(filepath: string, filename: string): Promise<{ key: string; url: string }> {
  const baseUrl = FORGE_API_URL.replace(/\/+$/, "");
  const key = `works/covenant/${filename}`;
  
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
  console.log("=== COVENANT TRIPTYCH UPLOAD ===\n");
  console.log("Processing 3 panels from the Covenant series...\n");

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

  const manifest: any[] = [];
  const uploadDir = "/home/ubuntu/upload";

  for (let i = 0; i < COVENANT_WORKS.length; i++) {
    const work = COVENANT_WORKS[i];
    const filepath = path.join(uploadDir, work.filename);

    console.log(`[${i + 1}/3] Processing: ${work.filename}`);
    console.log(`  Title: ${work.title}`);

    if (!fs.existsSync(filepath)) {
      console.log(`  WARNING: File not found at ${filepath}`);
      continue;
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

      manifest.push({
        ingestionOrder: i + 1,
        filename: work.filename,
        title: work.title,
        databaseId: insertId,
        s3Key: key,
        s3Url: url,
        createdAt: now,
        fileSize: `${(fileSize / 1024).toFixed(2)} KB`,
        emotionalRegister: work.emotionalRegister,
        sortOrder: work.sortOrder
      });

      console.log(`  ✓ Successfully uploaded and added to database\n`);
    } catch (e) {
      console.error(`  ERROR: ${e}\n`);
    }
  }

  await connection.end();

  // Output manifest
  console.log("=== INGESTION MANIFEST ===");
  console.log("Order | Filename        | Title                       | DB ID | Emotional Register");
  console.log("------|-----------------|-----------------------------| ------|-------------------");
  for (const item of manifest) {
    console.log(`    ${item.ingestionOrder} | ${item.filename.padEnd(15)} | ${item.title.substring(0, 27).padEnd(27)} | ${item.databaseId} | ${item.emotionalRegister}`);
  }

  // Save manifest
  fs.writeFileSync(
    "/home/ubuntu/neon-crucible/covenant_manifest.json",
    JSON.stringify(manifest, null, 2)
  );
  console.log("\nManifest saved to: /home/ubuntu/neon-crucible/covenant_manifest.json");
  console.log("Done!");

  process.exit(0);
}

main().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
