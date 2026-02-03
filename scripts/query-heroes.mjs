import { drizzle } from "drizzle-orm/mysql2";
import { works } from "../drizzle/schema.ts";
import { like, or } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL);

const results = await db.select({
  title: works.title,
  imageUrl: works.imageUrl,
  phaseId: works.phaseId
}).from(works).where(
  or(
    like(works.title, '%As Above%'),
    like(works.title, '%Theatre of Memory%'),
    like(works.title, '%Celestial Secrets 8%'),
    like(works.title, '%Gravity Well%'),
    like(works.title, '%Ode to Therion%'),
    like(works.title, '%Covenant%'),
    like(works.title, '%Ink Storm%')
  )
).limit(20);

console.log(JSON.stringify(results, null, 2));
process.exit(0);
