import { eq, desc, asc, and, like, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, 
  phases, InsertPhase, Phase,
  works, InsertWork, Work,
  essays, InsertEssay, Essay,
  metaquestions, InsertMetaquestion, Metaquestion,
  archiveFiles, InsertArchiveFile, ArchiveFile
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============ USER QUERIES ============

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ PHASES QUERIES ============

export async function getAllPhases(): Promise<Phase[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(phases).orderBy(asc(phases.sortOrder));
}

export async function getPhaseById(id: number): Promise<Phase | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(phases).where(eq(phases.id, id)).limit(1);
  return result[0];
}

export async function getPhaseByCode(code: string): Promise<Phase | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(phases).where(eq(phases.code, code)).limit(1);
  return result[0];
}

export async function createPhase(phase: InsertPhase): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(phases).values(phase);
}

export async function updatePhase(id: number, data: Partial<InsertPhase>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(phases).set(data).where(eq(phases.id, id));
}

export async function deletePhase(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(phases).where(eq(phases.id, id));
}

// ============ WORKS QUERIES ============

export interface WorksFilter {
  phaseId?: number;
  technique?: string;
  emotionalRegister?: string;
  seriesName?: string;
  search?: string;
  isPublished?: boolean;
  limit?: number;
  offset?: number;
}

export async function getWorks(filter: WorksFilter = {}): Promise<Work[]> {
  const db = await getDb();
  if (!db) return [];

  const conditions = [];
  
  if (filter.phaseId !== undefined) {
    conditions.push(eq(works.phaseId, filter.phaseId));
  }
  if (filter.technique) {
    conditions.push(eq(works.technique, filter.technique));
  }
  if (filter.emotionalRegister) {
    conditions.push(eq(works.emotionalRegister, filter.emotionalRegister));
  }
  if (filter.seriesName) {
    conditions.push(eq(works.seriesName, filter.seriesName));
  }
  if (filter.isPublished !== undefined) {
    conditions.push(eq(works.isPublished, filter.isPublished));
  }
  if (filter.search) {
    conditions.push(like(works.title, `%${filter.search}%`));
  }

  let query = db.select().from(works);
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as typeof query;
  }
  
  query = query.orderBy(asc(works.sortOrder), desc(works.createdAt)) as typeof query;
  
  if (filter.limit) {
    query = query.limit(filter.limit) as typeof query;
  }
  if (filter.offset) {
    query = query.offset(filter.offset) as typeof query;
  }

  return query;
}

export async function getWorksCount(filter: WorksFilter = {}): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  const conditions = [];
  
  if (filter.phaseId !== undefined) {
    conditions.push(eq(works.phaseId, filter.phaseId));
  }
  if (filter.isPublished !== undefined) {
    conditions.push(eq(works.isPublished, filter.isPublished));
  }
  if (filter.search) {
    conditions.push(like(works.title, `%${filter.search}%`));
  }

  let query = db.select({ count: sql<number>`count(*)` }).from(works);
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as typeof query;
  }

  const result = await query;
  return result[0]?.count ?? 0;
}

export async function getWorkById(id: number): Promise<Work | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(works).where(eq(works.id, id)).limit(1);
  return result[0];
}

export async function createWork(work: InsertWork): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(works).values(work);
}

export async function updateWork(id: number, data: Partial<InsertWork>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(works).set(data).where(eq(works.id, id));
}

export async function deleteWork(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(works).where(eq(works.id, id));
}

// ============ ESSAYS QUERIES ============

export async function getAllEssays(publishedOnly = true): Promise<Essay[]> {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(essays);
  if (publishedOnly) {
    query = query.where(eq(essays.isPublished, true)) as typeof query;
  }
  return query.orderBy(asc(essays.sortOrder));
}

export async function getEssaysByCategory(category: string): Promise<Essay[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(essays)
    .where(and(eq(essays.category, category), eq(essays.isPublished, true)))
    .orderBy(asc(essays.sortOrder));
}

export async function getEssayBySlug(slug: string): Promise<Essay | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(essays).where(eq(essays.slug, slug)).limit(1);
  return result[0];
}

export async function getEssayById(id: number): Promise<Essay | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(essays).where(eq(essays.id, id)).limit(1);
  return result[0];
}

export async function createEssay(essay: InsertEssay): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(essays).values(essay);
}

export async function updateEssay(id: number, data: Partial<InsertEssay>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(essays).set(data).where(eq(essays.id, id));
}

export async function deleteEssay(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(essays).where(eq(essays.id, id));
}

// ============ METAQUESTIONS QUERIES ============

export async function getAllMetaquestions(): Promise<Metaquestion[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(metaquestions).orderBy(asc(metaquestions.sortOrder));
}

export async function createMetaquestion(mq: InsertMetaquestion): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(metaquestions).values(mq);
}

export async function updateMetaquestion(id: number, data: Partial<InsertMetaquestion>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(metaquestions).set(data).where(eq(metaquestions.id, id));
}

export async function deleteMetaquestion(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(metaquestions).where(eq(metaquestions.id, id));
}

// ============ ARCHIVE FILES QUERIES ============

export async function getAllArchiveFiles(publishedOnly = true): Promise<ArchiveFile[]> {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(archiveFiles);
  if (publishedOnly) {
    query = query.where(eq(archiveFiles.isPublished, true)) as typeof query;
  }
  return query.orderBy(asc(archiveFiles.sortOrder), desc(archiveFiles.createdAt));
}

export async function getArchiveFileById(id: number): Promise<ArchiveFile | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(archiveFiles).where(eq(archiveFiles.id, id)).limit(1);
  return result[0];
}

export async function createArchiveFile(file: InsertArchiveFile): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(archiveFiles).values(file);
}

export async function updateArchiveFile(id: number, data: Partial<InsertArchiveFile>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(archiveFiles).set(data).where(eq(archiveFiles.id, id));
}

export async function deleteArchiveFile(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(archiveFiles).where(eq(archiveFiles.id, id));
}
