import { getDb } from "../server/db";
import { works } from "../drizzle/schema";
import { storagePut } from "../server/storage";
import * as fs from "fs";
import * as path from "path";

// PH4 Ink Storms Batch 01 - Vietnam May-August 2024
const ph4Works = [
  {
    filename: "IMG_0386.jpg",
    title: "Ink Storm (Ascension)",
    seriesName: "Ink Storms",
    emotionalRegister: "ascending energy",
    neonReading: "Ascending dragon-like stroke with heavy splatter and vertical energy. The ink rises against gravity, defying the pull of despair that characterized this period. A moment of lift within the storm."
  },
  {
    filename: "20240726_162209.jpg",
    title: "Ink Storm (Diagonal 01)",
    seriesName: "Ink Storms",
    emotionalRegister: "diagonal impact",
    neonReading: "Diagonal impact with heavy 'bone' black cutting through white negative space. The composition suggests a body in motion, falling or flying—the distinction no longer matters in the storm."
  },
  {
    filename: "2255.jpg",
    title: "Ink Storm (Mass)",
    seriesName: "Ink Storms",
    emotionalRegister: "brooding density",
    neonReading: "Massive central black density with wet bleed zones. The heaviest work in this batch—a visual anchor that absorbs light and attention. The storm at its most concentrated, most oppressive."
  },
  {
    filename: "Painting_10.jpg",
    title: "Ink Storm (Strike)",
    seriesName: "Ink Storms",
    emotionalRegister: "high velocity",
    neonReading: "Vertical strike with high velocity splash dynamics. The brush moved faster than thought here—pure somatic response to the humidity and displacement of the Vietnam period."
  },
  {
    filename: "Painting_9.jpg",
    title: "Vietnam Horizon 01",
    seriesName: "Horizon-Leaning",
    emotionalRegister: "landscape split",
    neonReading: "Two distinct lateral sweeps with a gap between them. Reads as a landscape/sky split—the horizon line that separates earth from air, past from future, self from dissolution."
  },
  {
    filename: "20240629_114217.jpg",
    title: "Ink Storm (Sweep)",
    seriesName: "Ink Storms",
    emotionalRegister: "singular motion",
    neonReading: "Thick, calligraphic sweep executed in a singular motion. The entire composition is one breath, one gesture, one decision made and committed to without revision."
  },
  {
    filename: "20240701_095820.jpg",
    title: "Ink Storm (Burst)",
    seriesName: "Ink Storms",
    emotionalRegister: "explosive chaos",
    neonReading: "Explosive particulate matter with 'shrapnel' splatter. The most chaotic work in this batch—a visual record of internal weather made external, emotion atomized into ink particles."
  }
];

const PHASE_ID = 30007; // PH4 Nomadic Vietnam

async function uploadBatch() {
  const db = await getDb();
  if (!db) {
    console.error("Database not available");
    return;
  }

  const results = [];

  for (const work of ph4Works) {
    const filePath = path.join("/home/ubuntu/upload", work.filename);
    
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${work.filename}`);
      continue;
    }

    console.log(`Uploading: ${work.title}...`);
    
    // Read and upload to S3
    const fileBuffer = fs.readFileSync(filePath);
    const s3Key = `works/ph4/${work.filename.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    
    const { url } = await storagePut(s3Key, fileBuffer, "image/jpeg");
    
    // Insert into database
    const [inserted] = await db.insert(works).values({
      title: work.title,
      phaseId: PHASE_ID,
      dateCreated: "2024-05 to 2024-08",
      technique: "Sumi ink & wash on paper",
      dimensions: "Variable (large format)",
      colorPalette: "Black, grey, white",
      emotionalRegister: work.emotionalRegister,
      imageUrl: url,
      imageKey: s3Key,
      journalExcerpt: "High-velocity ink weather. Painted during the PH4 nomadic fieldwork in Vietnam, these works abandon geometric precision for atmospheric pressure, humidity, and somatic release.",
      neonReading: work.neonReading,
      seriesName: work.seriesName,
      isPublished: true,
      sortOrder: 0
    });

    results.push({
      title: work.title,
      id: inserted.insertId,
      url
    });

    console.log(`  ✓ Uploaded: ${work.title} (ID: ${inserted.insertId})`);
  }

  // Write manifest
  fs.writeFileSync(
    "/home/ubuntu/neon-crucible/ph4_batch1_manifest.json",
    JSON.stringify(results, null, 2)
  );

  console.log(`\\nBatch complete: ${results.length} works uploaded`);
}

uploadBatch().catch(console.error);
