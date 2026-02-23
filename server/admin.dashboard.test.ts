import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { appRouter } from "./routers";
import { getDb } from "./db";
import { works, phases } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-admin",
    email: "admin@example.com",
    name: "Test Admin",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return ctx;
}

describe("Admin Dashboard - Complete CRUD", () => {
  let db: Awaited<ReturnType<typeof getDb>>;
  const testWorkIds: number[] = [];
  const testPhaseIds: number[] = [];

  beforeAll(async () => {
    db = await getDb();
  });

  afterAll(async () => {
    // Clean up all test works
    if (db) {
      for (const id of testWorkIds) {
        await db.delete(works).where(eq(works.id, id));
      }
      for (const id of testPhaseIds) {
        await db.delete(phases).where(eq(phases.id, id));
      }
    }
  });

  it("should create a new work with all fields", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    
    const testSlug = "test-complete-work-" + Date.now();
    const workData = {
      title: "Complete Test Work",
      slug: testSlug,
      year: "2025",
      dateCreated: "2025-06-15",
      medium: "Oil on Canvas",
      dimensions: "100cm x 150cm",
      seriesName: "Test Series",
      colorPalette: "Blue, Red, Yellow",
      emotionalRegister: "Contemplative",
      curatorialHook: "Test curatorial hook",
      neonReading: "Test neon reading",
      conceptTags: ["test", "complete"],
      isPublished: true,
    };
    
    const result = await caller.gallery.create(workData);
    expect(result.success).toBe(true);

    // Verify in database
    const createdWork = await db
      .select()
      .from(works)
      .where(eq(works.slug, testSlug))
      .then((rows) => rows[0]);

    expect(createdWork).toBeDefined();
    expect(createdWork.title).toBe(workData.title);
    expect(createdWork.dateCreated).toBe(workData.dateCreated);
    expect(createdWork.seriesName).toBe(workData.seriesName);
    expect(createdWork.colorPalette).toBe(workData.colorPalette);
    
    testWorkIds.push(createdWork.id);
  });

  it("should update work with new series name", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    
    // Create a work first
    const testSlug = "test-series-update-" + Date.now();
    await caller.gallery.create({
      title: "Test Series Update",
      slug: testSlug,
      year: "2025",
      medium: "Test",
      dimensions: "10x10",
      seriesName: "Old Series",
      isPublished: true,
    });

    const work = await db
      .select()
      .from(works)
      .where(eq(works.slug, testSlug))
      .then((rows) => rows[0]);

    testWorkIds.push(work.id);

    // Update with new series name
    const newSeriesName = "Brand New Series " + Date.now();
    await caller.gallery.update({
      id: work.id,
      seriesName: newSeriesName,
    });

    // Verify update
    const updatedWork = await db
      .select()
      .from(works)
      .where(eq(works.id, work.id))
      .then((rows) => rows[0]);

    expect(updatedWork.seriesName).toBe(newSeriesName);
  });

  it("should create a new phase", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    
    const phaseCode = "TST" + (Date.now() % 1000000);
    const phaseData = {
      code: phaseCode,
      title: "Test Phase " + Date.now(),
      year: "2025",
      description: "Test phase description",
      emotionalTemperature: "Test temperature",
      color: "#FF0000",
    };

    const result = await caller.phases.create(phaseData);
    expect(result.success).toBe(true);

    // Verify in database
    const createdPhase = await db
      .select()
      .from(phases)
      .where(eq(phases.code, phaseCode))
      .then((rows) => rows[0]);

    expect(createdPhase).toBeDefined();
    expect(createdPhase.title).toBe(phaseData.title);
    expect(createdPhase.description).toBe(phaseData.description);
    
    testPhaseIds.push(createdPhase.id);
  });

  it("should assign work to newly created phase", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    
    // Create a phase
    const phaseCode = "ASN" + (Date.now() % 1000000);
    await caller.phases.create({
      code: phaseCode,
      title: "Assignment Test Phase",
      year: "2025",
    });

    const phase = await db
      .select()
      .from(phases)
      .where(eq(phases.code, phaseCode))
      .then((rows) => rows[0]);

    testPhaseIds.push(phase.id);

    // Create work assigned to this phase
    const testSlug = "test-phase-assignment-" + Date.now();
    await caller.gallery.create({
      title: "Phase Assignment Test",
      slug: testSlug,
      year: "2025",
      medium: "Test",
      dimensions: "10x10",
      seriesName: "Test",
      phaseId: phase.id,
      isPublished: true,
    });

    const work = await db
      .select()
      .from(works)
      .where(eq(works.slug, testSlug))
      .then((rows) => rows[0]);

    testWorkIds.push(work.id);

    expect(work.phaseId).toBe(phase.id);
  });

  it("should delete a work", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    
    // Create a work to delete
    const testSlug = "test-delete-" + Date.now();
    await caller.gallery.create({
      title: "Test Delete",
      slug: testSlug,
      year: "2025",
      medium: "Test",
      dimensions: "10x10",
      seriesName: "Test",
      isPublished: true,
    });

    const work = await db
      .select()
      .from(works)
      .where(eq(works.slug, testSlug))
      .then((rows) => rows[0]);

    // Delete it
    const result = await caller.gallery.delete({ id: work.id });
    expect(result.success).toBe(true);

    // Verify deletion
    const deletedWork = await db
      .select()
      .from(works)
      .where(eq(works.id, work.id))
      .then((rows) => rows[0]);

    expect(deletedWork).toBeUndefined();
  });
});
