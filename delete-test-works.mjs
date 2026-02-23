import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { works } from './drizzle/schema.ts';
import { inArray } from 'drizzle-orm';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

// Delete test works by their IDs
const testWorkIds = [300001, 330001];

console.log('Deleting test works with IDs:', testWorkIds);

const result = await db.delete(works).where(inArray(works.id, testWorkIds));

console.log('Deleted successfully');

await connection.end();
