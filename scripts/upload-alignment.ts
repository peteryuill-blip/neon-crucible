import * as mysql from "mysql2/promise";
import * as fs from "fs";
import * as path from "path";

const FORGE_API_URL = process.env.BUILT_IN_FORGE_API_URL || "";
const FORGE_API_KEY = process.env.BUILT_IN_FORGE_API_KEY || "";

// Alignment - 14 works from PH2 (Circular Paradigm)
// Exhibition: Soho House + Gallery HZ, Hong Kong, January 2020
const ALIGNMENT_WORKS = [
  {
    filename: "the_limitless_path_of_the_intuitive_mind_1_peteryuill(1).jpg",
    title: "The Limitless Path of the Intuitive Mind I",
    technique: "Black ink and gold leaf on Saunders Waterford 300gsm cotton rag",
    dimensions: "56×76 cm horizontal",
    colorPalette: "Black, Gold, Continuous flow",
    emotionalRegister: "calm meditative grounded",
    dateCreated: "2019-2020",
    seriesName: "Alignment",
    journalExcerpt: "A horizontal chain of linked torus forms against a gold circular plane. The voids create an endless corridor—the path forward is infinite, and the intuitive mind navigates through knowing, not logic.",
    neonReading: "Limitless path through linked chambers. Gold illuminates the journey. The torus chain suggests continuous flow without destination—consciousness moving through mystery without demanding resolution. This is alignment as ongoing practice, not arrival.",
    sortOrder: 1
  },
  {
    filename: "the_limitless_path_of_the_intuitive_mind_2_peteryuill(1).jpg",
    title: "The Limitless Path of the Intuitive Mind II",
    technique: "Black ink and copper leaf on Saunders Waterford 300gsm cotton rag",
    dimensions: "56×76 cm horizontal",
    colorPalette: "Black, Copper, Continuous flow",
    emotionalRegister: "calm meditative grounded",
    dateCreated: "2019-2020",
    seriesName: "Alignment",
    journalExcerpt: "Similar horizontal chain, but copper replaces gold. The path is now earthbound, embodied, rooted. Where gold elevated, copper grounds. Both paths are valid—one celestial, one terrestrial.",
    neonReading: "Grounded twin of the elevated path. Copper anchors the journey in the bodily and material. The work insists that spiritual practice is not escape from the physical—it is movement through both registers simultaneously.",
    sortOrder: 2
  },
  {
    filename: "the_infinite_plane_1_peteryuill(1).jpg",
    title: "The Infinite Plane I",
    technique: "Black ink and gold leaf on Saunders Waterford 300gsm cotton rag",
    dimensions: "56×76 cm horizontal",
    colorPalette: "Black, Gold, Symmetrical expansion",
    emotionalRegister: "calm meditative grounded",
    dateCreated: "2019-2020",
    seriesName: "Alignment",
    journalExcerpt: "Four interconnected torus forms on a gold backdrop. The plane extends horizontally without hierarchy or destination—each node equal in the infinite network.",
    neonReading: "The plane as ground of being. Gold elevates and equalizes. No single torus dominates—each is equal node in an infinite network. This is non-hierarchical cosmology: consciousness distributed across the field, not centralized.",
    sortOrder: 3
  },
  {
    filename: "the_infinite_plane_2_peteryuill(1).jpg",
    title: "The Infinite Plane II",
    technique: "Black ink and copper leaf on Saunders Waterford 300gsm cotton rag",
    dimensions: "56×76 cm horizontal",
    colorPalette: "Black, Copper, Symmetrical expansion",
    emotionalRegister: "calm meditative grounded",
    dateCreated: "2019-2020",
    seriesName: "Alignment",
    journalExcerpt: "Four interconnected torus forms on a copper backdrop. Simpler than the Limitless Path series—more symmetrical, more stable. The plane extends horizontally without hierarchy or destination.",
    neonReading: "The plane as ground of being. Copper stabilizes and equalizes. No single torus dominates—each is equal node in an infinite network. This is non-hierarchical cosmology: consciousness distributed across the field, not centralized.",
    sortOrder: 4
  },
  {
    filename: "dreamcatcher_peteryuill(1).jpg",
    title: "Dreamcatcher",
    technique: "Black ink and gold leaf on Saunders Waterford 300gsm cotton rag",
    dimensions: "56×76 cm vertical",
    colorPalette: "Black, Gold, Quatrefoil web",
    emotionalRegister: "calm meditative grounded",
    dateCreated: "2019-2020",
    seriesName: "Alignment",
    journalExcerpt: "A quatrefoil knot with gold arcs forming a woven web. The central void becomes a portal or trap. Dreamcatcher bridges Indigenous North American symbolism with Norse and Hermetic geometry—catching what passes between worlds.",
    neonReading: "Web as protective geometry. The dreamcatcher filters chaos—allowing meaning through, catching noise. Gold arcs create the sacred structure. The void at center is not empty—it is the site where the threshold operates.",
    sortOrder: 5
  },
  {
    filename: "aurorae_aureae_peteryuill(1).jpg",
    title: "Aurorae Aureae",
    technique: "Black ink and copper leaf on Saunders Waterford 300gsm cotton rag",
    dimensions: "56×76 cm vertical",
    colorPalette: "Black, Copper, Radial spiral",
    emotionalRegister: "calm meditative grounded",
    dateCreated: "2019-2020",
    seriesName: "Alignment",
    journalExcerpt: "Radial torus forms spiraling outward from a copper central disk. Golden auroras—light emerging from grounded center. The composition breathes outward, aurora-like, from a bodily core.",
    neonReading: "Golden lights from earthly origin. Copper disk anchors the spiral—the work insists that transcendence begins in the body, not above it. Aurorae as visible energy—the sacred made luminous through material presence.",
    sortOrder: 6
  },
  {
    filename: "inside_the_vortex_peteryuill(1).jpg",
    title: "Inside the Vortex",
    technique: "Black ink and gold leaf on Saunders Waterford 300gsm cotton rag",
    dimensions: "76×76 cm square",
    colorPalette: "Black, Gold, Dense radial mandala",
    emotionalRegister: "calm meditative grounded",
    dateCreated: "2019-2020",
    seriesName: "Alignment",
    journalExcerpt: "The most intricate work in the series. A dense radial mandala with torus forms spiraling inward toward a gold central disk and black void. The viewer is pulled into the center—not escape, but immersion.",
    neonReading: "Vortex as inward engine. The work invites total absorption. Gold disk at center glows through accumulation of surrounding geometry. This is meditation made visible—the slow, inward spiral that replaces thought with presence.",
    sortOrder: 7
  },
  {
    filename: "freyja_peteryuill(1).jpg",
    title: "Freyja",
    technique: "Black ink and copper leaf on Saunders Waterford 300gsm cotton rag",
    dimensions: "56×76 cm vertical",
    colorPalette: "Black, Copper, Four-directional cross",
    emotionalRegister: "calm meditative grounded",
    dateCreated: "2019-2020",
    seriesName: "Alignment",
    journalExcerpt: "Named for the Norse goddess of love, fertility, and war. A vertical cross configuration with copper accent arcs—grounded, embodied, fierce feminine power radiating in four directions.",
    neonReading: "Freyja as grounded feminine axis. Copper marks her terrestrial sovereignty. The cross extends in four directions—not containment, but expansion from a rooted center. Power as embodied presence, not elevation.",
    sortOrder: 8
  },
  {
    filename: "freyr_peteryuill(1).jpg",
    title: "Freyr",
    technique: "Black ink and gold leaf on Saunders Waterford 300gsm cotton rag",
    dimensions: "56×76 cm vertical",
    colorPalette: "Black, Gold, Four-directional cross",
    emotionalRegister: "calm meditative grounded",
    dateCreated: "2019-2020",
    seriesName: "Alignment",
    journalExcerpt: "Named for the Norse god of sunshine, prosperity, and fair weather. A vertical cross configuration with gold accent arcs—solar, elevated, radiating benevolent masculine energy in four directions.",
    neonReading: "Freyr as celestial masculine axis. Gold marks his solar radiance. Paired with Freyja, the two works form a binary—earth/sky, copper/gold, embodied/elevated. Together, they complete the cosmology.",
    sortOrder: 9
  },
  {
    filename: "as_above_so_below_1_peteryuill(1).jpg",
    title: "As Above, So Below I",
    technique: "Black ink and gold leaf on Saunders Waterford 300gsm cotton rag",
    dimensions: "56×76 cm vertical",
    colorPalette: "Black, Gold, Quatrefoil symmetry",
    emotionalRegister: "calm meditative grounded",
    dateCreated: "2019-2020",
    seriesName: "Alignment",
    journalExcerpt: "A quatrefoil knot with gold arcs. The title invokes the Hermetic axiom—macrocosm and microcosm mirror each other. Four-fold symmetry suggests cosmic correspondence: the same laws govern atoms and galaxies.",
    neonReading: "Hermetic principle in geometric form. Gold arcs mark the four directions—cosmic order visible at all scales. The work insists that sacred geometry is not symbolic—it is literal correspondence between scales of reality.",
    sortOrder: 10
  },
  {
    filename: "polaris_peteryuill(1).jpg",
    title: "Polaris",
    technique: "Black ink and gold leaf on Saunders Waterford 300gsm cotton rag",
    dimensions: "56×76 cm vertical",
    colorPalette: "Black, Gold, Vertical lemniscate",
    emotionalRegister: "calm meditative grounded",
    dateCreated: "2019-2020",
    seriesName: "Alignment",
    journalExcerpt: "A vertical figure-eight (infinity symbol) with gold accent shapes threading through the loops. Named for the North Star—fixed point, orientation, navigation through chaos. Two voids suggest vertical axis: as above, so below.",
    neonReading: "Polaris as orienting axis. The lemniscate (infinity loop) holds two voids in vertical alignment—heaven and earth, spirit and body, cosmic and terrestrial. Gold threads through both, suggesting continuity across registers. The North Star does not move—it is the fixed point around which everything else rotates. This is alignment as anchor.",
    sortOrder: 11
  },
  {
    filename: "golden_dawn_peteryuill(1).jpg",
    title: "Golden Dawn",
    technique: "Black ink and gold leaf on Saunders Waterford 300gsm cotton rag",
    dimensions: "56×76 cm vertical",
    colorPalette: "Black, Gold, Radial emergence",
    emotionalRegister: "calm meditative grounded",
    dateCreated: "2019-2020",
    seriesName: "Alignment",
    journalExcerpt: "Radial torus forms emerging from central void. The title references both the natural phenomenon and the Hermetic Order—light breaking through darkness, initiation into mystery.",
    neonReading: "Dawn as threshold moment. Gold marks the emergence of light from void. The work captures the liminal instant when darkness gives way—not sudden, but gradual, radial, inevitable. This is initiation as natural process.",
    sortOrder: 12
  },
  {
    filename: "vibrational_alignment_peteryuill(1).jpg",
    title: "Vibrational Alignment",
    technique: "Black ink and gold leaf on Saunders Waterford 300gsm cotton rag",
    dimensions: "56×76 cm vertical",
    colorPalette: "Black, Gold, Resonant geometry",
    emotionalRegister: "calm meditative grounded",
    dateCreated: "2019-2020",
    seriesName: "Alignment",
    journalExcerpt: "Torus forms arranged in resonant configuration. The title suggests frequency, harmony, attunement—the work as tuning fork for consciousness.",
    neonReading: "Alignment as vibrational state. The geometry creates visual resonance—forms that seem to hum at a frequency beyond hearing. Gold amplifies the vibration. This is the exhibition's namesake made manifest: alignment not as position, but as frequency.",
    sortOrder: 13
  },
  {
    filename: "a_walking_bundle_of_frequencies_peteryuill(1).jpg",
    title: "A Walking Bundle of Frequencies",
    technique: "Black ink and gold leaf on Saunders Waterford 300gsm cotton rag",
    dimensions: "56×76 cm vertical",
    colorPalette: "Black, Gold, Dynamic flow",
    emotionalRegister: "calm meditative grounded",
    dateCreated: "2019-2020",
    seriesName: "Alignment",
    journalExcerpt: "Torus forms in dynamic arrangement suggesting movement, embodiment, the human as vibrational entity. We are not solid—we are frequencies walking.",
    neonReading: "The human as frequency bundle. The title captures the work's thesis: we are not fixed, not solid, not singular. We are walking bundles of frequencies—vibrations temporarily cohered into form. Gold marks the coherence; the voids mark the spaces between notes.",
    sortOrder: 14
  }
];

