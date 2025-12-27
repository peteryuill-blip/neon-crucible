import { describe, it, expect } from "vitest";
import * as db from "./db";

describe("Admin Panel Database Operations", () => {
  describe("Phases CRUD", () => {
    it("should list all phases", async () => {
      const phases = await db.getAllPhases();
      expect(Array.isArray(phases)).toBe(true);
      expect(phases.length).toBeGreaterThan(0);
    });

    it("should get a phase by id", async () => {
      const phases = await db.getAllPhases();
      if (phases.length > 0) {
        const phase = await db.getPhaseById(phases[0].id);
        expect(phase).toBeDefined();
        expect(phase?.id).toBe(phases[0].id);
      }
    });

    it("should get a phase by code", async () => {
      const phases = await db.getAllPhases();
      if (phases.length > 0) {
        const phase = await db.getPhaseByCode(phases[0].code);
        expect(phase).toBeDefined();
        expect(phase?.code).toBe(phases[0].code);
      }
    });
  });

  describe("Works CRUD", () => {
    it("should list all works", async () => {
      const works = await db.getWorks();
      expect(Array.isArray(works)).toBe(true);
    });

    it("should list published works only", async () => {
      const works = await db.getWorks({ isPublished: true });
      expect(Array.isArray(works)).toBe(true);
      works.forEach((work) => {
        expect(work.isPublished).toBe(true);
      });
    });

    it("should get works count", async () => {
      const count = await db.getWorksCount();
      expect(typeof count).toBe("number");
      expect(count).toBeGreaterThanOrEqual(0);
    });

    it("should get a work by id", async () => {
      const works = await db.getWorks();
      if (works.length > 0) {
        const work = await db.getWorkById(works[0].id);
        expect(work).toBeDefined();
        expect(work?.id).toBe(works[0].id);
      }
    });

    it("should filter works by phase", async () => {
      const phases = await db.getAllPhases();
      if (phases.length > 0) {
        const works = await db.getWorks({ phaseId: phases[0].id });
        expect(Array.isArray(works)).toBe(true);
        works.forEach((work) => {
          expect(work.phaseId).toBe(phases[0].id);
        });
      }
    });
  });

  describe("Essays CRUD", () => {
    it("should list all essays", async () => {
      const essays = await db.getAllEssays(false);
      expect(Array.isArray(essays)).toBe(true);
    });

    it("should list published essays only", async () => {
      const essays = await db.getAllEssays(true);
      expect(Array.isArray(essays)).toBe(true);
      essays.forEach((essay) => {
        expect(essay.isPublished).toBe(true);
      });
    });

    it("should get an essay by slug", async () => {
      const essays = await db.getAllEssays(false);
      if (essays.length > 0 && essays[0].slug) {
        const essay = await db.getEssayBySlug(essays[0].slug);
        expect(essay).toBeDefined();
        expect(essay?.slug).toBe(essays[0].slug);
      }
    });

    it("should get an essay by id", async () => {
      const essays = await db.getAllEssays(false);
      if (essays.length > 0) {
        const essay = await db.getEssayById(essays[0].id);
        expect(essay).toBeDefined();
        expect(essay?.id).toBe(essays[0].id);
      }
    });

    it("should get essays by category", async () => {
      const essays = await db.getEssaysByCategory("core_reading");
      expect(Array.isArray(essays)).toBe(true);
      essays.forEach((essay) => {
        expect(essay.category).toBe("core_reading");
      });
    });
  });

  describe("Metaquestions CRUD", () => {
    it("should list all metaquestions", async () => {
      const metaquestions = await db.getAllMetaquestions();
      expect(Array.isArray(metaquestions)).toBe(true);
    });
  });

  describe("Archive Files CRUD", () => {
    it("should list all archive files", async () => {
      const files = await db.getAllArchiveFiles(false);
      expect(Array.isArray(files)).toBe(true);
    });

    it("should list published archive files only", async () => {
      const files = await db.getAllArchiveFiles(true);
      expect(Array.isArray(files)).toBe(true);
      files.forEach((file) => {
        expect(file.isPublished).toBe(true);
      });
    });

    it("should get an archive file by id", async () => {
      const files = await db.getAllArchiveFiles(false);
      if (files.length > 0) {
        const file = await db.getArchiveFileById(files[0].id);
        expect(file).toBeDefined();
        expect(file?.id).toBe(files[0].id);
      }
    });
  });
});
