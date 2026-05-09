import { setupCustomRoutes } from "../custom-bridge";
import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerLocalAuthRoutes } from "./localAuth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { sitemapHandler } from "../sitemap";

async function startServer() {
  const app = express();
  setupCustomRoutes(app);
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Simple health check endpoint for Railway/Docker (no auth, no tRPC overhead)
  app.get("/api/health", (_req, res) => {
    res.status(200).json({ ok: true, timestamp: Date.now() });
  });

  // Local auth routes: POST /api/auth/login, POST /api/auth/logout
  registerLocalAuthRoutes(app);
  // Sitemap
  app.get("/sitemap.xml", sitemapHandler);

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Railway injects PORT; listen on 0.0.0.0 so the container is reachable
  const port = parseInt(process.env.PORT || "3000");

  server.listen(port, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${port}/`);
  });
}

startServer().catch(console.error);
