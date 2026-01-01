import { eq, desc, asc, and, like, sql, isNotNull } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, 
  phases, InsertPhase, Phase,
  works, InsertWork, Work,
  essays, InsertEssay, Essay,
  metaquestions, InsertMetaquestion, Metaquestion,
  archiveFiles, InsertArchiveFile, ArchiveFile,
  pressClippings, InsertPressClipping, PressClipping
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
  sortBy?: 'phase' | 'date_newest' | 'date_oldest' | 'title' | 'random';
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
  
  // Apply sorting based on sortBy parameter
  if (filter.sortBy === 'date_newest') {
    query = query.orderBy(desc(works.dateCreated), desc(works.createdAt)) as typeof query;
  } else if (filter.sortBy === 'date_oldest') {
    query = query.orderBy(asc(works.dateCreated), asc(works.createdAt)) as typeof query;
  } else if (filter.sortBy === 'title') {
    query = query.orderBy(asc(works.title)) as typeof query;
  } else if (filter.sortBy === 'random') {
    query = query.orderBy(sql`RAND()`) as typeof query;
  } else {
    // Default: sort by phase (newest phase first via sortOrder), then by date
    query = query.orderBy(asc(works.sortOrder), desc(works.dateCreated), desc(works.createdAt)) as typeof query;
  }
  
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

// ============ SEARCH QUERIES ============

export interface SearchResult {
  type: 'work' | 'phase' | 'essay';
  id: number;
  title: string;
  description?: string;
  imageUrl?: string;
  phaseCode?: string;
  emotionalRegister?: string;
  seriesName?: string;
  category?: string;
}

export async function searchArchive(query: string, limit = 20): Promise<SearchResult[]> {
  const db = await getDb();
  if (!db || !query.trim()) return [];

  const searchTerm = `%${query.trim()}%`;
  const results: SearchResult[] = [];

  // Search works (title, technique, series, emotional register)
  const workResults = await db
    .select({
      id: works.id,
      title: works.title,
      imageUrl: works.imageUrl,
      phaseCode: phases.code,
      emotionalRegister: works.emotionalRegister,
      seriesName: works.seriesName,
      technique: works.technique,
    })
    .from(works)
    .leftJoin(phases, eq(works.phaseId, phases.id))
    .where(
      and(
        eq(works.isPublished, true),
        sql`(
          ${works.title} LIKE ${searchTerm} OR
          ${works.technique} LIKE ${searchTerm} OR
          ${works.seriesName} LIKE ${searchTerm} OR
          ${works.emotionalRegister} LIKE ${searchTerm}
        )`
      )
    )
    .limit(limit);

  results.push(
    ...workResults.map(w => ({
      type: 'work' as const,
      id: w.id,
      title: w.title,
      imageUrl: w.imageUrl ?? undefined,
      phaseCode: w.phaseCode ?? undefined,
      emotionalRegister: w.emotionalRegister ?? undefined,
      seriesName: w.seriesName ?? undefined,
      description: w.technique ?? undefined,
    }))
  );

  // Search phases (code, title, description)
  const phaseResults = await db
    .select({
      id: phases.id,
      code: phases.code,
      title: phases.title,
      description: phases.description,
    })
    .from(phases)
    .where(
      sql`(
        ${phases.code} LIKE ${searchTerm} OR
        ${phases.title} LIKE ${searchTerm} OR
        ${phases.description} LIKE ${searchTerm}
      )`
    )
    .limit(10);

  results.push(
    ...phaseResults.map(p => ({
      type: 'phase' as const,
      id: p.id,
      title: `${p.code}: ${p.title}`,
      description: p.description ?? undefined,
      phaseCode: p.code,
    }))
  );

  // Search essays (title, content)
  const essayResults = await db
    .select({
      id: essays.id,
      title: essays.title,
      category: essays.category,
      content: essays.content,
    })
    .from(essays)
    .where(
      and(
        eq(essays.isPublished, true),
        sql`(
          ${essays.title} LIKE ${searchTerm} OR
          ${essays.content} LIKE ${searchTerm}
        )`
      )
    )
    .limit(10);

  results.push(
    ...essayResults.map(e => ({
      type: 'essay' as const,
      id: e.id,
      title: e.title,
      category: e.category ?? undefined,
      description: e.content ? e.content.substring(0, 150) + '...' : undefined,
    }))
  );

  return results.slice(0, limit);
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

// ============ PHASE THUMBNAILS ============

export async function getWorksByPhaseId(phaseId: number, limit: number = 3): Promise<{ id: number; title: string; thumbnailUrl: string | null; imageUrl: string | null }[]> {
  const db = await getDb();
  if (!db) return [];
  const result = await db.select({
    id: works.id,
    title: works.title,
    thumbnailUrl: works.thumbnailUrl,
    imageUrl: works.imageUrl,
  }).from(works)
    .where(and(eq(works.phaseId, phaseId), eq(works.isPublished, true)))
    .orderBy(asc(works.sortOrder), desc(works.createdAt))
    .limit(limit);
  return result;
}


// ============ PRESS CLIPPINGS QUERIES ============

export async function getAllPressClippings(publishedOnly = true): Promise<PressClipping[]> {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(pressClippings);
  if (publishedOnly) {
    query = query.where(eq(pressClippings.isPublished, true)) as typeof query;
  }
  return query.orderBy(asc(pressClippings.sortOrder), desc(pressClippings.createdAt));
}

export async function getPressClippingById(id: number): Promise<PressClipping | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(pressClippings).where(eq(pressClippings.id, id)).limit(1);
  return result[0];
}

export async function createPressClipping(clipping: InsertPressClipping): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(pressClippings).values(clipping);
}

export async function updatePressClipping(id: number, data: Partial<InsertPressClipping>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(pressClippings).set(data).where(eq(pressClippings.id, id));
}

export async function deletePressClipping(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(pressClippings).where(eq(pressClippings.id, id));
}

// ============ SERIES NAMES ============

export async function getDistinctSeriesNames(): Promise<string[]> {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.selectDistinct({ seriesName: works.seriesName })
    .from(works)
    .where(and(
      eq(works.isPublished, true),
      isNotNull(works.seriesName)
    ))
    .orderBy(asc(works.seriesName));
  
  return result.map(r => r.seriesName).filter((s): s is string => s !== null);
}
