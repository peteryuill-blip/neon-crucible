import { getDb } from "../server/db";
import { works, phases } from "../drizzle/schema";
import { storagePut } from "../server/storage";
import { eq } from "drizzle-orm";
import * as fs from "fs";
import * as path from "path";

// PH3 Echoes Series - 19 works
// The conduit consciousness period - black ink tori/sphere compositions
// Exhibition: "Echoes" - Hong Kong, 2021

interface EchoesWork {
  filename: string;
  title: string;
  technique: string;
  dimensions: string;
  colorPalette: string;
  emotionalRegister: string;
  journalExcerpt: string;
  neonReading: string;
  seriesName: string;
  sortOrder: number;
}

const echoesWorks: EchoesWork[] = [
  {
    filename: "Echoes(2x2m).jpg",
    title: "Echoes",
    technique: "Black ink and gold leaf on Saunders Waterford 300gsm cotton rag",
    dimensions: "200×200 cm (monumental)",
    colorPalette: "Black, Gold, Cosmic saturation",
    emotionalRegister: "cosmic monumental",
    journalExcerpt: "The monumental centerpiece of the phase. 2x2 meters. Four-directional symmetry mapping a cosmic broadcast. This is the echo chamber where the signal is received.",
    neonReading: "The altarpiece of conduit consciousness. Massive scale requires full-body engagement. The geometry radiates outward from a central receiver—this is the artist as antenna, capturing the cosmic signal and amplifying it.",
    seriesName: "Echoes",
    sortOrder: 1
  },
  {
    filename: "Valis.jpg",
    title: "VALIS",
    technique: "Black ink on Saunders Waterford 300gsm",
    dimensions: "76×56 cm",
    colorPalette: "Black, Moiré interference",
    emotionalRegister: "sci-fi gnosis",
    journalExcerpt: "Named for Philip K. Dick's Vast Active Living Intelligence System. A vertical stack of spheres acting as a transmission beam. Gnostic sci-fi meets sacred geometry.",
    neonReading: "Beam transmission. The title confirms the gnostic intent: information beamed from a vast intelligence into the conduit. The geometry is a receiver for 'pink light' information.",
    seriesName: "Echoes",
    sortOrder: 2
  },
  {
    filename: "Electricdream.jpg",
    title: "Electric Dream",
    technique: "Black ink on Saunders Waterford 300gsm",
    dimensions: "76×56 cm",
    colorPalette: "Black, Moiré interference",
    emotionalRegister: "sci-fi gnosis",
    journalExcerpt: "Reference to Philip K. Dick. Vertical spheres with distinct 'Saturn ring' distortions. The boundary between artificial and organic intelligence blurs in the moiré field.",
    neonReading: "Simulation theory in ink. The 'electric dream' suggests the universe as simulation or hologram. The moiré patterns create a digital-analog interference, visualizing the glitch in reality.",
    seriesName: "Echoes",
    sortOrder: 3
  },
  {
    filename: "AMomentarilyLapseofReason.jpg",
    title: "A Momentary Lapse of Reason",
    technique: "Black ink on Saunders Waterford 300gsm",
    dimensions: "76×56 cm",
    colorPalette: "Black, Moiré interference",
    emotionalRegister: "surrendered",
    journalExcerpt: "Pink Floyd reference. A vertical alignment where logic suspends. This marks the shift to conduit consciousness—reason lapses, and something else takes over.",
    neonReading: "The breakdown of the rational mind. The title celebrates the 'lapse'—the moment the ego steps aside and the signal comes through. Geometry not as logic, but as trance.",
    seriesName: "Echoes",
    sortOrder: 4
  },
  {
    filename: "LabyrinthofCoralCaves.jpg",
    title: "Labyrinth of Coral Caves",
    technique: "Black ink on Saunders Waterford 300gsm",
    dimensions: "76×56 cm",
    colorPalette: "Black, Moiré interference",
    emotionalRegister: "deep interiority",
    journalExcerpt: "Complex, multi-sphere arrangement creating a visual labyrinth. Dense moiré patterns pull the eye into deep interiority. A map of the subconscious structures.",
    neonReading: "Navigational hazard. The labyrinth is not for getting lost, but for finding the center. Visual density creates a 'cave' effect—psychic depth rendered in surface tension.",
    seriesName: "Echoes",
    sortOrder: 5
  },
  {
    filename: "Gravitywell.jpg",
    title: "Gravity Well",
    technique: "Black ink on Saunders Waterford 300gsm",
    dimensions: "100×70 cm",
    colorPalette: "Black, Moiré distortion",
    emotionalRegister: "heavy pull",
    journalExcerpt: "A massive single sphere with intense optical pull. Physics as spiritual metaphor: gravity bends light and time. The viewer is pulled into the event horizon.",
    neonReading: "Event horizon. The work demonstrates physics-as-spirituality. It's not a picture of a planet; it's a diagram of attraction. The visual weight is palpable.",
    seriesName: "Echoes",
    sortOrder: 6
  },
  {
    filename: "Amnesia.jpg",
    title: "Amnesia",
    technique: "Black ink on Saunders Waterford 300gsm",
    dimensions: "76×56 cm",
    colorPalette: "Black, Moiré interference",
    emotionalRegister: "erased",
    journalExcerpt: "Vertical structure, stripped back. Amnesia is the precondition for channeling—you must forget who you are to become the conduit.",
    neonReading: "The blessing of forgetting. To receive the signal, the vessel must be empty. Amnesia is the clearing of the buffer. The work feels lighter, 'blanker' than the dense transmissions.",
    seriesName: "Echoes",
    sortOrder: 7
  },
  {
    filename: "17.1.jpg",
    title: "17.1",
    technique: "Black ink on Saunders Waterford 300gsm",
    dimensions: "76×56 cm",
    colorPalette: "Black, Moiré interference",
    emotionalRegister: "cryptic",
    journalExcerpt: "Numbered work from the Echoes series. A specific frequency or coordinate in the cosmic map. Vertical alignment.",
    neonReading: "Coordinate data. The number suggests a sequence or frequency. This is raw data from the transmission, un-titled, just logged.",
    seriesName: "Echoes",
    sortOrder: 8
  },
  {
    filename: "9.1.jpg",
    title: "9.1",
    technique: "Black ink on Saunders Waterford 300gsm",
    dimensions: "76×56 cm",
    colorPalette: "Black, Moiré interference",
    emotionalRegister: "cryptic",
    journalExcerpt: "Numbered work. Dense moiré patterns creating a chaotic interference field. The signal is noisy here.",
    neonReading: "Signal noise. The density of the moiré suggests high-frequency interference. The channel is open but the data is overwhelming.",
    seriesName: "Echoes",
    sortOrder: 9
  },
  {
    filename: "13(1).jpg",
    title: "13.1",
    technique: "Black ink on Saunders Waterford 300gsm",
    dimensions: "76×56 cm",
    colorPalette: "Black, Moiré interference",
    emotionalRegister: "cryptic",
    journalExcerpt: "Numbered work. Vertical alignment. Simpler frequency.",
    neonReading: "Carrier wave. A stable, vertical transmission. The signal is clear.",
    seriesName: "Echoes",
    sortOrder: 10
  },
  {
    filename: "Genesis.jpg",
    title: "Genesis",
    technique: "Black ink on Saunders Waterford 300gsm",
    dimensions: "76×56 cm",
    colorPalette: "Black, Moiré interference",
    emotionalRegister: "originary",
    journalExcerpt: "The beginning. A ring of spheres surrounding a central dense core. The moment of cosmic creation rendered in ink.",
    neonReading: "Origin point. The title suggests cosmogony—the birth of a universe. The ring formation is protective, incubating the dense center.",
    seriesName: "Echoes",
    sortOrder: 11
  },
  {
    filename: "Spitsecond.jpg",
    title: "Split Second",
    technique: "Black ink on Saunders Waterford 300gsm",
    dimensions: "76×56 cm",
    colorPalette: "Black, Moiré interference",
    emotionalRegister: "instantaneous",
    journalExcerpt: "Two massive spheres in vertical alignment, connected at a single point. The moment of contact. Time compressed.",
    neonReading: "Temporal compression. The 'split second' is the infinitesimal moment of contact between two cosmic bodies. The moiré creates temporal shimmer.",
    seriesName: "Echoes",
    sortOrder: 12
  },
  {
    filename: "MajorMotoko.jpg",
    title: "Major Motoko",
    technique: "Black ink on Saunders Waterford 300gsm",
    dimensions: "76×56 cm",
    colorPalette: "Black, Moiré interference",
    emotionalRegister: "cybernetic",
    journalExcerpt: "Named for the Ghost in the Shell protagonist. A vertical stack with satellite spheres. The cyborg consciousness—human and machine merged.",
    neonReading: "Ghost in the shell. The title invokes Kusanagi—the cyborg who questions her own humanity. The geometry suggests a body that is both organic and constructed.",
    seriesName: "Echoes",
    sortOrder: 13
  },
  {
    filename: "OrbitalRefraction.jpg",
    title: "Orbital Refraction",
    technique: "Black ink on Saunders Waterford 300gsm",
    dimensions: "100×70 cm",
    colorPalette: "Black, Moiré interference",
    emotionalRegister: "expansive",
    journalExcerpt: "Complex multi-sphere arrangement with horizontal expansion. Light bending around massive objects. The physics of perception.",
    neonReading: "Gravitational lensing. Light bends around mass. The work visualizes the warping of spacetime—what we see is not what is, but what gravity allows us to see.",
    seriesName: "Echoes",
    sortOrder: 14
  },
  {
    filename: "DelicateSoundofThunder.jpg",
    title: "A Delicate Sound of Thunder",
    technique: "Black ink on Saunders Waterford 300gsm",
    dimensions: "100×70 cm (horizontal)",
    colorPalette: "Black, Moiré interference",
    emotionalRegister: "atmospheric",
    journalExcerpt: "Pink Floyd reference. Horizontal composition with central mass and radiating satellite spheres. The sound of distant cosmic events.",
    neonReading: "Distant thunder. The title suggests something massive happening far away—felt rather than heard. The horizontal format creates a landscape of cosmic weather.",
    seriesName: "Echoes",
    sortOrder: 15
  },
  {
    filename: "18.1(1).jpg",
    title: "18.1",
    technique: "Black ink on Saunders Waterford 300gsm",
    dimensions: "76×56 cm",
    colorPalette: "Black, Moiré interference",
    emotionalRegister: "cryptic",
    journalExcerpt: "Numbered work. Vertical stack with satellite spheres. Part of the coordinate series.",
    neonReading: "Another frequency logged. The numbered series suggests systematic mapping of the cosmic signal.",
    seriesName: "Echoes",
    sortOrder: 16
  },
  {
    filename: "19.1.jpg",
    title: "19.1",
    technique: "Black ink on Saunders Waterford 300gsm",
    dimensions: "76×56 cm",
    colorPalette: "Black, Moiré interference",
    emotionalRegister: "cryptic",
    journalExcerpt: "Numbered work. Vertical alignment with three spheres. Simple, clear transmission.",
    neonReading: "Clear channel. The simplicity suggests a stable frequency. The signal is coming through clean.",
    seriesName: "Echoes",
    sortOrder: 17
  },
  {
    filename: "20.1.jpg",
    title: "20.1",
    technique: "Black ink on Saunders Waterford 300gsm",
    dimensions: "76×56 cm",
    colorPalette: "Black, Moiré interference",
    emotionalRegister: "cryptic",
    journalExcerpt: "Numbered work. Complex vertical arrangement with multiple satellite spheres.",
    neonReading: "Complex frequency. Multiple signals overlapping. The data is dense but structured.",
    seriesName: "Echoes",
    sortOrder: 18
  }
];

