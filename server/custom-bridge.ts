import type { Request, Response } from "express";

export async function healthCheck(_req: Request, res: Response) {
  res.json({
    status: "operational",
    service: "neon-crucible-bridge",
    timestamp: new Date().toISOString(),
  });
}

export async function ingestTelemetry(req: Request, res: Response) {
  try {
    const payload = req.body;
    if (!payload?.sovereignId || !payload?.tCode) {
      return res.status(400).json({ error: "MISSING_IDENTIFIERS" });
    }
    res.json({ received: true, sovereignId: payload.sovereignId });
  } catch (err) {
    res.status(500).json({ error: "INGEST_FAILURE", message: String(err) });
  }
}
