import { getDb } from '../server/db';
import { works } from '../drizzle/schema';
import { eq, inArray } from 'drizzle-orm';

async function main() {
  const db = await getDb();
  
  // Get all PH1 works
  const allPh1 = await db.select().from(works).where(eq(works.phaseId, 30001));
  console.log('Total PH1 works before cleanup:', allPh1.length);
  
  // Group by title, keep the one with lowest ID (first inserted)
  const titleToKeep = new Map<string, typeof allPh1[0]>();
  for (const w of allPh1) {
    const existing = titleToKeep.get(w.title);
    if (!existing || w.id < existing.id) {
      titleToKeep.set(w.title, w);
    }
  }
  
  // Find IDs to delete (all except the ones we're keeping)
  const keepIds = new Set([...titleToKeep.values()].map(w => w.id));
  const deleteIds: number[] = [];
  for (const w of allPh1) {
    if (!keepIds.has(w.id)) {
      deleteIds.push(w.id);
    }
  }
  
  console.log('Works to keep:', keepIds.size);
  console.log('Works to delete:', deleteIds.length);
  
  // Delete duplicates
  if (deleteIds.length > 0) {
    await db.delete(works).where(inArray(works.id, deleteIds));
    console.log('Deleted', deleteIds.length, 'duplicate works');
  }
  
  // Verify
  const remaining = await db.select().from(works).where(eq(works.phaseId, 30001));
  console.log('Total PH1 works after cleanup:', remaining.length);
}

main().catch(console.error);
