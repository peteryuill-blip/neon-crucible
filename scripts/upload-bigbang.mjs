import { drizzle } from 'drizzle-orm/mysql2';
import { sql } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';

// Initialize database connection
const db = drizzle(process.env.DATABASE_URL);

// Big Bang series data extracted from the description file
const bigBangWorks = [
  {
    filename: 'BB1.jpg',
    title: 'Big Bang: Breath Aureole',
    phase: 'NE',
    dateCreated: '2025-04',
    technique: 'Sumi ink on Anhui rice paper',
    dimensions: '100x200cm',
    colorPalette: 'Black, Gray, Subtle cyan undertones',
    emotionalRegister: 'gentle',
    seriesName: 'Big Bang',
    journalExcerpt: 'Feathering, halos, and negative space—saved territory where ink approached but did not consume. Documented throughout series, especially in works emphasizing respiratory quality.',
    neonReading: 'The most delicate of the series. Graduated density aureoles and feathering create a sense of breath held and released. The cyan undertone (rare in this monochrome field) suggests alchemical shift—a trace of color as spirit breaking through matter. The Breath register at its most visible.',
    sortOrder: 1
  },
  {
    filename: 'BB2.jpg',
    title: 'Big Bang: Diagonal Thrust',
    phase: 'NE',
    dateCreated: '2025-04',
    technique: 'Sumi ink on Anhui rice paper',
    dimensions: '100x200cm',
    colorPalette: 'Black, Gray',
    emotionalRegister: 'brutal',
    seriesName: 'Big Bang',
    journalExcerpt: 'The biomechanics are whole-body: shoulder-torso-leg coordination, velocity that requires the full structure, not just wrist. The body becomes the primary instrument.',
    neonReading: 'High-velocity traversal. Energy enters one edge and exits another, edge-bleed implying form continuation beyond paper limits. This is Field logic incarnate—the work is an excerpt from a larger force-field, not a self-contained world. Diagonal thrust makes gravity visible as compositional co-author.',
    sortOrder: 2
  },
  {
    filename: 'BB3.jpg',
    title: 'Big Bang: Vertical Descent',
    phase: 'NE',
    dateCreated: '2025-04',
    technique: 'Sumi ink on Anhui rice paper',
    dimensions: '100x200cm (vertical orientation)',
    colorPalette: 'Black, Gray',
    emotionalRegister: 'brutal',
    seriesName: 'Big Bang',
    journalExcerpt: 'At 100cm x 200cm, these works demand full-body engagement. The paper laid flat on floor or table means the artist moves not as a stationary painter but as a dancer or ritual performer.',
    neonReading: "Vertical format activates gravity in a different register. Diagonal thrust becomes descent—ink falling, pooling, accumulating at the base. The body's choreography shifts when the paper is vertical; the marks trace falling motion rather than lateral sweep. This may be the series' test of orientation's effect on viscosity.",
    sortOrder: 3
  },
  {
    filename: 'BB4.jpg',
    title: 'Big Bang: Smoke Field',
    phase: 'NE',
    dateCreated: '2025-05',
    technique: 'Sumi ink on Anhui rice paper',
    dimensions: '100x200cm',
    colorPalette: 'Black, Gray, Atmospheric smoke',
    emotionalRegister: 'meditative',
    seriesName: 'Big Bang',
    journalExcerpt: 'The Breath—feathering, halos, and negative space representing saved territory where ink approached but did not consume. Essential to preventing the image from collapsing into pure darkness.',
    neonReading: "Atmospheric-dispersed typology. Cloud-masses and breath-space dominate. The Breath register is fully activated here—graduated density aureoles read as the work's respiratory system. This is the series at its most quiet, holding tension between presence and dissolution.",
    sortOrder: 4
  },
  {
    filename: 'BB5.jpg',
    title: 'Big Bang: Diagonal Thrust II',
    phase: 'NE',
    dateCreated: '2025-04',
    technique: 'Sumi ink on Anhui rice paper',
    dimensions: '100x200cm',
    colorPalette: 'Black, Gray',
    emotionalRegister: 'brutal',
    seriesName: 'Big Bang',
    journalExcerpt: 'The series abandons the centralized, mandala-like compositions characterizing Phases 1–3, adopting instead Field logic where energy traverses the picture plane rather than organizing around focal point.',
    neonReading: 'Second expression of high-velocity diagonal thrust. Where BB2 emphasized lateral sweep, this work shows ink pooling and accumulation at contact zones. The Bone and Flesh registers collaborate—dense blacks provide structure while mid-tone washes create turbulence. Edge-to-edge movement without center.',
    sortOrder: 5
  },
  {
    filename: 'BB6.jpg',
    title: 'Big Bang: Geological Core',
    phase: 'NE',
    dateCreated: '2025-04',
    technique: 'Sumi ink on Anhui rice paper',
    dimensions: '100x200cm',
    colorPalette: 'Black, Gray, Turbulent mid-tones',
    emotionalRegister: 'brutal',
    seriesName: 'Big Bang',
    journalExcerpt: 'The ink demonstrates distinctive viscosity regime. Register 2: The Flesh—mid-tone washes and granulation, produced through geological or biological micro-textures, result of ink sediment settling into paper fiber topography.',
    neonReading: "Dense-geological at center with atmospheric halo. The Flesh register dominates—mid-tone washes producing geological micro-textures, result of ink sediment settling into paper fiber topography. This work embodies compression where viscosity creates internal complexity and depth through gravity's collaboration.",
    sortOrder: 6
  },
  {
    filename: 'BB7.jpg',
    title: 'Big Bang: Breath & Bone',
    phase: 'NE',
    dateCreated: '2025-04',
    technique: 'Sumi ink on Anhui rice paper',
    dimensions: '100x200cm',
    colorPalette: 'Black, Gray',
    emotionalRegister: 'meditative',
    seriesName: 'Big Bang',
    journalExcerpt: 'Register 1: The Bone—highest density blacks, sits on paper fiber rather than soaking through, creates foreground depth with almost three-dimensional presence, functions as structural skeleton.',
    neonReading: "Hybrid-transitional showing the duality of the viscosity system. The Bone provides structural skeleton (dense blacks at center), while the Breath creates halos and feathering at edges. This work demonstrates that container is no longer drawn but enacted through ink's inherent behavior encountering paper's inherent resistance.",
    sortOrder: 7
  },
  {
    filename: 'BB8.jpg',
    title: 'Big Bang: Geological Core II',
    phase: 'NE',
    dateCreated: '2025-05',
    technique: 'Sumi ink on Anhui rice paper',
    dimensions: '100x200cm',
    colorPalette: 'Black, Gray, Dense turbulent center',
    emotionalRegister: 'brutal',
    seriesName: 'Big Bang',
    journalExcerpt: "The ink pools, settles, responds to earth's pull. Paper becomes a basin catching what falls. This is not possible with vertical easel work.",
    neonReading: 'Maximum compression at center with explosive periphery. Where BB6 showed geological formation, this work shows geological pressure—strata compressed into near-singularity. The Flesh register creates turbulence, density, and internal heat. Ink as tectonic force.',
    sortOrder: 8
  },
  {
    filename: 'BB9.jpg',
    title: 'Big Bang: Cloud Mass',
    phase: 'NE',
    dateCreated: '2025-05',
    technique: 'Sumi ink on Anhui rice paper',
    dimensions: '100x200cm',
    colorPalette: 'Black, Gray, Atmospheric wash',
    emotionalRegister: 'meditative',
    seriesName: 'Big Bang',
    journalExcerpt: 'These works function as temples dedicated to the act of creation rather than documents of it. Temple is not photograph of worship but site where worship occurred and can occur again.',
    neonReading: 'Atmospheric-dispersed, cousin to Smoke Field. Cloud-masses dominate, suggesting weather systems or cosmic nebulae. The work hovers between representation (it looks like clouds) and abstraction (it is ink behavior). This is the Field logic at its most elemental—pure atmosphere, pure breath, minimal structure.',
    sortOrder: 9
  },
  {
    filename: 'BB10.jpg',
    title: 'Big Bang: Shadow Self',
    phase: 'NE',
    dateCreated: '2025-05',
    technique: 'Sumi ink on Anhui rice paper',
    dimensions: '100x200cm',
    colorPalette: 'Black, Warm ochre undertones',
    emotionalRegister: 'mysterious',
    seriesName: 'Big Bang',
    journalExcerpt: 'Most bounded, creature-like form in series. If Shadow were to have shape, it might look like this—entity floating against void, both part of self and separate from it.',
    neonReading: "The outlier. Bounded-figural rather than field-based. This work reads as organism against void—a confrontation with the Shadow Self in Jungian terms. The warm ochre undertones (absent from the cooler atmospheric grays of other works) mark this as the series' reckoning with darkness not as absence but as presence. The only work that feels like a figure rather than a force.",
    sortOrder: 10
  }
];

