import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { appRouter } from "./routers";
import { getDb } from "./db";
import { works } from "../drizzle/schema";
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

describe("Work Update", () => {
  let db: Awaited<ReturnType<typeof getDb>>;
  let testWorkId: number | null = null;

  beforeAll(async () => {
    db = await getDb();
    
    // Create a test work
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    
    const testSlug = "test-work-update-" + Date.now();
    await caller.gallery.create({
      title: "Test Work for Update",
      slug: testSlug,
      year: "2025",
      medium: "Test Medium",
      dimensions: "10cm x 10cm",
      seriesName: "Test Series",
      isPublished: true,
    });
    
    // Get the created work ID
    const testWork = await db
      .select()
      .from(works)
      .where(eq(works.slug, testSlug))
      .then((rows) => rows[0]);
    
    if (testWork) {
      testWorkId = testWork.id;
    }
  });

  afterAll(async () => {
    // Clean up test work if it was created
    if (testWorkId && db) {
      await db.delete(works).where(eq(works.id, testWorkId));
    }
  });

  it("should update work title", async () => {
    if (!testWorkId) throw new Error("Test work not created");
    
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    
    const newTitle = "Updated Test Work " + Date.now();
    const result = await caller.gallery.update({
      id: testWorkId,
      title: newTitle,
    });

    expect(result.success).toBe(true);

    // Verify the update in database
    const updatedWork = await db
      .select()
      .from(works)
      .where(eq(works.id, testWorkId))
      .then((rows) => rows[0]);

    expect(updatedWork).toBeDefined();
    expect(updatedWork.title).toBe(newTitle);
  });

  it("should update work dateCreated field", async () => {
    if (!testWorkId) throw new Error("Test work not created");
    
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    
    const newDate = "2025-06-15";
    const result = await caller.gallery.update({
      id: testWorkId,
      dateCreated: newDate,
    });

    expect(result.success).toBe(true);

    // Verify the update in database
    const updatedWork = await db
      .select()
      .from(works)
      .where(eq(works.id, testWorkId))
      .then((rows) => rows[0]);

    expect(updatedWork).toBeDefined();
    expect(updatedWork.dateCreated).toBe(newDate);
  });

  it("should update multiple fields at once", async () => {
    if (!testWorkId) throw new Error("Test work not created");
    
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    
    const updates = {
      id: testWorkId,
      title: "Multi-field Update Test",
      year: "2026",
      dateCreated: "2026-03-20",
      medium: "Updated Medium",
      dimensions: "20cm x 30cm",
      colorPalette: "Red, Blue, Green",
    };
    
    const result = await caller.gallery.update(updates);

    expect(result.success).toBe(true);

    // Verify all updates in database
    const updatedWork = await db
      .select()
      .from(works)
      .where(eq(works.id, testWorkId))
      .then((rows) => rows[0]);

    expect(updatedWork).toBeDefined();
    expect(updatedWork.title).toBe(updates.title);
    expect(updatedWork.year).toBe(updates.year);
    expect(updatedWork.dateCreated).toBe(updates.dateCreated);
    expect(updatedWork.medium).toBe(updates.medium);
    expect(updatedWork.dimensions).toBe(updates.dimensions);
    expect(updatedWork.colorPalette).toBe(updates.colorPalette);
  });
});
