import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import routes from "../routes";
import { healthCheck, ingestTelemetry } from "../custom-bridge";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// ─── Health Checks ───────────────────────────────────────────────
app.get("/health", healthCheck);
app.get("/api/health", healthCheck);  // ← Railway expects this path

// ─── Telemetry Ingest ────────────────────────────────────────────
app.post("/api/ingest", ingestTelemetry);

// ─── API Routes ──────────────────────────────────────────────────
app.use(routes);

// ─── Static Asset Serving ────────────────────────────────────────
const distPath = path.resolve(__dirname, "../../dist/public");
app.use(express.static(distPath));

// ─── SPA Fallback ────────────────────────────────────────────────
app.get("*", (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// ─── Boot ────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🔥 Neon-Crucible server live on port ${PORT} [${NODE_ENV}]`);
  console.log(`   Health:  http://localhost:${PORT}/health`);
  console.log(`   API:     http://localhost:${PORT}/api/works`);
  console.log(`   Static:  ${distPath}`);
});

export default app;
