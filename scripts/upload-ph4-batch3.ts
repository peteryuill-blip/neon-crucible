import { getDb } from "../server/db";
import { works } from "../drizzle/schema";
import { storagePut } from "../server/storage";
import * as fs from "fs";
import * as path from "path";

// PH4 Oculus Batch 03 - Vietnam Journal Suite June 2024
const ph4Works = [
  {
    filename: "20240630_134825.jpg",
    title: "Oculus (Dilating Ring)",
    seriesName: "Oculus",
    emotionalRegister: "dilating tension",
    neonReading: "A heavy black ink ring with a serrated inner edge, reading like a dilating pupil. The eye of the storm—watching you as you watch it."
  },
  {
    filename: "20240629_111019.jpg",
    title: "Oculus (Eclipse)",
    seriesName: "Oculus",
    emotionalRegister: "total occlusion",
    neonReading: "A dense black void surrounding a central light aperture, evoking a solar eclipse. The moment before totality—or just after."
  },
  {
    filename: "20240630_134809.jpg",
    title: "Oculus (Soft Focus)",
    seriesName: "Oculus",
    emotionalRegister: "atmospheric dissolution",
    neonReading: "A diffused, atmospheric ring where the ink wash blurs the boundary between form and void. The geometry is losing its grip."
  },
  {
    filename: "20240630_134838.jpg",
    title: "Oculus (Concentric Pulse)",
    seriesName: "Oculus",
    emotionalRegister: "radiating vibration",
    neonReading: "Multiple concentric ink rings radiating outward, creating a vibration effect. The aperture pulses—breathing in and out."
  },
  {
    filename: "20240629_111207.jpg",
    title: "Oculus (Horizon Split)",
    seriesName: "Oculus",
    emotionalRegister: "divided consciousness",
    neonReading: "A circular aperture bisected by a horizon line, merging landscape and portal logic. Earth below, sky above, void in between."
  },
  {
    filename: "20240629_111125.jpg",
    title: "Oculus (Heavy Mass)",
    seriesName: "Oculus",
    emotionalRegister: "gravitational weight",
    neonReading: "A monolithic black ring with deep saturation, dominating the white space. The heaviest work in the series—pure gravitational pull."
  },
  {
    filename: "20240629_111153.jpg",
    title: "Oculus (Interior Tooth)",
    seriesName: "Oculus",
    emotionalRegister: "jagged interior",
    neonReading: "An aperture with jagged, tooth-like ink bleed on the interior edge. The void has teeth—it bites back."
  },
  {
    filename: "20240630_134645.jpg",
    title: "Oculus (Wash Field)",
    seriesName: "Oculus",
    emotionalRegister: "ghostly atmosphere",
    neonReading: "A softer, wider ring where the ink wash creates a ghostly atmospheric field. The gentlest Oculus—more suggestion than statement."
  },
  {
    filename: "20240630_134723.jpg",
    title: "Oculus (Double Ring)",
    seriesName: "Oculus",
    emotionalRegister: "nested depth",
    neonReading: "Two distinct ink densities forming a nested aperture structure. Depth within depth—the portal has layers."
  },
  {
    filename: "20240630_134708.jpg",
    title: "Oculus (Void Core)",
    seriesName: "Oculus",
    emotionalRegister: "central darkness",
    neonReading: "A nearly solid black field with a small, sharp central aperture of light. The darkest Oculus—almost total occlusion."
  },
  {
    filename: "20240630_134550.jpg",
    title: "Oculus (Horizon Maw)",
    seriesName: "Oculus",
    emotionalRegister: "consuming aperture",
    neonReading: "A circular form split by a dark horizon band, the aperture appearing to consume the light above. The maw opens."
  },
  {
    filename: "20240630_134624.jpg",
    title: "Oculus (Nested Eye)",
    seriesName: "Oculus",
    emotionalRegister: "watching depth",
    neonReading: "Concentric rings forming a nested eye structure with a luminous core. The portal watches back—always watching."
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
      dateCreated: "2024-06",
      technique: "Sumi ink and wash on paper",
      dimensions: "Variable (large format)",
      colorPalette: "Black, gray, white",
      emotionalRegister: work.emotionalRegister,
      imageUrl: url,
      imageKey: s3Key,
      journalExcerpt: "The Oculus series strips the mandala back to a single, monolithic black aperture. These are monochrome studies in void-gazing—heavy ink rings that act as portals, eclipses, or dilating pupils.",
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
    "/home/ubuntu/neon-crucible/ph4_batch3_manifest.json",
    JSON.stringify(results, null, 2)
  );

  console.log(`\nBatch complete: ${results.length} works uploaded`);
}

uploadBatch().catch(console.error);
