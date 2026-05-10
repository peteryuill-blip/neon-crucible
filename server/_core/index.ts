import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import routes from "../routes";
import { healthCheck, ingestTelemetry } from "../custom-bridge";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const NODE_ENV = process.env.NODE_ENV || "development";
const BASE_PORT = parseInt(process.env.PORT || "3000", 10);

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/health", healthCheck);
app.post("/api/ingest", ingestTelemetry);
app.use(routes);

const distPath = path.resolve(__dirname, "../../dist/public");
app.use(express.static(distPath));

app.get("*", (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

function startServer(port: number) {
  const server = app.listen(port, () => {
    console.log(`🔥 Neon-Crucible server live on port ${port} [${NODE_ENV}]`);
    console.log(`   Health:  http://localhost:${port}/health`);
    console.log(`   API:     http://localhost:${port}/api/works`);
  });
  server.on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
      console.log(`   Port ${port} in use, trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error("❌ Server error:", err.message);
      process.exit(1);
    }
  });
}

startServer(BASE_PORT);
