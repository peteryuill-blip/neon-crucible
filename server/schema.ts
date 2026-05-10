import {
  mysqlTable,
  serial,
  varchar,
  text,
  int,
  timestamp,
} from "drizzle-orm/mysql-core";

// ─── Works Table (The Archive) ───────────────────────────────────
export const works = mysqlTable("works", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  tCode: varchar("t_code", { length: 16 }).notNull(),
  sovereignId: varchar("sovereign_id", { length: 32 }).notNull(),
  phaseId: int("phase_id").notNull(),
  medium: text("medium"),
  dimensions: varchar("dimensions", { length: 128 }),
  rating: int("rating").default(0).notNull(),
  disposition: varchar("disposition", { length: 2 }).default("UN").notNull(),
  technicalObservation: text("technical_observation"),
  weekNumber: int("week_number"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ─── Users Table (Oracle Identity) ───────────────────────────────
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("open_id", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }),
  name: varchar("name", { length: 255 }),
  avatar: varchar("avatar", { length: 512 }),
  role: varchar("role", { length: 16 }).default("viewer").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  lastLoginAt: timestamp("last_login_at").defaultNow(),
});

// ─── Types ───────────────────────────────────────────────────────
export type Work = typeof works.$inferSelect;
export type NewWork = typeof works.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
