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

// Health checks
app.get("/health", healthCheck);
app.get("/api/health", healthCheck);

// Telemetry
app.post("/api/ingest", ingestTelemetry);

// API routes
app.use(routes);

// Static files — try multiple paths for Railway compatibility
const possiblePaths = [
  path.resolve(__dirname, "../../dist/public"),
  path.resolve(__dirname, "../dist/public"),
  path.resolve(__dirname, "../../dist"),
  path.resolve(__dirname, "../dist"),
  "/app/dist/public",
  "/app/dist",
];

let distPath = null;
for (const p of possiblePaths) {
  if (require("fs").existsSync(path.join(p, "index.html"))) {
    distPath = p;
    break;
  }
}

if (distPath) {
  console.log(`   Static:  ${distPath}`);
  app.use(express.static(distPath));
  
  // SPA fallback — serve index.html for all non-API routes
  app.get("*", (req, res) => {
    if (req.path.startsWith("/api")) return res.status(404).json({ error: "API_NOT_FOUND" });
    res.sendFile(path.join(distPath, "index.html"));
  });
} else {
  console.log("   ⚠️  No dist/public found — frontend will not be served");
  app.get("/", (_req, res) => res.json({ status: "API_ONLY", message: "Frontend not built" }));
}

app.listen(PORT, () => {
  console.log(`🔥 Neon-Crucible server live on port ${PORT} [${NODE_ENV}]`);
  console.log(`   Health:  http://localhost:${PORT}/health`);
  console.log(`   API:     http://localhost:${PORT}/api/works`);
});

export default app;
