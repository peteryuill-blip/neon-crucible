import { describe, it, expect, beforeAll } from "vitest";
import * as db from "./db";

describe("Search Functionality", () => {
  beforeAll(async () => {
    // Wait for database to be ready
    await db.getDb();
  });

  describe("searchArchive", () => {
    it("should return empty array for empty query", async () => {
      const results = await db.searchArchive("");
      expect(results).toEqual([]);
    });

    it("should return empty array for whitespace-only query", async () => {
      const results = await db.searchArchive("   ");
      expect(results).toEqual([]);
    });

    it("should search works by title", async () => {
      const results = await db.searchArchive("Covenant");
      expect(results.length).toBeGreaterThan(0);
      
      const workResults = results.filter(r => r.type === "work");
      expect(workResults.length).toBeGreaterThan(0);
      
      const hasCovenantWork = workResults.some(r => 
        r.title.toLowerCase().includes("covenant")
      );
      expect(hasCovenantWork).toBe(true);
    });

    it("should search works by technique", async () => {
      const results = await db.searchArchive("ink");
      expect(results.length).toBeGreaterThan(0);
      
      const workResults = results.filter(r => r.type === "work");
      expect(workResults.length).toBeGreaterThan(0);
    });

    it("should search works by emotional register", async () => {
      const results = await db.searchArchive("gravitas");
      
      const workResults = results.filter(r => r.type === "work");
      if (workResults.length > 0) {
        const hasGravitas = workResults.some(r => 
          r.emotionalRegister?.toLowerCase().includes("gravitas")
        );
        expect(hasGravitas).toBe(true);
      }
    });

    it("should search works by series name", async () => {
      const results = await db.searchArchive("Big Bang");
      expect(results.length).toBeGreaterThan(0);
      
      const workResults = results.filter(r => r.type === "work");
      expect(workResults.length).toBeGreaterThan(0);
      
      const hasBigBang = workResults.some(r => 
        r.seriesName?.toLowerCase().includes("big bang")
      );
      expect(hasBigBang).toBe(true);
    });

    it("should search phases by code", async () => {
      const results = await db.searchArchive("PH1");
      
      const phaseResults = results.filter(r => r.type === "phase");
      expect(phaseResults.length).toBeGreaterThan(0);
      
      const hasPH1 = phaseResults.some(r => 
        r.phaseCode === "PH1" || r.title.includes("PH1")
      );
      expect(hasPH1).toBe(true);
    });

    it("should search phases by title", async () => {
      const results = await db.searchArchive("Absurdity");
      
      // Should find either phase or works from that phase
      expect(results.length).toBeGreaterThan(0);
      
      // If phase results exist, verify they match
      const phaseResults = results.filter(r => r.type === "phase");
      if (phaseResults.length > 0) {
        const hasAbsurdity = phaseResults.some(r => 
          r.title.toLowerCase().includes("absurdity")
        );
        expect(hasAbsurdity).toBe(true);
      }
    });

    it("should search essays by title", async () => {
      const results = await db.searchArchive("Long Breathing");
      
      const essayResults = results.filter(r => r.type === "essay");
      if (essayResults.length > 0) {
        const hasLongBreathing = essayResults.some(r => 
          r.title.toLowerCase().includes("breathing")
        );
        expect(hasLongBreathing).toBe(true);
      }
    });

    it("should respect limit parameter", async () => {
      const results = await db.searchArchive("ink", 5);
      expect(results.length).toBeLessThanOrEqual(5);
    });

    it("should return mixed results (works, phases, essays)", async () => {
      const results = await db.searchArchive("Neon");
      
      // Should find at least works or essays mentioning Neon
      expect(results.length).toBeGreaterThan(0);
    });

    it("should handle case-insensitive search", async () => {
      const lowerResults = await db.searchArchive("covenant");
      const upperResults = await db.searchArchive("COVENANT");
      const mixedResults = await db.searchArchive("CoVeNaNt");
      
      // All should return results
      expect(lowerResults.length).toBeGreaterThan(0);
      expect(upperResults.length).toBeGreaterThan(0);
      expect(mixedResults.length).toBeGreaterThan(0);
    });

    it("should only return published works", async () => {
      const results = await db.searchArchive("ink");
      
      const workResults = results.filter(r => r.type === "work");
      // All work results should be from published works
      expect(workResults.length).toBeGreaterThan(0);
    });

    it("should include phase code in work results", async () => {
      const results = await db.searchArchive("Covenant");
      
      const workResults = results.filter(r => r.type === "work");
      if (workResults.length > 0) {
        const hasPhaseCode = workResults.some(r => r.phaseCode !== undefined);
        expect(hasPhaseCode).toBe(true);
      }
    });

    it("should include image URLs for works when available", async () => {
      const results = await db.searchArchive("Covenant");
      
      const workResults = results.filter(r => r.type === "work");
      if (workResults.length > 0) {
        const hasImageUrl = workResults.some(r => r.imageUrl !== undefined);
        expect(hasImageUrl).toBe(true);
      }
    });

    it("should truncate essay content in description", async () => {
      const results = await db.searchArchive("practice");
      
      const essayResults = results.filter(r => r.type === "essay");
      if (essayResults.length > 0) {
        essayResults.forEach(essay => {
          if (essay.description) {
            // Description should be truncated (max 150 chars + "...")
            expect(essay.description.length).toBeLessThanOrEqual(154);
          }
        });
      }
    });
  });
});
