import { db } from "../server/db";
import { works } from "../server/schema";
import fs from "fs";

const JSON_PATH = process.env.ORACLE_MATRIX || "./CY_HYPER_UNIFIED_FEATURE_MATRIX.json";
const BATCH_SIZE = 50;

async function sync() {
  if (!fs.existsSync(JSON_PATH)) {
    console.error(`❌ Matrix file not found: ${JSON_PATH}`);
    process.exit(1);
  }
  const raw = fs.readFileSync(JSON_PATH, "utf-8");
  const data = JSON.parse(raw);
  let entries = Array.isArray(data) ? data : (data.works || data.nodes || Object.values(data).filter(v => v && typeof v === "object"));
  console.log(`📡 Oracle Batch Sync: ${entries.length} entries\n   Batch size: ${BATCH_SIZE}\n   Estimated batches: ${Math.ceil(entries.length / BATCH_SIZE)}\n`);
  let totalInserted = 0, totalSkipped = 0, totalFailed = 0;
  const totalBatches = Math.ceil(entries.length / BATCH_SIZE);
  for (let b = 0; b < totalBatches; b++) {
    const start = b * BATCH_SIZE;
    const batch = entries.slice(start, start + BATCH_SIZE);
    for (const entry of batch) {
      const tCode = entry.t_code || entry.tcode || `T${start + batch.indexOf(entry) + 1}`;
      const cid = entry.cid || entry.CID || entry.id || (start + batch.indexOf(entry) + 1);
      const sovereignId = `666-${String(cid).padStart(3, "0")}`;
      const title = entry.title || entry.Title || `Work ${tCode}`;
      const slug = (title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")) || `${sovereignId}-${tCode}`.toLowerCase();
      const disp = entry.disp || entry.disposition || "UN";
      const disposition = ["SA","TR","PT","SHP"].includes(disp) ? disp : "UN";
      const phase = entry.phase || "WARMUP";
      const phaseId = phase === "PRODUCTION" ? 60607 : 60606;
      const rating = entry.rating !== undefined ? Math.round(entry.rating) : 0;
      const h = entry.Height_cm || entry.height_cm;
      const w = entry.Width_cm || entry.width_cm;
      const dimensions = h && w ? `${h}×${w} cm` : (entry.dimensions || null);
      const medium = entry.Mediums || entry.mediums || entry.medium || null;
      const observation = {
        ambient_context: { steps: entry.ambient_steps || entry.Weekly_Steps || null, energy: entry.ambient_energy || null, jester: entry.ambient_jester || null, walking: entry.ambient_walking || false, sciatica: entry.ambient_sciatica || false, rest_days: entry.ambient_rest_days || null, mega_walk: entry.ambient_mega_walk || false },
        matrix_flags: { is_kill: entry.is_kill || false, is_save: entry.is_save || false },
        week_number: entry.wk || entry.weekNumber || null,
        date_info: { date: entry.date || null, weekday: entry.weekday || null, month: entry.month || null },
        surfaces: entry.surface || null, mediums: entry.Mediums || null, tools: entry.Tools || null,
        technical_observation: entry.Technical_Observation || null,
        self_directive: entry.Self_Directive || null,
        discovery: entry.Discovery || null,
        save_has_potential: entry.Save_Has_Potential_Flag || false,
        weekly_narrative: { weather_report: entry.Raw_Weather_Report || null, somatic_state: entry.Somatic_State || null, walking_insights: entry.Walking_Insights || null, phase_dna: entry.Phase_DNA || null },
      };
      try {
        await db.insert(works).values({ slug, title, tCode: String(tCode), sovereignId: String(sovereignId), phaseId, medium: medium ? String(medium) : null, dimensions, rating, disposition, technicalObservation: JSON.stringify(observation), weekNumber: entry.wk || entry.weekNumber || null });
        totalInserted++;
      } catch (err: any) {
        if (err.code === "ER_DUP_ENTRY") totalSkipped++;
        else { console.error(`   ❌ ${sovereignId}: ${err.message}`); totalFailed++; }
      }
    }
    const pct = Math.round(((b + 1) / totalBatches) * 100);
    process.stdout.write(`\r   [${pct}%] Batch ${b + 1}/${totalBatches} — ✅ ${totalInserted} ⏭️ ${totalSkipped} ❌ ${totalFailed}     `);
  }
  console.log(`\n\n🚀 Sync complete: ${totalInserted} inserted, ${totalSkipped} skipped, ${totalFailed} failed`);
  process.exit(0);
}
sync().catch(err => { console.error("\n❌ Sync failed:", err.message); process.exit(1); });
