import * as mysql from "mysql2/promise";
import * as fs from "fs";
import * as path from "path";

const FORGE_API_URL = process.env.BUILT_IN_FORGE_API_URL || "";
const FORGE_API_KEY = process.env.BUILT_IN_FORGE_API_KEY || "";

// Equinox of the Gods - 5 works from PH2A (Thelemic Rupture)
// Jonathan LeVine Projects, NYC, August 2020
const EQUINOX_WORKS = [
  {
    filename: "1_ode_to_osiris_peteryuill(1).jpg",
    title: "Ode to Osiris",
    technique: "Black ink with copper leaf on Saunders Waterford 300gsm cotton rag",
    dimensions: "56×76 cm vertical",
    colorPalette: "Black, Copper, Dense knot",
    emotionalRegister: "reverent resignation",
    dateCreated: "2020-08",
    seriesName: "Equinox of the Gods",
    journalExcerpt: "Osiris: the dying-and-resurrecting god. Sacrifice, judgment, external law. This dense symmetrical knot represents the old aeon—the sacrificial and authoritarian structure that must be transcended. Copper grounds it in the earthly and material.",
    neonReading: "Acknowledgment of the old order. Osiris embodies the Age of external authority, where meaning comes through sacrifice and submission. The knot is closed, complete, memorial. This is what must be left behind.",
    sortOrder: 1
  },
  {
    filename: "2_ode_to_isis_peteryuill(2).jpg",
    title: "Ode to Isis",
    technique: "Black ink with gold leaf on Saunders Waterford 300gsm cotton rag",
    dimensions: "56×76 cm vertical",
    colorPalette: "Black, Gold, Dense knot",
    emotionalRegister: "reverent contained grief",
    dateCreated: "2020-08",
    seriesName: "Equinox of the Gods",
    journalExcerpt: "Isis: ancient mother goddess. Magic, wisdom, fertility. The pre-historical matriarchal aeon—instinct, nature, the body. This dense symmetrical knot honors the origin, the feminine-instinctual foundation. Gold illuminates the celestial and sacred.",
    neonReading: "Acknowledgment of origin. Isis represents the ancient feminine-mystical foundation, the instinctual and cyclical. The knot is complete, contained, reverent. This is the ancestral ground from which transformation departs.",
    sortOrder: 2
  },
  {
    filename: "3_ode_to_hadit_peteryuill(2).jpg",
    title: "Ode to Hadit",
    technique: "Black ink with gold leaf on Saunders Waterford 300gsm cotton rag",
    dimensions: "56×76 cm vertical",
    colorPalette: "Black, Gold, Open vortex with central void",
    emotionalRegister: "intense coiled potential",
    dateCreated: "2020-08",
    seriesName: "Equinox of the Gods",
    journalExcerpt: "Hadit: the infinitely small point of pure will. The concentrated self, the inner flame. This open vortex spirals toward a central white void—inward-pulling energy, the distillation of the new self. The essential point from which all will emanates.",
    neonReading: "Distillation to essential will. Hadit is the core of the Horus aeon—the individuated self, concentrated and focused. The vortex pulls inward toward the void. This is the knowing distilled to a single point.",
    sortOrder: 3
  },
  {
    filename: "6_ode_to_hoor_pa_kraat_peteryuill(2).jpg",
    title: "Ode to Hoor-pa-kraat",
    technique: "Black ink with copper leaf on Saunders Waterford 300gsm cotton rag",
    dimensions: "56×76 cm vertical",
    colorPalette: "Black, Copper, Extremely dense knot",
    emotionalRegister: "silent restrained power",
    dateCreated: "2020-08",
    seriesName: "Equinox of the Gods",
    journalExcerpt: "Hoor-pa-kraat (Harpocrates): the silent child-god. Self-possession, patience, inner knowing. This extremely dense knot holds immense pressure in perfect containment. Silent power, compressed energy, disciplined restraint—the moment before action.",
    neonReading: "Silent containment of knowing. Hoor-pa-kraat is the silent aspect of Horus: self-knowledge held in reserve, perfectly balanced. The knot contains maximum pressure without release. This is knowing held in patience.",
    sortOrder: 4
  },
  {
    filename: "7_ode_to_therion_peteryuill.jpg",
    title: "Ode to Therion",
    technique: "Black ink with dual gold and copper leaf on Saunders Waterford 300gsm cotton rag",
    dimensions: "100×100 cm square",
    colorPalette: "Black, Gold, Copper, Fractured vortex",
    emotionalRegister: "ecstatic volatile rupture",
    dateCreated: "2020-08",
    seriesName: "Equinox of the Gods",
    journalExcerpt: "Therion: The Beast. Crowley's magickal name—the unleashed will, full self-actualization, aeonic rupture. This large fractured vortex explodes outward, containment shattered. Dual gold and copper fuse celestial and terrestrial into volatile unity. This is the climax: all containment breaks, the new self becomes undeniable.",
    neonReading: "Explosive release and full activation. Therion represents the Horus aeon fully unleashed—will activated, containment shattered, transformation irreversible. The vortex fractures outward, scattering shards of both metals. This is not peace. This is dangerous becoming.",
    sortOrder: 5
  }
];

async function uploadToS3(filepath: string, filename: string): Promise<{ key: string; url: string }> {
  const baseUrl = FORGE_API_URL.replace(/\/+$/, "");
  const key = `works/equinox/${filename}`;
  
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
  console.log("=== EQUINOX OF THE GODS UPLOAD ===\n");
  console.log("Processing 5 works from the Thelemic Rupture phase (PH2A)...\n");
  console.log("Exhibition: Jonathan LeVine Projects, NYC, August 2020\n");

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
  
  // Get PH2A phase ID
  const [phaseRows] = await connection.execute(
    "SELECT id FROM phases WHERE code = 'PH2A' LIMIT 1"
  );
  const phaseId = (phaseRows as any[])[0]?.id;
  
  if (!phaseId) {
    console.error("PH2A phase not found!");
    await connection.end();
    process.exit(1);
  }
  
  console.log(`Found PH2A phase with ID: ${phaseId}\n`);

  const manifest: any[] = [];
  const uploadDir = "/home/ubuntu/upload";

  for (let i = 0; i < EQUINOX_WORKS.length; i++) {
    const work = EQUINOX_WORKS[i];
    const filepath = path.join(uploadDir, work.filename);

    console.log(`[${i + 1}/5] Processing: ${work.filename}`);
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
  console.log("Order | Filename                              | Title                  | DB ID | Emotional Register");
  console.log("------|---------------------------------------|------------------------|-------|-------------------");
  for (const item of manifest) {
    console.log(`    ${item.ingestionOrder} | ${item.filename.substring(0, 37).padEnd(37)} | ${item.title.substring(0, 22).padEnd(22)} | ${item.databaseId} | ${item.emotionalRegister}`);
  }

  // Save manifest
  fs.writeFileSync(
    "/home/ubuntu/neon-crucible/equinox_manifest.json",
    JSON.stringify(manifest, null, 2)
  );
  console.log("\nManifest saved to: /home/ubuntu/neon-crucible/equinox_manifest.json");
  console.log("Done!");

  process.exit(0);
}

main().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
