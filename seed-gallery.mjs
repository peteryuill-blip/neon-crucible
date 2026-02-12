/**
 * Seed script: Upsert enriched gallery data from monolith_seed_updated_v2.json
 * 
 * - Updates existing works with curatorialHook, neonReading (enriched), medium, year, slug, conceptTags
 * - Preserves existing seriesName from DB
 * - Generates slugs from titles
 * - The seed file is authoritative for: title, medium, dimensions, year, imageUrl, thumbnailUrl, imageKey, curatorialHook, neonReading, tags
 */

import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const seedData = JSON.parse(
  fs.readFileSync('/home/ubuntu/upload/monolith_seed_updated_v2.json', 'utf8')
);

// Load existing series map from DB export
const existingSeriesMap = JSON.parse(
  fs.readFileSync('/home/ubuntu/existing_series_map.json', 'utf8')
);

function generateSlug(title, id) {
  let slug = title
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
  
  // Ensure uniqueness by appending id suffix
  return `${slug}-${id}`;
}

async function seed() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  
  console.log(`Seeding ${seedData.length} works from monolith_seed_updated_v2.json...`);
  
  let updated = 0;
  let errors = 0;
  const slugSet = new Set();
  
  for (const work of seedData) {
    const id = parseInt(work.id);
    const slug = generateSlug(work.title, work.id);
    
    // Check slug uniqueness
    if (slugSet.has(slug)) {
      console.error(`DUPLICATE SLUG: ${slug} for work ${work.title} (id: ${id})`);
      errors++;
      continue;
    }
    slugSet.add(slug);
    
    // Get existing series from DB
    const seriesName = existingSeriesMap[id.toString()] || null;
    
    // Clean curatorialHook (remove trailing \n+1)
    let curatorialHook = work.curatorialHook || null;
    if (curatorialHook) {
      curatorialHook = curatorialHook.replace(/\n?\+1$/, '').trim();
    }
    
    // Tags from seed data
    const tags = work.tags && work.tags.length > 0 ? JSON.stringify(work.tags) : null;
    
    try {
      await conn.execute(
        `UPDATE works SET 
          title = ?,
          slug = ?,
          medium = ?,
          dimensions = ?,
          year = ?,
          imageUrl = ?,
          thumbnailUrl = ?,
          imageKey = ?,
          curatorialHook = ?,
          neonReading = ?,
          conceptTags = ?,
          seriesName = COALESCE(?, seriesName)
        WHERE id = ?`,
        [
          work.title,
          slug,
          work.medium || null,
          work.dimensions || null,
          work.year || null,
          work.imageUrl || null,
          work.thumbnailUrl || null,
          work.imageKey || null,
          curatorialHook,
          work.neonReading || null,
          tags,
          seriesName,
          id
        ]
      );
      
      // Check if row was actually updated
      const [result] = await conn.execute('SELECT id FROM works WHERE id = ?', [id]);
      if (result.length === 0) {
        console.warn(`MISSING: Work id=${id} "${work.title}" not found in DB`);
      } else {
        updated++;
      }
    } catch (err) {
      console.error(`ERROR updating id=${id}: ${err.message}`);
      errors++;
    }
  }
  
  console.log(`\n=== Seed Complete ===`);
  console.log(`Updated: ${updated}`);
  console.log(`Errors: ${errors}`);
  console.log(`Total in seed: ${seedData.length}`);
  
  // Verify
  const [allWorks] = await conn.execute('SELECT COUNT(*) as cnt FROM works WHERE slug IS NOT NULL');
  console.log(`Works with slugs: ${allWorks[0].cnt}`);
  
  const [noSlug] = await conn.execute('SELECT COUNT(*) as cnt FROM works WHERE slug IS NULL');
  console.log(`Works without slugs: ${noSlug[0].cnt}`);
  
  const [noMedium] = await conn.execute('SELECT COUNT(*) as cnt FROM works WHERE medium IS NULL');
  console.log(`Works without medium: ${noMedium[0].cnt}`);
  
  const [noCuratorialHook] = await conn.execute('SELECT COUNT(*) as cnt FROM works WHERE curatorialHook IS NULL');
  console.log(`Works without curatorialHook: ${noCuratorialHook[0].cnt}`);
  
  const [noNeonReading] = await conn.execute('SELECT COUNT(*) as cnt FROM works WHERE neonReading IS NULL OR neonReading = ""');
  console.log(`Works without neonReading: ${noNeonReading[0].cnt}`);
  
  const [noSeries] = await conn.execute('SELECT COUNT(*) as cnt FROM works WHERE seriesName IS NULL');
  console.log(`Works without seriesName: ${noSeries[0].cnt}`);
  
  await conn.end();
}

seed().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