async function main() {
  console.log('=== BIG BANG SERIES UPLOAD ===\n');
  console.log('Processing 10 works from the Big Bang series...\n');
  
  // Get or create NE phase
  let phaseResult = await db.execute(sql`SELECT id FROM phases WHERE code = 'NE' LIMIT 1`);
  let phaseId;
  
  if (phaseResult[0] && phaseResult[0].length > 0) {
    phaseId = phaseResult[0][0].id;
    console.log(`Found existing NE phase with ID: ${phaseId}\n`);
  } else {
    // Create NE phase
    await db.execute(sql`
      INSERT INTO phases (code, name, date_range, description, emotional_temperature, is_published)
      VALUES ('NE', 'New Era', '2025-present', 'The New Era phase marks the culmination of the 7-year practice into large-scale sumi ink works.', 'transcendent', true)
    `);
    phaseResult = await db.execute(sql`SELECT id FROM phases WHERE code = 'NE' LIMIT 1`);
    phaseId = phaseResult[0][0].id;
    console.log(`Created NE phase with ID: ${phaseId}\n`);
  }
  
  const manifest = [];
  const uploadDir = '/home/ubuntu/upload';
  
  for (let i = 0; i < bigBangWorks.length; i++) {
    const work = bigBangWorks[i];
    const filePath = path.join(uploadDir, work.filename);
    
    console.log(`[${i + 1}/10] Processing: ${work.filename}`);
    console.log(`  Title: ${work.title}`);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.log(`  WARNING: File not found at ${filePath}`);
      continue;
    }
    
    // Get file stats
    const stats = fs.statSync(filePath);
    console.log(`  File size: ${(stats.size / 1024).toFixed(2)} KB`);
    
    // Read image and convert to base64 data URL
    const imageBuffer = fs.readFileSync(filePath);
    const base64Image = imageBuffer.toString('base64');
    const dataUrl = `data:image/jpeg;base64,${base64Image}`;
    
    // Insert into database using raw SQL
    try {
      await db.execute(sql`
        INSERT INTO works (
          title, phase_id, date_created, technique, dimensions, 
          color_palette, emotional_register, image_url, thumbnail_url,
          journal_excerpt, neon_reading, series_name, is_published, sort_order
        ) VALUES (
          ${work.title}, ${phaseId}, ${work.dateCreated}, ${work.technique}, ${work.dimensions},
          ${work.colorPalette}, ${work.emotionalRegister}, ${dataUrl}, ${dataUrl},
          ${work.journalExcerpt}, ${work.neonReading}, ${work.seriesName}, true, ${work.sortOrder}
        )
      `);
      
      // Get the inserted ID
      const idResult = await db.execute(sql`SELECT LAST_INSERT_ID() as id`);
      const dbId = idResult[0][0].id;
      
      const now = new Date().toISOString();
      console.log(`  Database ID: ${dbId}`);
      console.log(`  Created at: ${now}`);
      
      manifest.push({
        ingestionOrder: i + 1,
        filename: work.filename,
        title: work.title,
        databaseId: Number(dbId),
        createdAt: now,
        fileSize: `${(stats.size / 1024).toFixed(2)} KB`,
        emotionalRegister: work.emotionalRegister,
        sortOrder: work.sortOrder
      });
      
      console.log(`  ✓ Successfully added to database\n`);
    } catch (err) {
      console.error(`  ERROR: ${err.message}\n`);
    }
  }
  
  // Output manifest
  console.log('\n=== INGESTION MANIFEST ===\n');
  console.log('Order | Filename   | Title                        | DB ID | Emotional Register');
  console.log('------|------------|------------------------------|-------|-------------------');
  
  for (const item of manifest) {
    console.log(
      `${String(item.ingestionOrder).padStart(5)} | ${item.filename.padEnd(10)} | ${item.title.substring(0, 28).padEnd(28)} | ${String(item.databaseId).padStart(5)} | ${item.emotionalRegister}`
    );
  }
  
  // Save manifest to file
  const manifestPath = '/home/ubuntu/neon-crucible/bigbang_manifest.json';
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\nManifest saved to: ${manifestPath}`);
  
  console.log('\nDone!');
  process.exit(0);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
