# ─────────────────────────────────────────────────────────────────────────────
# Neon Crucible — Production Dockerfile
# Multi-stage build: deps → build → runtime
# Node 22 LTS, pnpm, Alpine Linux
# ─────────────────────────────────────────────────────────────────────────────

# ── Stage 1: Install dependencies ────────────────────────────────────────────
FROM node:22-alpine AS deps

RUN corepack enable && corepack prepare pnpm@10.4.1 --activate

WORKDIR /app

# Copy lockfile and manifests first for layer caching
COPY package.json pnpm-lock.yaml ./
COPY patches/ ./patches/

# Install all dependencies (including devDeps needed for build)
RUN pnpm install --frozen-lockfile

# ── Stage 2: Build ───────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@10.4.1 --activate

WORKDIR /app

# Copy deps from previous stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source
COPY . .

# Build:
#   - Vite builds client → dist/public/
#   - esbuild bundles server → dist/index.js
RUN pnpm build

# ── Stage 3: Production runtime ───────────────────────────────────────────────
FROM node:22-alpine AS runtime

RUN corepack enable && corepack prepare pnpm@10.4.1 --activate

WORKDIR /app

# Copy lockfile and package.json for production install
COPY package.json pnpm-lock.yaml ./
COPY patches/ ./patches/

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Copy built artefacts from builder
# - dist/index.js  → server bundle
# - dist/public/   → Vite client build (served as static files)
COPY --from=builder /app/dist ./dist

# Copy drizzle migrations (needed at runtime for schema reference)
COPY drizzle/ ./drizzle/
COPY drizzle.config.ts ./

# Non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Railway injects PORT env var; default to 3000
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:${PORT:-3000}/api/trpc/system.health || exit 1

# Start production server
CMD ["node", "dist/index.js"]