async function uploadToS3(filepath: string, filename: string): Promise<{ key: string; url: string }> {
  const baseUrl = FORGE_API_URL.replace(/\/+$/, "");
  const key = `works/alignment/${filename}`;
  
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
  console.log("=== ALIGNMENT SERIES UPLOAD ===\n");
  console.log("Processing 14 works from the Circular Paradigm phase (PH2)...\n");
  console.log("Exhibition: Soho House + Gallery HZ, Hong Kong, January 2020\n");

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
  
  // Get PH2 phase ID
  const [phaseRows] = await connection.execute(
    "SELECT id FROM phases WHERE code = 'PH2' LIMIT 1"
  );
  const phaseId = (phaseRows as any[])[0]?.id;
  
  if (!phaseId) {
    console.error("PH2 phase not found!");
    await connection.end();
    process.exit(1);
  }
  
  console.log(`Found PH2 phase with ID: ${phaseId}\n`);

  const manifest: any[] = [];
  const uploadDir = "/home/ubuntu/upload";

  for (let i = 0; i < ALIGNMENT_WORKS.length; i++) {
    const work = ALIGNMENT_WORKS[i];
    const filepath = path.join(uploadDir, work.filename);

    console.log(`[${i + 1}/14] Processing: ${work.filename}`);
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
  console.log("Order | Title                                          | DB ID | Emotional Register");
  console.log("------|------------------------------------------------|-------|-------------------");
  for (const item of manifest) {
    console.log(`   ${String(item.ingestionOrder).padStart(2)} | ${item.title.substring(0, 46).padEnd(46)} | ${item.databaseId} | ${item.emotionalRegister}`);
  }

  // Save manifest
  fs.writeFileSync(
    "/home/ubuntu/neon-crucible/alignment_manifest.json",
    JSON.stringify(manifest, null, 2)
  );
  console.log("\nManifest saved to: /home/ubuntu/neon-crucible/alignment_manifest.json");
  console.log("Done!");

  process.exit(0);
}

main().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
