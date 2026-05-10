import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { eq } from "drizzle-orm";
import * as schema from "./schema";

const connection = mysql.createPool({
  uri: process.env.DATABASE_URL,
  connectionLimit: 10,
});

export const db = drizzle(connection, { schema, mode: "default" });
export const getDb = () => db;

export async function getUserByOpenId(openId: string) {
  const result = await db.select().from(schema.users).where(eq(schema.users.openId, openId)).limit(1);
  return result[0] ?? null;
}

export async function upsertUser(user: {
  openId: string;
  email?: string;
  name?: string;
  avatar?: string;
}) {
  const existing = await getUserByOpenId(user.openId);
  if (existing) {
    await db.update(schema.users).set({
      email: user.email ?? existing.email,
      name: user.name ?? existing.name,
      avatar: user.avatar ?? existing.avatar,
      lastLoginAt: new Date(),
    }).where(eq(schema.users.id, existing.id));
    return { ...existing, ...user };
  }
  await db.insert(schema.users).values({
    openId: user.openId,
    email: user.email ?? null,
    name: user.name ?? null,
    avatar: user.avatar ?? null,
    role: "viewer",
    createdAt: new Date(),
    lastLoginAt: new Date(),
  });
  return getUserByOpenId(user.openId);
}

export async function setUserRole(userId: number, role: "admin" | "editor" | "viewer") {
  await db.update(schema.users).set({ role }).where(eq(schema.users.id, userId));
  const result = await db.select().from(schema.users).where(eq(schema.users.id, userId)).limit(1);
  return result[0];
}
