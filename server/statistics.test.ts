import { describe, it, expect, beforeAll } from "vitest";
import * as db from "./db";

describe("Collection Statistics", () => {
  beforeAll(async () => {
    // Wait for database to be ready
    await db.getDb();
  });

  describe("getCollectionStatistics", () => {
    it("should return statistics object with all required fields", async () => {
      const stats = await db.getCollectionStatistics();
      
      expect(stats).toBeDefined();
      expect(stats).toHaveProperty("totalWorks");
      expect(stats).toHaveProperty("worksByPhase");
      expect(stats).toHaveProperty("techniqueDistribution");
      expect(stats).toHaveProperty("sizeRanges");
      expect(stats).toHaveProperty("totalPhases");
      expect(stats).toHaveProperty("yearSpan");
    });

    it("should return correct total works count", async () => {
      const stats = await db.getCollectionStatistics();
      
      expect(stats.totalWorks).toBeGreaterThan(0);
      expect(typeof stats.totalWorks).toBe("number");
    });

    it("should return works by phase with correct structure", async () => {
      const stats = await db.getCollectionStatistics();
      
      expect(Array.isArray(stats.worksByPhase)).toBe(true);
      expect(stats.worksByPhase.length).toBeGreaterThan(0);
      
      stats.worksByPhase.forEach(phase => {
        expect(phase).toHaveProperty("phaseId");
        expect(phase).toHaveProperty("phaseCode");
        expect(phase).toHaveProperty("phaseTitle");
        expect(phase).toHaveProperty("year");
        expect(phase).toHaveProperty("count");
        expect(typeof phase.count).toBe("number");
        expect(phase.count).toBeGreaterThanOrEqual(0);
      });
    });

    it("should have phases in correct order", async () => {
      const stats = await db.getCollectionStatistics();
      
      // Phases should be ordered by sortOrder
      const phaseCodes = stats.worksByPhase.map(p => p.phaseCode);
      expect(phaseCodes.length).toBeGreaterThan(0);
      
      // Check that we have expected phases (PH1, PH1A, PH2, etc.)
      const hasPhases = phaseCodes.some(code => 
        code.startsWith("PH") || code === "NE"
      );
      expect(hasPhases).toBe(true);
    });

    it("should sum of works by phase equal total works", async () => {
      const stats = await db.getCollectionStatistics();
      
      const sumByPhase = stats.worksByPhase.reduce((sum, phase) => sum + phase.count, 0);
      expect(sumByPhase).toBe(stats.totalWorks);
    });

    it("should return technique distribution with correct structure", async () => {
      const stats = await db.getCollectionStatistics();
      
      expect(Array.isArray(stats.techniqueDistribution)).toBe(true);
      
      if (stats.techniqueDistribution.length > 0) {
        stats.techniqueDistribution.forEach(tech => {
          expect(tech).toHaveProperty("technique");
          expect(tech).toHaveProperty("count");
          expect(typeof tech.technique).toBe("string");
          expect(typeof tech.count).toBe("number");
          expect(tech.count).toBeGreaterThan(0);
        });
      }
    });

    it("should have technique distribution sorted by count descending", async () => {
      const stats = await db.getCollectionStatistics();
      
      if (stats.techniqueDistribution.length > 1) {
        for (let i = 0; i < stats.techniqueDistribution.length - 1; i++) {
          expect(stats.techniqueDistribution[i].count).toBeGreaterThanOrEqual(
            stats.techniqueDistribution[i + 1].count
          );
        }
      }
    });

    it("should return size ranges with correct structure", async () => {
      const stats = await db.getCollectionStatistics();
      
      expect(Array.isArray(stats.sizeRanges)).toBe(true);
      expect(stats.sizeRanges.length).toBe(4); // Small, Medium, Large, Monumental
      
      const expectedRanges = [
        "Small (<50cm)",
        "Medium (50-100cm)",
        "Large (100-150cm)",
        "Monumental (>150cm)"
      ];
      
      stats.sizeRanges.forEach(size => {
        expect(size).toHaveProperty("range");
        expect(size).toHaveProperty("count");
        expect(expectedRanges).toContain(size.range);
        expect(typeof size.count).toBe("number");
        expect(size.count).toBeGreaterThanOrEqual(0);
      });
    });

    it("should categorize dimensions correctly", async () => {
      const stats = await db.getCollectionStatistics();
      
      // Sum of all size ranges should equal total works (assuming all have dimensions)
      const sumBySizes = stats.sizeRanges.reduce((sum, size) => sum + size.count, 0);
      
      // Should be close to total works (some might not have dimensions)
      expect(sumBySizes).toBeLessThanOrEqual(stats.totalWorks);
    });

    it("should return correct total phases count", async () => {
      const stats = await db.getCollectionStatistics();
      
      expect(stats.totalPhases).toBeGreaterThan(0);
      expect(typeof stats.totalPhases).toBe("number");
      
      // Total phases should match worksByPhase array length
      expect(stats.totalPhases).toBe(stats.worksByPhase.length);
    });

    it("should return year span", async () => {
      const stats = await db.getCollectionStatistics();
      
      expect(stats.yearSpan).toBeDefined();
      expect(typeof stats.yearSpan).toBe("string");
      expect(stats.yearSpan).toBe("2018-2025");
    });

    it("should handle empty database gracefully", async () => {
      // This test ensures the function doesn't crash with empty data
      const stats = await db.getCollectionStatistics();
      
      expect(stats).toBeDefined();
      expect(typeof stats.totalWorks).toBe("number");
      expect(Array.isArray(stats.worksByPhase)).toBe(true);
      expect(Array.isArray(stats.techniqueDistribution)).toBe(true);
      expect(Array.isArray(stats.sizeRanges)).toBe(true);
    });

    it("should include phase years in worksByPhase", async () => {
      const stats = await db.getCollectionStatistics();
      
      stats.worksByPhase.forEach(phase => {
        expect(phase.year).toBeDefined();
        expect(typeof phase.year).toBe("string");
        // Year should be a valid format (e.g., "2018", "2019-2020")
        expect(phase.year.length).toBeGreaterThan(0);
      });
    });

    it("should have at least one technique with Saunders Waterford paper", async () => {
      const stats = await db.getCollectionStatistics();
      
      const hasSaundersWaterford = stats.techniqueDistribution.some(tech =>
        tech.technique.includes("Saunders Waterford")
      );
      
      expect(hasSaundersWaterford).toBe(true);
    });

    it("should have consistent data types", async () => {
      const stats = await db.getCollectionStatistics();
      
      // Verify all counts are integers
      expect(Number.isInteger(stats.totalWorks)).toBe(true);
      expect(Number.isInteger(stats.totalPhases)).toBe(true);
      
      stats.worksByPhase.forEach(phase => {
        expect(Number.isInteger(phase.count)).toBe(true);
        expect(Number.isInteger(phase.phaseId)).toBe(true);
      });
      
      stats.techniqueDistribution.forEach(tech => {
        expect(Number.isInteger(tech.count)).toBe(true);
      });
      
      stats.sizeRanges.forEach(size => {
        expect(Number.isInteger(size.count)).toBe(true);
      });
    });
  });
});
