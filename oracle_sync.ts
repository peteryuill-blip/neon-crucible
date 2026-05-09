import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { works } from "./drizzle/schema";
import { eq } from "drizzle-orm";
import fs from "fs";
import "dotenv/config";

// --- ANSI Terminal Colors for Diagnostics ---
const C = {
  CYAN: "\x1b[36m",
  GREEN: "\x1b[32m",
  YELLOW: "\x1b[33m",
  RED: "\x1b[31m",
  MAGENTA: "\x1b[35m",
  GRAY: "\x1b[90m",
  RESET: "\x1b[0m",
};

const FILE_PATH = "/storage/emulated/0/NEON/🔴🔵- KEY FILES -🔴🔵/CY_HYPER_UNIFIED_FEATURE_MATRIX.json";

function logHeader(text: string) {
  console.log(`\n${C.CYAN}${"=".repeat(75)}${C.RESET}`);
  console.log(`${C.CYAN} ${text} ${C.RESET}`);
  console.log(`${C.CYAN}${"=".repeat(75)}${C.RESET}\n`);
}

function normalizeDecimal(val: number | string | null | undefined): string | null {
  if (val === null || val === undefined) return null;
  const num = parseFloat(String(val));
  return isNaN(num) ? null : num.toFixed(1);
}

