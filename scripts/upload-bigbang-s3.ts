import mysql from "mysql2/promise";
import * as fs from "fs";
import * as path from "path";

// Storage config from environment
const FORGE_API_URL = process.env.BUILT_IN_FORGE_API_URL || "";
const FORGE_API_KEY = process.env.BUILT_IN_FORGE_API_KEY || "";

// Big Bang series data
const BIGBANG_WORKS = [
  {
    filename: "BB1.jpg",
    title: "Big Bang: Breath Aureole",
    dateCreated: "2025-04",
    technique: "Sumi ink on Anhui rice paper",
    dimensions: "100x200cm",
    colorPalette: "Black, Gray, Subtle cyan undertones",
    emotionalRegister: "gentle",
    seriesName: "Big Bang",
    journalExcerpt: "Feathering, halos, and negative space—saved territory where ink approached but did not consume. Documented throughout series, especially in works emphasizing respiratory quality.",
    neonReading: "The most delicate of the series. Graduated density aureoles and feathering create a sense of breath held and released. The cyan undertone (rare in this monochrome field) suggests alchemical shift—a trace of color as spirit breaking through matter. The Breath register at its most visible.",
    sortOrder: 1
  },
  {
    filename: "BB2.jpg",
    title: "Big Bang: Diagonal Thrust",
    dateCreated: "2025-04",
    technique: "Sumi ink on Anhui rice paper",
    dimensions: "100x200cm",
    colorPalette: "Black, Gray",
    emotionalRegister: "brutal",
    seriesName: "Big Bang",
    journalExcerpt: "The biomechanics are whole-body: shoulder-torso-leg coordination, velocity that requires the full structure, not just wrist. The body becomes the primary instrument.",
    neonReading: "High-velocity traversal. Energy enters one edge and exits another, edge-bleed implying form continuation beyond paper limits. This is Field logic incarnate—the work is an excerpt from a larger force-field, not a self-contained world. Diagonal thrust makes gravity visible as compositional co-author.",
    sortOrder: 2
  },
  {
    filename: "BB3.jpg",
    title: "Big Bang: Vertical Descent",
    dateCreated: "2025-04",
    technique: "Sumi ink on Anhui rice paper",
    dimensions: "100x200cm (vertical orientation)",
    colorPalette: "Black, Gray",
    emotionalRegister: "brutal",
    seriesName: "Big Bang",
    journalExcerpt: "At 100cm x 200cm, these works demand full-body engagement. The paper laid flat on floor or table means the artist moves not as a stationary painter but as a dancer or ritual performer.",
    neonReading: "Vertical format activates gravity in a different register. Diagonal thrust becomes descent—ink falling, pooling, accumulating at the base. The body choreography shifts when the paper is vertical; the marks trace falling motion rather than lateral sweep. This may be the series test of orientation effect on viscosity.",
    sortOrder: 3
  },
  {
    filename: "BB4.jpg",
    title: "Big Bang: Smoke Field",
    dateCreated: "2025-05",
    technique: "Sumi ink on Anhui rice paper",
    dimensions: "100x200cm",
    colorPalette: "Black, Gray, Atmospheric smoke",
    emotionalRegister: "meditative",
    seriesName: "Big Bang",
    journalExcerpt: "The Breath—feathering, halos, and negative space representing saved territory where ink approached but did not consume. Essential to preventing the image from collapsing into pure darkness.",
    neonReading: "Atmospheric-dispersed typology. Cloud-masses and breath-space dominate. The Breath register is fully activated here—graduated density aureoles read as the work respiratory system. This is the series at its most quiet, holding tension between presence and dissolution.",
    sortOrder: 4
  },
  {
    filename: "BB5.jpg",
    title: "Big Bang: Diagonal Thrust II",
    dateCreated: "2025-04",
    technique: "Sumi ink on Anhui rice paper",
    dimensions: "100x200cm",
    colorPalette: "Black, Gray",
    emotionalRegister: "brutal",
    seriesName: "Big Bang",
    journalExcerpt: "The series abandons the centralized, mandala-like compositions characterizing Phases 1–3, adopting instead Field logic where energy traverses the picture plane rather than organizing around focal point.",
    neonReading: "Second expression of high-velocity diagonal thrust. Where BB2 emphasized lateral sweep, this work shows ink pooling and accumulation at contact zones. The Bone and Flesh registers collaborate—dense blacks provide structure while mid-tone washes create turbulence. Edge-to-edge movement without center.",
    sortOrder: 5
  },
  {
    filename: "BB6.jpg",
    title: "Big Bang: Geological Core",
    dateCreated: "2025-04",
    technique: "Sumi ink on Anhui rice paper",
    dimensions: "100x200cm",
    colorPalette: "Black, Gray, Turbulent mid-tones",
    emotionalRegister: "brutal",
    seriesName: "Big Bang",
    journalExcerpt: "The ink demonstrates distinctive viscosity regime. Register 2: The Flesh—mid-tone washes and granulation, produced through geological or biological micro-textures, result of ink sediment settling into paper fiber topography.",
    neonReading: "Dense-geological at center with atmospheric halo. The Flesh register dominates—mid-tone washes producing geological micro-textures, result of ink sediment settling into paper fiber topography. This work embodies compression where viscosity creates internal complexity and depth through gravity collaboration.",
    sortOrder: 6
  },
  {
    filename: "BB7.jpg",
    title: "Big Bang: Breath & Bone",
    dateCreated: "2025-04",
    technique: "Sumi ink on Anhui rice paper",
    dimensions: "100x200cm",
    colorPalette: "Black, Gray",
    emotionalRegister: "meditative",
    seriesName: "Big Bang",
    journalExcerpt: "Register 1: The Bone—highest density blacks, sits on paper fiber rather than soaking through, creates foreground depth with almost three-dimensional presence, functions as structural skeleton.",
    neonReading: "Hybrid-transitional showing the duality of the viscosity system. The Bone provides structural skeleton (dense blacks at center), while the Breath creates halos and feathering at edges. This work demonstrates that container is no longer drawn but enacted through ink inherent behavior encountering paper inherent resistance.",
    sortOrder: 7
  },
  {
    filename: "BB8.jpg",
    title: "Big Bang: Geological Core II",
    dateCreated: "2025-05",
    technique: "Sumi ink on Anhui rice paper",
    dimensions: "100x200cm",
    colorPalette: "Black, Gray, Dense turbulent center",
    emotionalRegister: "brutal",
    seriesName: "Big Bang",
    journalExcerpt: "The ink pools, settles, responds to earth pull. Paper becomes a basin catching what falls. This is not possible with vertical easel work.",
    neonReading: "Maximum compression at center with explosive periphery. Where BB6 showed geological formation, this work shows geological pressure—strata compressed into near-singularity. The Flesh register creates turbulence, density, and internal heat. Ink as tectonic force.",
    sortOrder: 8
  },
  {
    filename: "BB9.jpg",
    title: "Big Bang: Cloud Mass",
    dateCreated: "2025-05",
    technique: "Sumi ink on Anhui rice paper",
    dimensions: "100x200cm",
    colorPalette: "Black, Gray, Atmospheric wash",
    emotionalRegister: "meditative",
    seriesName: "Big Bang",
    journalExcerpt: "These works function as temples dedicated to the act of creation rather than documents of it. Temple is not photograph of worship but site where worship occurred and can occur again.",
    neonReading: "Atmospheric-dispersed, cousin to Smoke Field. Cloud-masses dominate, suggesting weather systems or cosmic nebulae. The work hovers between representation (it looks like clouds) and abstraction (it is ink behavior). This is the Field logic at its most elemental—pure atmosphere, pure breath, minimal structure.",
    sortOrder: 9
  },
  {
    filename: "BB10.jpg",
    title: "Big Bang: Shadow Self",
    dateCreated: "2025-05",
    technique: "Sumi ink on Anhui rice paper",
    dimensions: "100x200cm",
    colorPalette: "Black, Warm ochre undertones",
    emotionalRegister: "mysterious",
    seriesName: "Big Bang",
    journalExcerpt: "Most bounded, creature-like form in series. If Shadow were to have shape, it might look like this—entity floating against void, both part of self and separate from it.",
    neonReading: "The outlier. Bounded-figural rather than field-based. This work reads as organism against void—a confrontation with the Shadow Self in Jungian terms. The warm ochre undertones (absent from the cooler atmospheric grays of other works) mark this as the series reckoning with darkness not as absence but as presence. The only work that feels like a figure rather than a force.",
    sortOrder: 10
  }
];

