import { getDb } from "../server/db";
import { works } from "../drizzle/schema";
import { storagePut } from "../server/storage";
import * as fs from "fs";
import * as path from "path";

// PH4 Portals & Chromatic Storms Batch 02 - Vietnam July-August 2024
const ph4Works = [
  {
    filename: "20240803_113029.jpg",
    title: "Purple Portal (Vietnam 01)",
    seriesName: "Portals",
    emotionalRegister: "radial bloom",
    neonReading: "A radial bloom where gray wash feathers outward from a vivid purple core. The geometry tries to hold its shape against the flood of color—the first major reintroduction since 2018."
  },
  {
    filename: "Painting_8.jpg",
    title: "Wounded Portal (Magenta)",
    seriesName: "Portals",
    emotionalRegister: "violent rupture",
    neonReading: "A gray radial field split by a violent magenta diagonal slash. The wound is the portal—color breaking through the monochrome discipline like blood through skin."
  },
  {
    filename: "20240725_104225.jpg",
    title: "Ink Storm (Cyan & Magenta)",
    seriesName: "Chromatic Storms",
    emotionalRegister: "destabilized energy",
    neonReading: "Gestural storm-body destabilized by cyan and magenta flares. The black mass can no longer contain the color—it erupts at the edges, chemical and psychedelic."
  },
  {
    filename: "20240728_102241.jpg",
    title: "Ink Storm (Purple Flare)",
    seriesName: "Chromatic Storms",
    emotionalRegister: "afterburn eruption",
    neonReading: "Vertical black mass with a purple 'afterburn' eruption. The color appears as residue, as heat signature, as the emotional trace left behind by the gesture."
  },
  {
    filename: "20240723_132742.jpg",
    title: "Cosmic Bloom (Multi-Ring)",
    seriesName: "Portals",
    emotionalRegister: "pulsing complexity",
    neonReading: "A complex multi-ring mandala pulsing with blue and pink internal light. The most structured work in this batch—showing the link to earlier phases before color broke the form."
  },
  {
    filename: "20240717_142027.jpg",
    title: "Portal (Nested Eye)",
    seriesName: "Portals",
    emotionalRegister: "looking back",
    neonReading: "A 'looking back' aperture with a sharp black pupil and cyan/magenta iris. The portal has become an eye—the work watches you as you watch it."
  },
  {
    filename: "Painting_7.jpg",
    title: "Portal (Bleed)",
    seriesName: "Portals",
    emotionalRegister: "dissolving form",
    neonReading: "Heavy black radial field dissolving into pools of cyan and purple. The geometry is losing its battle with entropy—color seeping through every crack."
  },
  {
    filename: "20240717_113214.jpg",
    title: "Horizon Portal (Split)",
    seriesName: "Portals",
    emotionalRegister: "divided consciousness",
    neonReading: "A centralized form divided by a horizon line—cyan below, magenta above. Earth and sky, past and future, self and dissolution split by a single axis."
  },
  {
    filename: "20240717_111943.jpg",
    title: "Ink Storm (Chaos)",
    seriesName: "Chromatic Storms",
    emotionalRegister: "maximum chaos",
    neonReading: "High-velocity chaotic gesture mixing black Chinese ink with Western color pigments. Pure entropy—the most uncontrolled work in the Vietnam suite."
  },
  {
    filename: "Painting_6(1).jpg",
    title: "Cosmic Bloom (Teal)",
    seriesName: "Portals",
    emotionalRegister: "atmospheric softness",
    neonReading: "Soft, atmospheric portal with a teal and magenta outer ring. The gentlest work in this batch—color as invitation rather than rupture."
  },
  {
    filename: "2024071IthinkIcan7_111833.jpg",
    title: "I Think I Can",
    seriesName: "Chromatic Storms",
    emotionalRegister: "determined chaos",
    neonReading: "The title embedded in the filename speaks to the psychological state of the Vietnam period—determination mixed with doubt, the mantra repeated while the ink flies."
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
      dateCreated: "2024-07 to 2024-08",
      technique: "Chinese and Western inks on paper",
      dimensions: "Variable (large format)",
      colorPalette: "Black, cyan, magenta, purple, teal",
      emotionalRegister: work.emotionalRegister,
      imageUrl: url,
      imageKey: s3Key,
      journalExcerpt: "The moment color breaks the geometry. After years of strict monochrome sacred geometry, the Vietnam fieldwork broke the seal on color. But this isn't decorative—it's structural.",
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
    "/home/ubuntu/neon-crucible/ph4_batch2_manifest.json",
    JSON.stringify(results, null, 2)
  );

  console.log(`\nBatch complete: ${results.length} works uploaded`);
}

uploadBatch().catch(console.error);