async function uploadEchoes() {
  console.log("=== PH3 ECHOES SERIES UPLOAD ===");
  console.log(`Processing ${echoesWorks.length} works from the Conduit Consciousness phase...`);
  console.log("Exhibition: Echoes - Hong Kong, 2021\n");

  // Get database connection
  const db = await getDb();
  if (!db) {
    throw new Error("Database connection not available");
  }

  // Get PH3 phase ID
  const ph3Phase = await db.select().from(phases).where(eq(phases.code, "PH3"));
  if (!ph3Phase.length) {
    throw new Error("PH3 phase not found in database");
  }
  const phaseId = ph3Phase[0].id;
  console.log(`Found PH3 phase with ID: ${phaseId}\n`);

  const uploadDir = "/home/ubuntu/upload";
  const results: any[] = [];

  for (let i = 0; i < echoesWorks.length; i++) {
    const work = echoesWorks[i];
    console.log(`[${i + 1}/${echoesWorks.length}] Processing: ${work.filename}`);
    console.log(`  Title: ${work.title}`);

    const filePath = path.join(uploadDir, work.filename);
    
    if (!fs.existsSync(filePath)) {
      console.log(`  ⚠ File not found, skipping: ${filePath}`);
      continue;
    }

    const fileBuffer = fs.readFileSync(filePath);
    const fileSizeKB = (fileBuffer.length / 1024).toFixed(2);
    console.log(`  File size: ${fileSizeKB} KB`);

    // Upload to S3
    console.log("  Uploading to S3...");
    const s3Key = `works/echoes/${work.filename}`;
    const { url: s3Url } = await storagePut(s3Key, fileBuffer, "image/jpeg");
    console.log(`  S3 Key: ${s3Key}`);
    console.log(`  S3 URL: ${s3Url.substring(0, 70)}...`);

    // Insert into database
    const [inserted] = await db.insert(works).values({
      title: work.title,
      phaseId: phaseId,
      dateCreated: "2021-2023",
      technique: work.technique,
      dimensions: work.dimensions,
      colorPalette: work.colorPalette,
      emotionalRegister: work.emotionalRegister,
      imageUrl: s3Url,
      thumbnailUrl: s3Url,
      journalExcerpt: work.journalExcerpt,
      neonReading: work.neonReading,
      seriesName: work.seriesName,
      isPublished: true,
      sortOrder: work.sortOrder
    }).$returningId();

    console.log(`  Database ID: ${inserted.id}`);
    
    // Fetch the created record to get timestamps
    const [created] = await db.select().from(works).where(eq(works.id, inserted.id));
    console.log(`  Created at: ${created.createdAt}`);
    console.log("  ✓ Successfully uploaded and added to database\n");

    results.push({
      ingestionOrder: i + 1,
      filename: work.filename,
      title: work.title,
      databaseId: inserted.id,
      s3Key,
      s3Url,
      createdAt: created.createdAt,
      fileSize: `${fileSizeKB} KB`,
      emotionalRegister: work.emotionalRegister,
      sortOrder: work.sortOrder
    });
  }

  // Output manifest
  console.log("=== INGESTION MANIFEST ===");
  console.log("Order | Filename                    | Title                          | DB ID | Emotional Register");
  console.log("------|----------------------------|--------------------------------|-------|-------------------");
  for (const r of results) {
    console.log(
      `${String(r.ingestionOrder).padStart(5)} | ${r.filename.substring(0, 26).padEnd(26)} | ${r.title.substring(0, 30).padEnd(30)} | ${r.databaseId} | ${r.emotionalRegister}`
    );
  }

  // Save manifest to file
  const manifestPath = "/home/ubuntu/neon-crucible/echoes_manifest.json";
  fs.writeFileSync(manifestPath, JSON.stringify(results, null, 2));
  console.log(`\nManifest saved to: ${manifestPath}`);
  console.log("Done!");
}

uploadEchoes().catch(console.error);
