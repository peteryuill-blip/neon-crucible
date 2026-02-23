import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { works } from './drizzle/schema.ts';
import { eq, like } from 'drizzle-orm';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

// Find thr3e work
const thr3eWork = await db.select().from(works).where(like(works.title, '%thr3e%'));

console.log('=== THR3E WORK IN DATABASE ===');
console.log(JSON.stringify(thr3eWork, null, 2));

// Also check all test works
const testWorks = await db.select().from(works).where(like(works.title, '%test%'));
console.log('\n=== TEST WORKS IN DATABASE ===');
console.log(JSON.stringify(testWorks.map(w => ({ id: w.id, title: w.title, slug: w.slug })), null, 2));

await connection.end();
