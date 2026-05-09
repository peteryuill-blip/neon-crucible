import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { metaquestions, works } from "./drizzle/schema";
import { eq, and } from "drizzle-orm";
import fs from "fs";
import "dotenv/config";

const C = { CYAN: "\x1b[36m", GREEN: "\x1b[32m", YELLOW: "\x1b[33m", RED: "\x1b[31m", GRAY: "\x1b[90m", RESET: "\x1b[0m" };
const FILE_PATH = "/storage/emulated/0/NEON/🔴🔵- KEY FILES -🔴🔵/CY_HYPER_UNIFIED_WEB_REPORT.md";

async function runReportSync() {
  console.log(`\n${C.CYAN}${"=".repeat(75)}${C.RESET}`);
  console.log(`${C.CYAN} ORACLE REPORT: LOSSLESS DATA EXTRACTION PROTOCOL ${C.RESET}`);
  console.log(`${C.CYAN}${"=".repeat(75)}${C.RESET}\n`);

  if (!process.env.DATABASE_URL) {
    console.error(`${C.RED}[FATAL] DATABASE_URL missing.${C.RESET}`);
    process.exit(1);
  }

  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  const db = drizzle(connection);
  const content = fs.readFileSync(FILE_PATH, "utf-8");

  // ---------------------------------------------------------
  // PASS 1: WEEKLY TELEMETRY EXTRACTION
  // ---------------------------------------------------------
  console.log(`${C.GRAY}>>> Pass 1: Mining Weekly Production Matrix...${C.RESET}`);
  const weeklyData: any[] = [];
  const tableMatch = content.match(/\| WK \|[\s\S]+?\n([\s\S]+?)\n\n/);
  
  if (tableMatch) {
    const rows = tableMatch[1].trim().split("\n").slice(1); // Skip separator row
    rows.forEach(row => {
      const cols = row.split("|").map(c => c.trim()).filter(Boolean);
      weeklyData.push({
        week: cols[0], works: parseInt(cols[1]), avgRate: parseFloat(cols[2]),
        kineticHrs: parseFloat(cols[3]), areaM2: parseFloat(cols[4]),
        surface: cols[5], highYield: parseInt(cols[6])
      });
    });
    console.log(`${C.GREEN}[OK] Extracted ${weeklyData.length} weeks of telemetry data.${C.RESET}`);
  }

  // ---------------------------------------------------------
  // PASS 2: A34 STATISTICAL EXTRACTION
  // ---------------------------------------------------------
  console.log(`${C.GRAY}>>> Pass 2: Mining A34 Summary Stats...${C.RESET}`);
  const a34Match = content.match(/### A34 SUMMARY\n```json\n([\s\S]+?)\n```/);
  const stats = a34Match ? JSON.parse(a34Match[1]) : [];
  console.log(`${C.GREEN}[OK] Extracted ${stats.length} master statistical data points.${C.RESET}`);

  // ---------------------------------------------------------
  // PASS 3: A35 QUALITATIVE INQUIRY SYNC
  // ---------------------------------------------------------
  console.log(`${C.GRAY}>>> Pass 3: Syncing A35 Open Questions to Metaquestions...${C.RESET}`);
  const a35Match = content.match(/### A35 SUMMARY\n```json\n([\s\S]+?)\n```/);
  const questions = a35Match ? JSON.parse(a35Match[1]) : [];
  
  let newQuestions = 0;
  let skippedQuestions = 0;

  for (const qText of questions) {
    const existing = await db.select().from(metaquestions).where(eq(metaquestions.question, qText));
    if (existing.length === 0) {
      await db.insert(metaquestions).values({
        question: qText,
        isAnswered: false,
        isAnswerPrivate: false,
        sortOrder: 999 // New questions go to the end
      });
      newQuestions++;
    } else {
      skippedQuestions++;
    }
  }
  console.log(`${C.GREEN}[OK] Metaquestions Updated: ${newQuestions} New, ${skippedQuestions} Existing.${C.RESET}`);

  // ---------------------------------------------------------
  // STORAGE: SENTINEL PERSISTENCE
  // ---------------------------------------------------------
  // We store the global telemetry in a "Sentinel" record in the works table 
  // with a specific slug "oracle_telemetry_master" to avoid schema changes.
  console.log(`${C.GRAY}>>> Saving Aggregate Telemetry to Sentinel Record...${C.RESET}`);
  const sentinelData = {
    weekly_matrix: weeklyData,
    summary_stats: stats,
    extracted_at: new Date().toISOString()
  };

  const existingSentinel = await db.select().from(works).where(eq(works.slug, "oracle_telemetry_master"));
  
  const payload = {
    title: "ORACLE_TELEMETRY_MASTER",
    slug: "oracle_telemetry_master",
    technicalObservation: JSON.stringify(sentinelData),
    phaseId: 60606,
    isPublished: false // Hidden from public gallery
  };

  if (existingSentinel.length === 0) {
    await db.insert(works).values(payload);
  } else {
    await db.update(works).set(payload).where(eq(works.slug, "oracle_telemetry_master"));
  }

  console.log(`\n${C.CYAN}${"=".repeat(75)}${C.RESET}`);
  console.log(`${C.GREEN} REPORT EXTRACTION SUCCESSFUL: ARCHIVE INTELLIGENCE SYNCED ${C.RESET}`);
  console.log(`${C.CYAN}${"=".repeat(75)}${C.RESET}\n`);

  await connection.end();
  process.exit(0);
}

runReportSync();
