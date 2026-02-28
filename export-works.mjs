import { drizzle } from "drizzle-orm/mysql2";
import { works } from "./drizzle/schema.ts";
import { writeFileSync } from "fs";

const db = drizzle(process.env.DATABASE_URL);

const allWorks = await db.select().from(works);

// Define CSV headers
const headers = [
  "id", "title", "slug", "year", "dateCreated", "phaseId", 
  "seriesName", "medium", "technique", "emotionalRegister",
  "dimensions", "location", "neonReading", "conceptTags",
  "imageUrl", "thumbnailUrl", "isPublished", "featured",
  "sortOrder", "createdAt", "updatedAt"
];

// Convert to CSV
const csvRows = [headers.join(",")];

for (const work of allWorks) {
  const row = headers.map(header => {
    let value = work[header];
    
    // Handle null/undefined
    if (value === null || value === undefined) {
      return "";
    }
    
    // Handle dates
    if (value instanceof Date) {
      value = value.toISOString();
    }
    
    // Handle arrays/objects
    if (typeof value === "object") {
      value = JSON.stringify(value);
    }
    
    // Convert to string and escape quotes
    value = String(value).replace(/"/g, '""');
    
    // Wrap in quotes if contains comma, newline, or quote
    if (value.includes(",") || value.includes("\n") || value.includes('"')) {
      return `"${value}"`;
    }
    
    return value;
  });
  
  csvRows.push(row.join(","));
}

const csv = csvRows.join("\n");
writeFileSync("/home/ubuntu/neon-crucible-works.csv", csv, "utf-8");

console.log(`Exported ${allWorks.length} works to /home/ubuntu/neon-crucible-works.csv`);
