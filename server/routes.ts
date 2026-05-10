import { Router } from "express";
import { db } from "./db";
import { works } from "./schema";
import { eq, desc, sql } from "drizzle-orm";
const router = Router();
const DEFAULT_LIMIT = 100;
const MAX_LIMIT = 300;

router.get("/api/works", async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(req.query.limit as string) || DEFAULT_LIMIT));
    const offset = (page - 1) * limit;
    const sortField = (req.query.sort as string) || "id";
    const order = (req.query.order as string) === "asc" ? "asc" : "desc";
    const phaseFilter = req.query.phase ? parseInt(req.query.phase as string) : null;
    let query = db.select().from(works) as any;
    if (phaseFilter) query = query.where(eq(works.phaseId, phaseFilter));
    const sortColumn = sortField === "rating" ? works.rating : sortField === "week" ? works.weekNumber : sortField === "title" ? works.title : works.id;
    query = query.orderBy(order === "asc" ? sql`${sortColumn}` : desc(sortColumn));
    query = query.limit(limit).offset(offset);
    const allWorks = await query;
    const countResult = await db.select({ count: sql`COUNT(*)` }).from(works);
    const total = Number((countResult[0] as any).count);
    res.json({ data: allWorks, pagination: { page, limit, total, totalPages: Math.ceil(total / limit), hasNext: page * limit < total, hasPrev: page > 1 } });
  } catch (err) { console.error("FETCH_FAILURE:", err); res.status(500).json({ error: "FETCH_FAILURE", message: String(err) }); }
});

router.get("/api/works/:slug", async (req, res) => {
  try {
    const result = await db.select().from(works).where(eq(works.slug, req.params.slug)).limit(1);
    if (!result[0]) return res.status(404).json({ error: "NOT_FOUND" });
    res.json(result[0]);
  } catch (err) { console.error("FETCH_FAILURE:", err); res.status(500).json({ error: "FETCH_FAILURE", message: String(err) }); }
});

router.get("/api/works/curated", async (_req, res) => {
  try {
    const allWorks = await db.select().from(works);
    const validWorks = allWorks.filter((work) => {
      if (work.disposition === "TR") return false;
      try { const oracle = JSON.parse(work.technicalObservation ?? "{}"); if (oracle?.matrix_flags?.is_kill && work.disposition !== "SA") return false; } catch { }
      return (work.rating || 0) >= 2 || work.disposition === "SA";
    });
    res.json({ data: validWorks, count: validWorks.length });
  } catch (err) { console.error("FETCH_FAILURE:", err); res.status(500).json({ error: "FETCH_FAILURE", message: String(err) }); }
});

router.get("/api/stats", async (_req, res) => {
  try {
    const allWorks = await db.select().from(works);
    const totalWorks = allWorks.length;
    const avgRating = totalWorks > 0 ? (allWorks.reduce((s, w) => s + (w.rating || 0), 0) / totalWorks).toFixed(2) : "0";
    const weeks = new Set(allWorks.map(w => w.weekNumber).filter(Boolean)).size;
    const saved = allWorks.filter(w => w.disposition === "SA").length;
    const killed = allWorks.filter(w => w.disposition === "TR").length;
    res.json({ totalWorks, avgRating, totalWeeks: weeks, savedCount: saved, killedCount: killed, phaseBreakdown: { warmup: allWorks.filter(w => w.phaseId === 60606).length, production: allWorks.filter(w => w.phaseId === 60607).length } });
  } catch (err) { console.error("STATS_FAILURE:", err); res.status(500).json({ error: "STATS_FAILURE", message: String(err) }); }
});

export default router;
