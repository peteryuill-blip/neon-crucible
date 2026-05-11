# ─────────────────────────────────────────────────────────────────────────────
# Neon Crucible — Production Dockerfile
# Multi-stage build: deps → build → runtime
# Node 22 LTS, pnpm, Alpine Linux
# ─────────────────────────────────────────────────────────────────────────────

# Cache-bust arg: increment to force Railway to rebuild from scratch
ARG CACHE_BUST=6

# ── Stage 1: Install dependencies ────────────────────────────────────────────
FROM node:22-alpine AS deps

RUN corepack enable && corepack prepare pnpm@10.4.1 --activate

WORKDIR /app

# Copy lockfile and manifests first for layer caching
COPY package.json pnpm-lock.yaml ./

# Copy patches directory (wouter patch)
COPY patches/ ./patches/

# Install all dependencies (including devDeps needed for build)
RUN pnpm install --frozen-lockfile

# ── Stage 2: Build ───────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

ARG CACHE_BUST=6

RUN corepack enable && corepack prepare pnpm@10.4.1 --activate

WORKDIR /app

# Copy deps from previous stage
COPY --from=deps /app/node_modules ./node_modules

# Copy all source files
COPY . .

# Build:
#   - Vite builds client → dist/public/  (outDir set in vite.config.ts)
#   - esbuild bundles server → dist/index.js
RUN pnpm build

# Verify build output exists
RUN ls -la dist/ && ls -la dist/public/

# ── Stage 3: Production runtime ───────────────────────────────────────────────
FROM node:22-alpine AS runtime

RUN corepack enable && corepack prepare pnpm@10.4.1 --activate

WORKDIR /app

# Copy lockfile and package.json for production install
COPY package.json pnpm-lock.yaml ./
COPY patches/ ./patches/

# Ensure /app is writable before installing
RUN chmod -R 755 /app

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Copy built artefacts from builder stage
COPY --from=builder /app/dist ./dist

# Copy server source (needed for tsx to run)
COPY server/ ./server/

# Copy drizzle config (needed for schema reference at runtime)
COPY drizzle/ ./drizzle/
COPY drizzle.config.ts ./

# Non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Start production server using pnpm start
CMD ["pnpm", "start"]
