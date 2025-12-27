import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

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
 * Artworks in the archive (500+ works)
 */
export const works = mysqlTable("works", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  phaseId: int("phaseId").references(() => phases.id),
  dateCreated: varchar("dateCreated", { length: 32 }), // e.g., "2021-03", "2021"
  technique: varchar("technique", { length: 128 }), // e.g., "Ink on Paper", "Mixed Media"
  dimensions: varchar("dimensions", { length: 64 }), // e.g., "120x80cm"
  colorPalette: varchar("colorPalette", { length: 128 }), // Dominant colors
  emotionalRegister: varchar("emotionalRegister", { length: 64 }), // e.g., "gentle", "brutal"
  imageUrl: text("imageUrl"), // S3 URL for the work image
  imageKey: varchar("imageKey", { length: 512 }), // S3 key for reference
  thumbnailUrl: text("thumbnailUrl"), // Smaller version
  journalExcerpt: text("journalExcerpt"), // Quote from artist's journal
  neonReading: text("neonReading"), // Neon's curatorial interpretation
  seriesName: varchar("seriesName", { length: 128 }), // e.g., "Covenant triptych", "Big Bang"
  isPublished: boolean("isPublished").default(true).notNull(),
  sortOrder: int("sortOrder").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
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
