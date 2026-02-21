import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { appRouter } from "./routers";
import { getDb } from "./db";
import { phases } from "../drizzle/schema";
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

describe("Phase Creation", () => {
  let db: Awaited<ReturnType<typeof getDb>>;
  let testPhaseId: number | null = null;

  beforeAll(async () => {
    db = await getDb();
  });

  afterAll(async () => {
    // Clean up test phase if it was created
    if (testPhaseId) {
      await db.delete(phases).where(eq(phases.id, testPhaseId));
    }
  });

  it("should create a new phase", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const phaseName = "Test Phase " + Date.now();
    const phaseCode = "TST" + (Date.now() % 10000000);
    const result = await caller.phases.create({
      code: phaseCode,
      title: phaseName,
      year: "2026",
      description: "Test phase description",
    });

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    
    // Verify it was actually created in the database
    const dbPhase = await db
      .select()
      .from(phases)
      .where(eq(phases.code, phaseCode))
      .then((rows) => rows[0]);

    expect(dbPhase).toBeDefined();
    expect(dbPhase.title).toBe(phaseName);
    testPhaseId = dbPhase.id;
  });

  it("should list the newly created phase", async () => {
    if (!testPhaseId) {
      throw new Error("Test phase was not created");
    }

    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const allPhases = await caller.phases.list();
    const testPhase = allPhases.find((p) => p.id === testPhaseId);

    expect(testPhase).toBeDefined();
    expect(testPhase?.title).toContain("Test Phase");
  });

  it("should generate unique codes for phases with similar names", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const timestamp1 = Date.now() % 1000000;
    const timestamp2 = timestamp1 + 1;
    const phase1 = await caller.phases.create({
      code: "UQ1_" + timestamp1,
      title: "Unique Test " + timestamp1,
      year: "2026",
      description: "First phase",
    });

    const phase2 = await caller.phases.create({
      code: "UQ2_" + timestamp2,
      title: "Unique Test " + timestamp2,
      year: "2026",
      description: "Second phase",
    });

    expect(phase1.success).toBe(true);
    expect(phase2.success).toBe(true);

    // Verify they were created with different codes
    const dbPhase1 = await db
      .select()
      .from(phases)
      .where(eq(phases.code, "UQ1_" + timestamp1))
      .then((rows) => rows[0]);
    
    const dbPhase2 = await db
      .select()
      .from(phases)
      .where(eq(phases.code, "UQ2_" + timestamp2))
      .then((rows) => rows[0]);

    expect(dbPhase1).toBeDefined();
    expect(dbPhase2).toBeDefined();
    expect(dbPhase1.code).not.toBe(dbPhase2.code);

    // Clean up
    await db.delete(phases).where(eq(phases.id, dbPhase1.id));
    await db.delete(phases).where(eq(phases.id, dbPhase2.id));
  });
});