async function uploadToS3(filepath: string, filename: string): Promise<{ key: string; url: string }> {
  const baseUrl = FORGE_API_URL.replace(/\/+$/, "");
  const key = `works/bigbang/${filename}`;
  
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
  console.log("=== BIG BANG SERIES UPLOAD (S3) ===\n");
  console.log("Processing 10 works from the Big Bang series...\n");

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

  for (let i = 0; i < BIGBANG_WORKS.length; i++) {
    const work = BIGBANG_WORKS[i];
    const filepath = path.join(uploadDir, work.filename);

    console.log(`[${i + 1}/10] Processing: ${work.filename}`);
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
  console.log("\n=== INGESTION MANIFEST ===\n");
  console.log("Order | Filename   | Title                        | DB ID | Emotional Register");
  console.log("------|------------|------------------------------|-------|-------------------");

  for (const item of manifest) {
    console.log(
      `${String(item.ingestionOrder).padStart(5)} | ${item.filename.padEnd(10)} | ${item.title.slice(0, 28).padEnd(28)} | ${String(item.databaseId).padStart(5)} | ${item.emotionalRegister}`
    );
  }

  // Save manifest to JSON
  const manifestPath = "/home/ubuntu/neon-crucible/bigbang_manifest.json";
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\nManifest saved to: ${manifestPath}`);

  console.log("\nDone!");
}

main().catch(console.error);
