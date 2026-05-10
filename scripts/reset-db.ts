import { db } from "../server/db";
import { works } from "../server/schema";
async function reset() {
  console.log("🧨 Dropping all works...");
  await db.delete(works);
  console.log("✅ Cleared. Run seed-demo.ts or oracle_sync.ts to repopulate.");
  process.exit(0);
}
reset().catch(err => { console.error("❌ Reset failed:", err.message); process.exit(1); });
