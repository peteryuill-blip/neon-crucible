/**
 * Database CSV Export Script
 * Exports all tables from the neon-crucible MySQL database to CSV files.
 * Output: data_export/{table}.csv
 *
 * Usage: node scripts/export-csv.mjs
 */

import { createConnection } from "mysql2/promise";
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
require("dotenv").config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");
const outputDir = join(projectRoot, "data_export");

mkdirSync(outputDir, { recursive: true });

const DB_URL = process.env.DATABASE_URL;
if (!DB_URL) {
  console.error("ERROR: DATABASE_URL environment variable not set");
  process.exit(1);
}

// Parse MySQL connection URL
const urlMatch = DB_URL.match(
  /mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)/
);
if (!urlMatch) {
  console.error("ERROR: Could not parse DATABASE_URL");
  process.exit(1);
}

const [, user, password, host, port, database] = urlMatch;

const TABLES = [
  "users",
  "phases",
  "works",
  "essays",
  "metaquestions",
  "archive_files",
  "press_clippings",
];

function escapeCSVField(value) {
  if (value === null || value === undefined) return "";
  const str = String(value);
  // Always quote fields that contain commas, newlines, or double quotes
  if (str.includes(",") || str.includes("\n") || str.includes('"') || str.includes("\r")) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

function rowToCSV(row) {
  return Object.values(row).map(escapeCSVField).join(",");
}

async function exportTable(conn, tableName) {
  console.log(`\nExporting ${tableName}...`);

  const [rows] = await conn.query(`SELECT * FROM \`${tableName}\``);

  if (!rows || rows.length === 0) {
    console.log(`  → 0 rows (empty table)`);
    // Write header-only CSV
    const [cols] = await conn.query(
      `SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? ORDER BY ORDINAL_POSITION`,
      [tableName]
    );
    const header = cols.map((c) => c.COLUMN_NAME).join(",");
    const outputPath = join(outputDir, `${tableName}.csv`);
    writeFileSync(outputPath, header + "\n", "utf8");
    return 0;
  }

  const header = Object.keys(rows[0]).join(",");
  const csvLines = [header, ...rows.map(rowToCSV)];
  const csv = csvLines.join("\n") + "\n";

  const outputPath = join(outputDir, `${tableName}.csv`);
  writeFileSync(outputPath, csv, "utf8");

  console.log(`  → ${rows.length} rows → ${outputPath}`);
  return rows.length;
}

async function main() {
  console.log("=== neon-crucible Database CSV Export ===");
  console.log(`Host: ${host}:${port}`);
  console.log(`Database: ${database}`);
  console.log(`Output: ${outputDir}`);
  console.log("");

  const conn = await createConnection({
    host,
    port: parseInt(port),
    user,
    password,
    database,
    ssl: { rejectUnauthorized: false },
    multipleStatements: false,
  });

  const counts = {};
  for (const table of TABLES) {
    try {
      counts[table] = await exportTable(conn, table);
    } catch (err) {
      console.error(`  ERROR exporting ${table}:`, err.message);
      counts[table] = -1;
    }
  }

  await conn.end();

  console.log("\n=== Export Summary ===");
  for (const [table, count] of Object.entries(counts)) {
    const status = count === -1 ? "ERROR" : `${count} rows`;
    console.log(`  ${table.padEnd(20)} ${status}`);
  }

  console.log("\n✓ CSV export complete");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
