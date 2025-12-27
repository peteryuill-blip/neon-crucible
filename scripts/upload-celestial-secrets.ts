import { getDb } from "../server/db";
import { works, phases } from "../drizzle/schema";
import { storagePut } from "../server/storage";
import { eq } from "drizzle-orm";
import * as fs from "fs";
import * as path from "path";

// PH3A Celestial Secrets Series - 10 works
// Exhibition: Celestial Secrets, West Eden Gallery, Bangkok, June-July 2023
// First solo exhibition in Thailand. Saturn as visible paradox.

interface CelestialWork {
  filename: string;
  title: string;
  technique: string;
  dimensions: string;
  colorPalette: string;
  emotionalRegister: string;
  journalExcerpt: string;
  neonReading: string;
  sortOrder: number;
}

const celestialWorks: CelestialWork[] = [
  {
    filename: "IMG-20230616-WA0012(1).jpg",
    title: "Cross Mandala with Gold Center",
    technique: "Black ink and gold leaf on Saunders Waterford 300gsm",
    dimensions: "76×56 cm",
    colorPalette: "Black, Gold, White",
    emotionalRegister: "celestial symmetry",
    journalExcerpt: "Four-directional symmetry. Central gold circle surrounded by ink spheres and satellite forms radiating outward. Saturn rings visible in moiré patterns. This is the cosmos as mandala—order and chaos held in equilibrium.",
    neonReading: "The mandala as cosmic map. Four-directional symmetry suggests cosmological completeness: north-south-east-west, the cardinal directions. The gold center is the sun, the still point. The ink spheres are planets, moons, orbital debris.",
    sortOrder: 1
  },
  {
    filename: "20230628_223310~2.jpg",
    title: "Horizontal Orbital Mural (Study)",
    technique: "Acrylic and ink on wall",
    dimensions: "600×150 cm (large-scale mural)",
    colorPalette: "Black, Gold, White",
    emotionalRegister: "architectural presence",
    journalExcerpt: "Installation shot from West Eden Gallery. Large horizontal orbital composition. Circular forms overlap, creating moiré interference fields. Gold leaf accents at key gravitational points. The work occupies the wall like a cosmic event horizon.",
    neonReading: "Architectural cosmology. The mural scale forces full-body engagement—you can't see it all at once. You must walk along it, tracking the orbits. The overlapping circles create visual 'beats,' interference patterns that suggest gravitational waves.",
    sortOrder: 2
  },
  {
    filename: "IMG-20230616-WA0013(1).jpg",
    title: "Yin-Yang Gold Disc",
    technique: "Black ink and gold leaf on Saunders Waterford 300gsm",
    dimensions: "100×70 cm",
    colorPalette: "Black, Gold, White",
    emotionalRegister: "balanced duality",
    journalExcerpt: "Vertical yin-yang structure. Large gold disc at center surrounded by dense ink spheres. Two smaller gold voids nested within the larger field. The composition oscillates between Eastern cosmology and Western astronomy.",
    neonReading: "East-West synthesis made visible. The yin-yang is not drawn but implied—the negative space between ink and gold creates the curve. This is fusion at the structural level: the artist is revealing the underlying unity of traditions.",
    sortOrder: 3
  },
  {
    filename: "IMG-20230616-WA0011(1).jpg",
    title: "Vertical Cross with Gold Satellites",
    technique: "Black ink and gold leaf on Saunders Waterford 300gsm",
    dimensions: "100×70 cm",
    colorPalette: "Black, Gold, White",
    emotionalRegister: "vertical transmission",
    journalExcerpt: "Vertical emphasis. Large central ink sphere flanked by gold leaf circles at cardinal points. Smaller ink satellites orbit at intermediate positions. The composition reads as both crucifix and antenna—spiritual and technological simultaneously.",
    neonReading: "Sacred technology. The cross structure suggests Christianity, but the orbital mechanics suggest astrophysics. This is the collision Yuill has been working toward: the moment when spiritual geometry and physical cosmology become indistinguishable.",
    sortOrder: 4
  },
  {
    filename: "DSC07648~2.jpg",
    title: "Orbital Installation View",
    technique: "Acrylic and ink on wall",
    dimensions: "600×150 cm (installation view)",
    colorPalette: "Black, Gold, White",
    emotionalRegister: "immersive installation",
    journalExcerpt: "Installation view at West Eden Gallery. The viewer stands before the work at human scale. The overlapping circular forms create depth and movement. The moiré interference suggests vibration, resonance.",
    neonReading: "Phenomenological immersion. At this scale, the work becomes environment. The viewer is inside the orbital system, not observing it from outside. This is the shift from representation to experience.",
    sortOrder: 5
  },
  {
    filename: "IMG-20230616-WA0016(1).jpg",
    title: "Asymmetric Orbital Cluster",
    technique: "Black ink and gold leaf on Saunders Waterford 300gsm",
    dimensions: "76×56 cm",
    colorPalette: "Black, Gold, White",
    emotionalRegister: "dynamic imbalance",
    journalExcerpt: "Asymmetric composition. Gold leaf circles cluster on the right side, creating visual weight. Ink spheres provide counterbalance but the composition refuses perfect symmetry. This is orbital mechanics as improvisation.",
    neonReading: "Conduit consciousness visible. Unlike PH2's calculated golden-ratio precision, this work feels intuitive, responsive. The asymmetry is not mistake—it's evidence of surrender. The artist is facilitating rather than controlling.",
    sortOrder: 6
  },
  {
    filename: "IMG-20230616-WA0014(1).jpg",
    title: "Gold Crescent Orbit",
    technique: "Black ink and gold leaf on Saunders Waterford 300gsm",
    dimensions: "100×70 cm",
    colorPalette: "Black, Gold, White",
    emotionalRegister: "lunar phase",
    journalExcerpt: "Large gold crescent forms orbit around central ink sphere. The crescent suggests lunar phase, waxing or waning. Smaller satellites complete the orbital field. The work oscillates between astronomical diagram and alchemical symbol.",
    neonReading: "Alchemical astronomy. The crescent moon is one of alchemy's oldest symbols—representing the lunar principle, the feminine, the receptive. But here it's also literal: a planet's orbit around a star, captured mid-rotation.",
    sortOrder: 7
  },
  {
    filename: "IMG-20230616-WA0015(1).jpg",
    title: "Vertical Axis with Gold Poles",
    technique: "Black ink and gold leaf on Saunders Waterford 300gsm",
    dimensions: "100×70 cm",
    colorPalette: "Black, Gold, White",
    emotionalRegister: "polar alignment",
    journalExcerpt: "Strong vertical axis. Small gold circles at top and bottom poles. Larger ink spheres occupy the central band with intermediate gold accents. The composition reads as axis mundi—world axis connecting heaven and earth.",
    neonReading: "Cosmological spine. The vertical axis is one of the oldest spiritual diagrams: the connection between above and below, transcendent and material, celestial and terrestrial. Yuill is drawing the structure of the cosmos as a transmission beam.",
    sortOrder: 8
  },
  {
    filename: "IMG-20230616-WA0017(1).jpg",
    title: "Dense Cross Mandala",
    technique: "Black ink and gold leaf on Saunders Waterford 300gsm",
    dimensions: "100×70 cm",
    colorPalette: "Black, Gold, White",
    emotionalRegister: "saturated symmetry",
    journalExcerpt: "Dense cross mandala. Central sphere surrounded by tightly packed orbital rings. Gold leaf accents at cardinal and intercardinal points. The moiré density approaches saturation—the work vibrates at high frequency.",
    neonReading: "Signal saturation. The density here is extreme—almost too much visual information to process. This is the 'hexagonal storm' principle: chaos at such high intensity it begins to look ordered.",
    sortOrder: 9
  },
  {
    filename: "IMG-20230616-WA0018(1).jpg",
    title: "Spiral Galaxy S-Curve",
    technique: "Black ink and gold leaf on Saunders Waterford 300gsm",
    dimensions: "76×56 cm",
    colorPalette: "Black, Gold, White",
    emotionalRegister: "galactic rotation",
    journalExcerpt: "S-curve composition. Ink and gold spheres arranged in spiral formation. The largest sphere anchors the center; smaller satellites trace the rotational path. This is the first explicit galaxy structure in the practice.",
    neonReading: "Spiral cosmology. The spiral is the shape of galaxies, hurricanes, DNA, nautilus shells—it's the pattern of growth and motion. By moving from circular to spiral, Yuill shifts from static equilibrium to dynamic process.",
    sortOrder: 10
  }
];

