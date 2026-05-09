import { mysqlTable, serial, varchar, text, int, boolean, json } from "drizzle-orm/mysql-2";

export const phases = mysqlTable("phases", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 16 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
});

export const works = mysqlTable("works", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  tCode: varchar("t_code", { length: 16 }),
  sovereignId: varchar("sovereign_id", { length: 32 }),
  phaseId: int("phase_id"),
  medium: text("medium"),
  dimensions: varchar("dimensions", { length: 128 }),
  surfaceName: varchar("surface_name", { length: 128 }),
  rating: int("rating").default(0),
  disposition: varchar("disposition", { length: 2 }).default("UN"),
  technicalObservation: text("technical_observation"), // This stores your JSON Oracle data
  weekNumber: int("week_number"),
});
