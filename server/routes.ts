import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "./db"; // Surgical fix: pointing to the local file
import { works } from "./schema";
import { eq } from "drizzle-orm";

export function registerRoutes(app: Express): Server {
  // CRUCIBLE API
  app.get("/api/works/phase/:phaseId", async (req, res) => {
    try {
      const pId = parseInt(req.params.phaseId);
      const result = await db.select().from(works).where(eq(works.phaseId, pId));
      res.json(result || []);
    } catch (e) {
      console.error("CRUCIBLE_API_ERROR:", e);
      res.status(500).json({ error: "DATABASE_CONNECTION_FAILED" });
    }
  });

  // DETAIL API
  app.get("/api/works/:slug", async (req, res) => {
    try {
      const [work] = await db.select().from(works).where(eq(works.slug, req.params.slug)).limit(1);
      if (!work) return res.status(404).json({ error: "WORK_NOT_FOUND" });
      res.json(work);
    } catch (e) {
      res.status(500).json({ error: "LOOKUP_FAILED" });
    }
  });

  return createServer(app);
}