async function runSync() {
  logHeader("ORACLE MATRIX: TWO-PASS DIFFERENTIAL SYNC INITIATED");

  if (!process.env.DATABASE_URL) {
    console.error(`${C.RED}[FATAL] DATABASE_URL not found in .env. Aborting.${C.RESET}`);
    process.exit(1);
  }

  // ---------------------------------------------------------
  // PRE-FLIGHT: Connect & Load Data
  // ---------------------------------------------------------
  process.stdout.write(`${C.GRAY}>>> Initializing MySQL Connection...${C.RESET}`);
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  const db = drizzle(connection);
  console.log(`\r${C.GREEN}[OK] MySQL Connection Established.       ${C.RESET}`);

  process.stdout.write(`${C.GRAY}>>> Locating Oracle Matrix...${C.RESET}`);
  if (!fs.existsSync(FILE_PATH)) {
    console.error(`\n${C.RED}[FATAL] Matrix JSON not found at: ${FILE_PATH}${C.RESET}`);
    process.exit(1);
  }
  
  const rawData = JSON.parse(fs.readFileSync(FILE_PATH, "utf-8"));
  const matrixItems = rawData.works || (Array.isArray(rawData) ? rawData : Object.values(rawData));
  console.log(`\r${C.GREEN}[OK] Oracle Matrix Loaded: ${matrixItems.length} records mapped.${C.RESET}`);

  // ---------------------------------------------------------
  // PASS 1: VALIDATION & DIFFERENTIAL ANALYSIS
  // ---------------------------------------------------------
  logHeader("PASS 1: DIFFERENTIAL ANALYSIS & DATA EXTRACTION");
  
  process.stdout.write(`${C.GRAY}>>> Fetching current archive state from Railway...${C.RESET}`);
  const existingWorks = await db.select().from(works).where(eq(works.phaseId, 60606));
  console.log(`\r${C.GREEN}[OK] Archive State Fetched: ${existingWorks.length} existing works.${C.RESET}`);

  // Create lookup map for O(1) comparison
  const existingMap = new Map(existingWorks.map(w => [w.slug, w]));

  const queue = {
    insert: [] as any[],
    update: [] as { id: number; data: any; tCode: string }[],
    skip: 0,
    invalid: 0
  };

  for (const item of matrixItems) {
    if (!item.t_code) {
      queue.invalid++;
      continue;
    }

    // --- ORACLE DATA PACKAGING ---
    // Extracting all remaining data points not explicitly in the DB schema
    // into a strict JSON payload to ensure ZERO data loss.
    const oracleMetadata = {
      temporal: {
        weekday: item.weekday,
        month: item.month,
      },
      physical: {
        area_cm2: item.area_cm2,
        area_m2: item.area_m2,
      },
      weekly_stats: {
        avg_rating: item.week_avg_rating,
        count: item.week_count,
        kill_pct: item.week_kill_pct
      },
      ambient_context: {
        hours: item.ambient_hours,
        jester: item.ambient_jester,
        steps: item.ambient_steps,
        energy: item.ambient_energy,
        walking: item.ambient_walking,
        sciatica: item.ambient_sciatica,
        rest_days: item.ambient_rest_days,
        mega_walk: item.ambient_mega_walk
      },
      matrix_flags: {
        is_kill: item.is_kill,
        is_save: item.is_save,
        original_phase_string: item.phase
      }
    };

    // --- CORE DB SCHEMA MAPPING ---
    const mappedData = {
      title: item.cid || `666${item.t_num}`,
      slug: item.t_code,
      tCode: item.t_code,
      sovereignId: item.cid || null,
      phaseId: 60606,
      dateCreated: item.date || null,
      year: item.date ? item.date.substring(0, 4) : "2026",
      sortOrder: parseInt(item.t_num) || 0,
      
      surface: item.surface || null,
      rating: Math.round(parseFloat(item.rating)) || 1, // Enforces integer mapping
      hours: normalizeDecimal(item.hrs),
      disposition: item.disp || null,
      orientation: item.orient || null,
      weekNumber: parseInt(item.wk) || null,
      
      // Inject the 17 extra data points here
      technicalObservation: JSON.stringify(oracleMetadata),
      
      // Default safety fallbacks
      medium: "Sumi Ink on Paper",
      dimensions: "97x180cm", 
      isPublished: true,
    };

    const existing = existingMap.get(mappedData.slug);

    if (!existing) {
      // Unseen Work -> Route to Insert Queue
      queue.insert.push(mappedData);
    } else {
      // Differential check. Has ANY data point mutated?
      const existingHoursStr = existing.hours ? parseFloat(existing.hours as string).toFixed(1) : null;
      
      const hasChanged = 
        existing.rating !== mappedData.rating ||
        existing.disposition !== mappedData.disposition ||
        existingHoursStr !== mappedData.hours ||
        existing.surface !== mappedData.surface ||
        existing.orientation !== mappedData.orientation ||
        existing.dateCreated !== mappedData.dateCreated ||
        existing.weekNumber !== mappedData.weekNumber ||
        existing.technicalObservation !== mappedData.technicalObservation;

      if (hasChanged) {
        queue.update.push({ id: existing.id, data: mappedData, tCode: mappedData.tCode });
      } else {
        queue.skip++;
      }
    }
  }

  // Diagnostics Readout for Pass 1
  console.log(`\n${C.CYAN}--- DIFFERENTIAL RESULTS ---${C.RESET}`);
  console.log(`${C.GREEN}  + NEW WORKS:      ${queue.insert.length}${C.RESET}`);
  console.log(`${C.YELLOW}  ~ MODIFICATIONS:  ${queue.update.length}${C.RESET}`);
  console.log(`${C.GRAY}  = UNCHANGED:      ${queue.skip} (Skipping DB write)${C.RESET}`);
  if (queue.invalid > 0) console.log(`${C.RED}  ! INVALID/ORPHAN: ${queue.invalid}${C.RESET}`);

  // ---------------------------------------------------------
  // PASS 2: EXECUTION & DATABASE WRITE
  // ---------------------------------------------------------
  if (queue.insert.length === 0 && queue.update.length === 0) {
    logHeader("SYNC COMPLETE: ARCHIVE IS ALREADY 100% UP TO DATE");
    await connection.end();
    process.exit(0);
  }

  logHeader("PASS 2: DATABASE EXECUTION");

  try {
    // 1. Bulk Insert New Works 
    if (queue.insert.length > 0) {
      console.log(`${C.CYAN}>>> Executing Bulk Inserts (Chunked to protect packets)...${C.RESET}`);
      const chunkSize = 50;
      let processed = 0;
      
      for (let i = 0; i < queue.insert.length; i += chunkSize) {
        const chunk = queue.insert.slice(i, i + chunkSize);
        await db.insert(works).values(chunk);
        processed += chunk.length;
        process.stdout.write(`\r${C.GREEN}    [${processed}/${queue.insert.length}] Inserts committed...${C.RESET}`);
      }
      console.log(`\n${C.GREEN}[OK] Insertion Phase Complete.${C.RESET}`);
    }

    // 2. Sequentially Update Modified Works
    if (queue.update.length > 0) {
      console.log(`\n${C.CYAN}>>> Executing Targeted Updates...${C.RESET}`);
      let updated = 0;
      
      for (const item of queue.update) {
        await db.update(works)
          .set(item.data)
          .where(eq(works.id, item.id));
        
        updated++;
        process.stdout.write(`\r${C.YELLOW}    [${updated}/${queue.update.length}] Updating ${item.tCode}...${C.RESET}`);
      }
      console.log(`\n${C.GREEN}[OK] Modification Phase Complete.${C.RESET}`);
    }

    logHeader(`SYNC SUCCESSFUL: ${queue.insert.length + queue.update.length} TRANSACTIONS COMMITTED TO RAILWAY`);

  } catch (error: any) {
    console.error(`\n${C.RED}[FATAL ERROR DURING PASS 2 EXECUTION]${C.RESET}`);
    console.error(error.message);
  }

  await connection.end();
  process.exit(0);
}

runSync();
