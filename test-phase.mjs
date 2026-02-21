import { getDb } from './server/db.js';
import { phases } from './drizzle/schema.js';
import { like } from 'drizzle-orm';

const db = await getDb();
const result = await db.select().from(phases).where(like(phases.code, '%TEST%'));
console.log('Test phases found:', JSON.stringify(result, null, 2));