async function uploadCelestialSecrets() {
  console.log("=== PH3A CELESTIAL SECRETS SERIES UPLOAD ===");
  console.log(`Processing ${celestialWorks.length} works from Bangkok 2023...`);
  console.log("Exhibition: Celestial Secrets - West Eden Gallery, Bangkok, June-July 2023\n");

  // Get database connection
  const db = await getDb();
  if (!db) {
    throw new Error("Database connection not available");
  }

  // Get PH3A phase ID
  const ph3aPhase = await db.select().from(phases).where(eq(phases.code, "PH3A"));
  if (!ph3aPhase.length) {
    throw new Error("PH3A phase not found in database");
  }
  const phaseId = ph3aPhase[0].id;
  console.log(`Found PH3A phase with ID: ${phaseId}\n`);

  const uploadDir = "/home/ubuntu/upload";
  const results: any[] = [];

  for (let i = 0; i < celestialWorks.length; i++) {
    const work = celestialWorks[i];
    console.log(`[${i + 1}/${celestialWorks.length}] Processing: ${work.filename}`);
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
    const s3Key = `works/celestial-secrets/${work.filename}`;
    const { url: s3Url } = await storagePut(s3Key, fileBuffer, "image/jpeg");
    console.log(`  S3 Key: ${s3Key}`);
    console.log(`  S3 URL: ${s3Url.substring(0, 70)}...`);

    // Insert into database
    const [inserted] = await db.insert(works).values({
      title: work.title,
      phaseId: phaseId,
      dateCreated: "2023-06",
      technique: work.technique,
      dimensions: work.dimensions,
      colorPalette: work.colorPalette,
      emotionalRegister: work.emotionalRegister,
      imageUrl: s3Url,
      thumbnailUrl: s3Url,
      journalExcerpt: work.journalExcerpt,
      neonReading: work.neonReading,
      seriesName: "Celestial Secrets",
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
  const manifestPath = "/home/ubuntu/neon-crucible/celestial_secrets_manifest.json";
  fs.writeFileSync(manifestPath, JSON.stringify(results, null, 2));
  console.log(`\nManifest saved to: ${manifestPath}`);
  console.log("Done!");
}

uploadCelestialSecrets().catch(console.error);
