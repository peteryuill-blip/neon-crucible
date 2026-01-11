import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/trpc";

// Mock context for testing
const createMockContext = (): TrpcContext => ({
  user: null,
  req: {} as any,
  res: {} as any,
});

describe("Contact Router", () => {
  it("should accept valid contact form submission", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contact.submit({
      name: "John Collector",
      email: "john@example.com",
      projectType: "commission",
      message: "I'm interested in commissioning a large-format work for my office lobby."
    });

    expect(result.success).toBe(true);
    expect(result.message).toContain("sent successfully");
  });

  it("should reject submission with invalid email", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.contact.submit({
        name: "John Collector",
        email: "invalid-email",
        projectType: "commission",
        message: "Test message"
      })
    ).rejects.toThrow();
  });

  it("should reject submission with empty name", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.contact.submit({
        name: "",
        email: "john@example.com",
        projectType: "commission",
        message: "Test message"
      })
    ).rejects.toThrow();
  });

  it("should reject submission with short message", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.contact.submit({
        name: "John Collector",
        email: "john@example.com",
        projectType: "commission",
        message: "Short"
      })
    ).rejects.toThrow();
  });

  it("should accept submission without project type", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contact.submit({
      name: "Jane Curator",
      email: "jane@gallery.com",
      message: "I'd like to discuss a potential exhibition opportunity."
    });

    expect(result.success).toBe(true);
  });

  it("should handle various project types", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const projectTypes = ["commission", "collector", "exhibition", "press", "collaboration", "general"];

    for (const type of projectTypes) {
      const result = await caller.contact.submit({
        name: "Test User",
        email: "test@example.com",
        projectType: type,
        message: `Testing ${type} inquiry type with sufficient message length.`
      });

      expect(result.success).toBe(true);
    }
  });
});
