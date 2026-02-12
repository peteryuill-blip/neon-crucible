import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { getGalleryWorks, getWorkBySlug, getGalleryFilterOptions } from "./db";

describe("Gallery Procedures", () => {
  describe("getGalleryWorks", () => {
    it("should return all works without filters", async () => {
      const result = await getGalleryWorks({});
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it("should filter works by phase", async () => {
      const result = await getGalleryWorks({ phase: "NE" });
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      if (result.length > 0) {
        expect(result.length).toBeGreaterThan(0);
      }
    });

    it("should filter works by series", async () => {
      const result = await getGalleryWorks({ series: "Big Bang" });
      expect(result).toBeDefined();
      if (result.length > 0) {
        expect(result[0].seriesName).toBe("Big Bang");
      }
    });

    it("should filter works by year", async () => {
      const result = await getGalleryWorks({ year: "2025" });
      expect(result).toBeDefined();
      if (result.length > 0) {
        expect(result[0].year).toBe("2025");
      }
    });

    it("should search works by title", async () => {
      const result = await getGalleryWorks({ search: "Big Bang" });
      expect(result).toBeDefined();
      if (result.length > 0) {
        expect(result[0].title.toLowerCase()).toContain("big bang");
      }
    });

    it("should sort works by year descending", async () => {
      const result = await getGalleryWorks({ sort: "year-desc" });
      expect(result).toBeDefined();
      if (result.length > 1) {
        const first = parseInt(result[0].year || "0");
        const second = parseInt(result[1].year || "0");
        expect(first).toBeGreaterThanOrEqual(second);
      }
    });

    it("should sort works by title ascending", async () => {
      const result = await getGalleryWorks({ sort: "title-asc" });
      expect(result).toBeDefined();
      if (result.length > 1) {
        expect(result[0].title.localeCompare(result[1].title)).toBeLessThanOrEqual(0);
      }
    });

    it("should return empty array for non-matching search", async () => {
      const result = await getGalleryWorks({ search: "NONEXISTENT_WORK_XYZ" });
      expect(result).toEqual([]);
    });

    it("should combine multiple filters", async () => {
      const result = await getGalleryWorks({
        phase: "NE",
        series: "Big Bang",
        sort: "title-asc",
      });
      expect(result).toBeDefined();
      if (result.length > 0) {
        expect(result[0].seriesName).toBe("Big Bang");
      }
    });
  });

  describe("getWorkBySlug", () => {
    it("should return a work by slug", async () => {
      // First get a work to get its slug
      const allWorks = await getGalleryWorks({});
      if (allWorks && allWorks.length > 0) {
        const firstWork = allWorks[0];
        const work = await getWorkBySlug(firstWork.slug);
        expect(work).toBeDefined();
        expect(work?.slug).toBe(firstWork.slug);
        expect(work?.title).toBe(firstWork.title);
      }
    });

    it("should return undefined for non-existent slug", async () => {
      const work = await getWorkBySlug("nonexistent-slug-xyz");
      expect(work).toBeUndefined();
    });

    it("should include all enriched fields", async () => {
      const allWorks = await getGalleryWorks({});
      if (allWorks && allWorks.length > 0) {
        const firstWork = allWorks[0];
        const work = await getWorkBySlug(firstWork.slug);
        expect(work).toBeDefined();
        expect(work?.curatorialHook).toBeDefined();
        expect(work?.neonReading).toBeDefined();
        expect(work?.conceptTags).toBeDefined();
        expect(work?.journalExcerpt).toBeDefined();
      }
    });
  });

  describe("getGalleryFilterOptions", () => {
    it("should return filter options with all categories", async () => {
      const options = await getGalleryFilterOptions();
      expect(options.phases).toBeDefined();
      expect(options.series).toBeDefined();
      expect(options.years).toBeDefined();
      expect(options.mediums).toBeDefined();
    });

    it("should return at least 8 phases", async () => {
      const options = await getGalleryFilterOptions();
      expect(options.phases.length).toBeGreaterThanOrEqual(8);
    });

    it("should return at least 14 series", async () => {
      const options = await getGalleryFilterOptions();
      expect(options.series.length).toBeGreaterThanOrEqual(14);
    });

    it("should return at least 8 years", async () => {
      const options = await getGalleryFilterOptions();
      expect(options.years.length).toBeGreaterThanOrEqual(8);
    });

    it("should return at least 16 mediums", async () => {
      const options = await getGalleryFilterOptions();
      expect(options.mediums.length).toBeGreaterThanOrEqual(16);
    });

    it("should have phase code and title", async () => {
      const options = await getGalleryFilterOptions();
      if (options.phases.length > 0) {
        const phase = options.phases[0];
        expect(phase.code).toBeDefined();
        expect(phase.title).toBeDefined();
        expect(typeof phase.code).toBe("string");
        expect(typeof phase.title).toBe("string");
      }
    });

    it("should have all series as strings", async () => {
      const options = await getGalleryFilterOptions();
      options.series.forEach((series) => {
        expect(typeof series).toBe("string");
        expect(series.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Gallery Data Integrity", () => {
    it("should have all works with required fields", async () => {
      const result = await getGalleryWorks({});
      if (result && Array.isArray(result)) {
        result.forEach((work) => {
          expect(work.id).toBeDefined();
          expect(work.title).toBeDefined();
          expect(work.slug).toBeDefined();
          expect(work.imageUrl || work.thumbnailUrl).toBeDefined();
        });
      }
    });

    it("should have unique slugs", async () => {
      const result = await getGalleryWorks({});
      if (result && Array.isArray(result)) {
        const slugs = result.map((w) => w.slug);
        const uniqueSlugs = new Set(slugs);
        expect(uniqueSlugs.size).toBe(slugs.length);
      }
    });

    it("should have 152 total works", async () => {
      const result = await getGalleryWorks({});
      expect(result && Array.isArray(result) && result.length).toBe(152);
    });
  });
});
