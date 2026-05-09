import { db } from "../db";
import { works } from "../schema";
import { eq } from "drizzle-orm";
import type { Express } from "express";

export function setupCustomRoutes(app: Express) {
  app.get("/api/works/phase/:id", async (req, res) => {
    try {
      const data = await db.select().from(works).where(eq(works.phaseId, parseInt(req.params.id)));
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: "CORE_FETCH_FAILED" });
    }
  });
}
