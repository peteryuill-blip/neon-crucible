import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the database module
vi.mock("./db", () => ({
  getAllPhases: vi.fn(),
  getPhaseById: vi.fn(),
  getPhaseByCode: vi.fn(),
  createPhase: vi.fn(),
  updatePhase: vi.fn(),
  deletePhase: vi.fn(),
  getWorks: vi.fn(),
  getWorksCount: vi.fn(),
  getWorkById: vi.fn(),
  createWork: vi.fn(),
  updateWork: vi.fn(),
  deleteWork: vi.fn(),
  getAllEssays: vi.fn(),
  getEssaysByCategory: vi.fn(),
  getEssayBySlug: vi.fn(),
  getEssayById: vi.fn(),
  createEssay: vi.fn(),
  updateEssay: vi.fn(),
  deleteEssay: vi.fn(),
  getAllMetaquestions: vi.fn(),
  createMetaquestion: vi.fn(),
  updateMetaquestion: vi.fn(),
  deleteMetaquestion: vi.fn(),
  getAllArchiveFiles: vi.fn(),
  getArchiveFileById: vi.fn(),
  createArchiveFile: vi.fn(),
  updateArchiveFile: vi.fn(),
  deleteArchiveFile: vi.fn(),
}));

import * as db from "./db";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createUserContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "regular-user",
    email: "user@example.com",
    name: "Regular User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("phases router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lists phases publicly", async () => {
    const mockPhases = [
      { id: 1, code: "PH1", title: "Phase 1", year: "2018", sortOrder: 1 },
      { id: 2, code: "PH2", title: "Phase 2", year: "2019", sortOrder: 2 },
    ];
    vi.mocked(db.getAllPhases).mockResolvedValue(mockPhases as any);

    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.phases.list();

    expect(result).toEqual(mockPhases);
    expect(db.getAllPhases).toHaveBeenCalledOnce();
  });

  it("gets phase by id publicly", async () => {
    const mockPhase = { id: 1, code: "PH1", title: "Phase 1", year: "2018" };
    vi.mocked(db.getPhaseById).mockResolvedValue(mockPhase as any);

    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.phases.getById({ id: 1 });

    expect(result).toEqual(mockPhase);
    expect(db.getPhaseById).toHaveBeenCalledWith(1);
  });

  it("allows admin to create phase", async () => {
    vi.mocked(db.createPhase).mockResolvedValue(undefined);

    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.phases.create({
      code: "PH1",
      title: "Phase 1",
      year: "2018",
    });

    expect(result).toEqual({ success: true });
    expect(db.createPhase).toHaveBeenCalledWith({
      code: "PH1",
      title: "Phase 1",
      year: "2018",
    });
  });

  it("denies non-admin from creating phase", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.phases.create({
        code: "PH1",
        title: "Phase 1",
        year: "2018",
      })
    ).rejects.toThrow("Admin access required");
  });
});

describe("works router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lists works with pagination", async () => {
    const mockWorks = [
      { id: 1, title: "Work 1", phaseId: 1 },
      { id: 2, title: "Work 2", phaseId: 1 },
    ];
    vi.mocked(db.getWorks).mockResolvedValue(mockWorks as any);
    vi.mocked(db.getWorksCount).mockResolvedValue(50);

    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.works.list({ limit: 12, offset: 0 });

    expect(result.items).toEqual(mockWorks);
    expect(result.total).toBe(50);
    expect(result.limit).toBe(12);
    expect(result.offset).toBe(0);
  });

  it("filters works by phase", async () => {
    vi.mocked(db.getWorks).mockResolvedValue([]);
    vi.mocked(db.getWorksCount).mockResolvedValue(0);

    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await caller.works.list({ phaseId: 1, limit: 12, offset: 0 });

    expect(db.getWorks).toHaveBeenCalledWith(
      expect.objectContaining({ phaseId: 1, isPublished: true })
    );
  });

  it("allows admin to create work", async () => {
    vi.mocked(db.createWork).mockResolvedValue(undefined);

    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.works.create({
      title: "New Work",
      technique: "Ink on Paper",
    });

    expect(result).toEqual({ success: true });
    expect(db.createWork).toHaveBeenCalledWith({
      title: "New Work",
      technique: "Ink on Paper",
    });
  });
});

describe("essays router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lists all essays publicly", async () => {
    const mockEssays = [
      { id: 1, title: "Essay 1", slug: "essay-1" },
      { id: 2, title: "Essay 2", slug: "essay-2" },
    ];
    vi.mocked(db.getAllEssays).mockResolvedValue(mockEssays as any);

    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.essays.list();

    expect(result).toEqual(mockEssays);
    expect(db.getAllEssays).toHaveBeenCalledWith(true);
  });

  it("filters essays by category", async () => {
    const mockEssays = [{ id: 1, title: "Core Essay", category: "core_reading" }];
    vi.mocked(db.getEssaysByCategory).mockResolvedValue(mockEssays as any);

    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.essays.list({ category: "core_reading" });

    expect(result).toEqual(mockEssays);
    expect(db.getEssaysByCategory).toHaveBeenCalledWith("core_reading");
  });

  it("gets essay by slug", async () => {
    const mockEssay = { id: 1, title: "Essay 1", slug: "essay-1", content: "Content" };
    vi.mocked(db.getEssayBySlug).mockResolvedValue(mockEssay as any);

    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.essays.getBySlug({ slug: "essay-1" });

    expect(result).toEqual(mockEssay);
    expect(db.getEssayBySlug).toHaveBeenCalledWith("essay-1");
  });
});

describe("metaquestions router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lists metaquestions publicly", async () => {
    const mockMQs = [
      { id: 1, question: "Question 1?", isAnswered: false },
      { id: 2, question: "Question 2?", isAnswered: true, answer: "Answer" },
    ];
    vi.mocked(db.getAllMetaquestions).mockResolvedValue(mockMQs as any);

    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.metaquestions.list();

    expect(result).toEqual(mockMQs);
    expect(db.getAllMetaquestions).toHaveBeenCalledOnce();
  });

  it("allows admin to create metaquestion", async () => {
    vi.mocked(db.createMetaquestion).mockResolvedValue(undefined);

    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.metaquestions.create({
      question: "New question?",
    });

    expect(result).toEqual({ success: true });
    expect(db.createMetaquestion).toHaveBeenCalledWith({
      question: "New question?",
      isAnswerPrivate: true,
    });
  });
});

describe("archiveFiles router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lists archive files publicly", async () => {
    const mockFiles = [
      { id: 1, filename: "file1.txt", fileType: "TXT" },
      { id: 2, filename: "file2.pdf", fileType: "PDF" },
    ];
    vi.mocked(db.getAllArchiveFiles).mockResolvedValue(mockFiles as any);

    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.archiveFiles.list();

    expect(result).toEqual(mockFiles);
    expect(db.getAllArchiveFiles).toHaveBeenCalledWith(true);
  });

  it("allows admin to create archive file", async () => {
    vi.mocked(db.createArchiveFile).mockResolvedValue(undefined);

    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.archiveFiles.create({
      filename: "new-file.txt",
      fileType: "TXT",
      fileSize: "10KB",
    });

    expect(result).toEqual({ success: true });
    expect(db.createArchiveFile).toHaveBeenCalledWith({
      filename: "new-file.txt",
      fileType: "TXT",
      fileSize: "10KB",
    });
  });
});
