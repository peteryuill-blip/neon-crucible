import { int, json, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Phases of the 7-year artistic practice (PH1, PH1A, PH2, etc.)
 */
export const phases = mysqlTable("phases", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 16 }).notNull().unique(), // e.g., "PH1", "PH1A", "PH2"
  title: varchar("title", { length: 255 }).notNull(),
  year: varchar("year", { length: 16 }).notNull(), // e.g., "2018", "2019-2020"
  description: text("description"),
  emotionalTemperature: text("emotionalTemperature"), // e.g., "intense", "meditative"
  color: varchar("color", { length: 32 }), // Canonical phase color
  sortOrder: int("sortOrder").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Phase = typeof phases.$inferSelect;
export type InsertPhase = typeof phases.$inferInsert;

/**
 * Artworks in the archive (152+ works)
 */
export const works = mysqlTable("works", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).unique(), // URL-friendly identifier for /works/[slug]
  phaseId: int("phaseId").references(() => phases.id),
  dateCreated: varchar("dateCreated", { length: 32 }), // e.g., "2021-03", "2021"
  medium: varchar("medium", { length: 255 }), // Full medium description (renamed from technique)
  technique: varchar("technique", { length: 128 }), // Legacy field, kept for compatibility
  dimensions: varchar("dimensions", { length: 128 }), // e.g., "100cm x 200cm"
  year: varchar("year", { length: 16 }), // Creation year e.g., "2025"
  colorPalette: varchar("colorPalette", { length: 128 }), // Dominant colors
  emotionalRegister: varchar("emotionalRegister", { length: 64 }), // e.g., "gentle", "brutal"
  imageUrl: text("imageUrl"), // S3 URL for the work image
  imageKey: varchar("imageKey", { length: 512 }), // S3 key for reference
  thumbnailUrl: text("thumbnailUrl"), // Smaller version
  journalExcerpt: text("journalExcerpt"), // Quote from artist's journal
  neonReading: text("neonReading"), // Neon's curatorial interpretation (enriched)
  curatorialHook: text("curatorialHook"), // Secondary curatorial context
  conceptTags: json("conceptTags").$type<string[]>(), // Array of concept tags
  seriesName: varchar("seriesName", { length: 128 }), // e.g., "Covenant", "Big Bang"
  featured: boolean("featured").default(false).notNull(), // Manually curated featured/selected works
  isPublished: boolean("isPublished").default(true).notNull(),
  sortOrder: int("sortOrder").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  // Crucible Year columns — added to live DB via scripts/01_migration.sql
  tCode: varchar("tCode", { length: 16 }),
  sovereignId: varchar("sovereignId", { length: 16 }),
  surface: varchar("surface", { length: 16 }),
  surfaceName: varchar("surfaceName", { length: 128 }),
  ink: varchar("ink", { length: 255 }),
  hours: decimal("hours", { precision: 4, scale: 1 }),
  disposition: varchar("disposition", { length: 8 }),
  rating: int("rating"),
  weekNumber: int("weekNumber"),
  orientation: varchar("orientation", { length: 16 }),
  technicalObservation: text("technicalObservation"),
  discoveryNote: text("discoveryNote"),
});

export type Work = typeof works.$inferSelect;
export type InsertWork = typeof works.$inferInsert;

/**
 * Neon's essays and long-form writings
 */
export const essays = mysqlTable("essays", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  description: text("description"), // Short summary
  content: text("content"), // Full essay content (markdown)
  category: varchar("category", { length: 64 }), // e.g., "core_reading", "phase_overview"
  phaseId: int("phaseId").references(() => phases.id), // For phase-specific essays
  isPublished: boolean("isPublished").default(true).notNull(),
  sortOrder: int("sortOrder").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Essay = typeof essays.$inferSelect;
export type InsertEssay = typeof essays.$inferInsert;

/**
 * Metaquestions - open questions Neon is holding about the practice
 */
export const metaquestions = mysqlTable("metaquestions", {
  id: int("id").autoincrement().primaryKey(),
  question: text("question").notNull(),
  answer: text("answer"), // Optional - some questions remain open
  isAnswered: boolean("isAnswered").default(false).notNull(),
  isAnswerPrivate: boolean("isAnswerPrivate").default(true).notNull(), // Answers are private by default
  sortOrder: int("sortOrder").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Metaquestion = typeof metaquestions.$inferSelect;
export type InsertMetaquestion = typeof metaquestions.$inferInsert;

/**
 * Archive files - technical documents and primary sources
 */
export const archiveFiles = mysqlTable("archive_files", {
  id: int("id").autoincrement().primaryKey(),
  filename: varchar("filename", { length: 255 }).notNull(),
  fileType: varchar("fileType", { length: 16 }), // e.g., "TXT", "PDF"
  fileSize: varchar("fileSize", { length: 32 }), // e.g., "24KB", "4.2MB"
  fileUrl: text("fileUrl"), // S3 URL
  fileKey: varchar("fileKey", { length: 512 }), // S3 key
  description: text("description"),
  category: varchar("category", { length: 64 }), // e.g., "protocol", "source", "technical"
  isPublished: boolean("isPublished").default(true).notNull(),
  sortOrder: int("sortOrder").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ArchiveFile = typeof archiveFiles.$inferSelect;
export type InsertArchiveFile = typeof archiveFiles.$inferInsert;


/**
 * Press clippings and external voices - collected writings about the work
 * Presented tastefully without braggadocio
 */
export const pressClippings = mysqlTable("press_clippings", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(), // Article/review title
  source: varchar("source", { length: 128 }).notNull(), // Publication name
  author: varchar("author", { length: 128 }), // Writer's name
  date: varchar("date", { length: 32 }), // Publication date
  excerpt: text("excerpt"), // Key quote or excerpt
  fullText: text("fullText"), // Full article if available
  url: text("url"), // Link to original
  imageUrl: text("imageUrl"), // Screenshot or publication logo
  phaseId: int("phaseId").references(() => phases.id), // Related phase if applicable
  category: varchar("category", { length: 64 }), // e.g., "review", "interview", "feature", "mention"
  isPublished: boolean("isPublished").default(true).notNull(),
  sortOrder: int("sortOrder").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PressClipping = typeof pressClippings.$inferSelect;
export type InsertPressClipping = typeof pressClippings.$inferInsert;
