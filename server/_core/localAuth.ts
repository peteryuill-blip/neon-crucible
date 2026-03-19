/**
 * localAuth.ts — Portable local authentication
 *
 * Replaces Manus OAuth with a simple bcrypt password login.
 * The admin password is set via the ADMIN_PASSWORD_HASH environment variable
 * (a bcrypt hash). Generate one with:
 *
 *   node -e "const b=require('bcryptjs'); b.hash('yourpassword',12).then(console.log)"
 *
 * Session tokens are signed HS256 JWTs using JWT_SECRET, identical to the
 * previous Manus SDK session format so no cookie changes are needed.
 */

import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import * as bcrypt from "bcryptjs";
import type { Express, Request, Response } from "express";
import { SignJWT, jwtVerify } from "jose";
import { parse as parseCookieHeader } from "cookie";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { ENV } from "./env";

// ─── JWT helpers ────────────────────────────────────────────────────────────

function getSecretKey(): Uint8Array {
  const secret = ENV.cookieSecret;
  if (!secret) throw new Error("JWT_SECRET environment variable is not set");
  return new TextEncoder().encode(secret);
}

export async function signSession(openId: string, name: string): Promise<string> {
  const issuedAt = Date.now();
  const expirationSeconds = Math.floor((issuedAt + ONE_YEAR_MS) / 1000);

  return new SignJWT({ openId, appId: "local", name })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(expirationSeconds)
    .sign(getSecretKey());
}

export async function verifySession(
  cookieValue: string | undefined | null
): Promise<{ openId: string; name: string } | null> {
  if (!cookieValue) return null;

  try {
    const { payload } = await jwtVerify(cookieValue, getSecretKey(), {
      algorithms: ["HS256"],
    });
    const { openId, name } = payload as Record<string, unknown>;
    if (typeof openId !== "string" || !openId) return null;
    return { openId, name: typeof name === "string" ? name : "" };
  } catch {
    return null;
  }
}

// ─── Request authenticator (used by context.ts) ─────────────────────────────

export async function authenticateRequest(req: Request) {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return null;

  const cookies = parseCookieHeader(cookieHeader);
  const sessionCookie = cookies[COOKIE_NAME];
  const session = await verifySession(sessionCookie);
  if (!session) return null;

  const user = await db.getUserByOpenId(session.openId);
  return user ?? null;
}

// ─── Express route registration ─────────────────────────────────────────────

export function registerLocalAuthRoutes(app: Express) {
  /**
   * POST /api/auth/login
   * Body: { password: string }
   * Sets a session cookie on success.
   */
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    const { password } = req.body ?? {};

    if (!password || typeof password !== "string") {
      res.status(400).json({ error: "password is required" });
      return;
    }

    const storedHash = ENV.adminPasswordHash;
    if (!storedHash) {
      console.error("[LocalAuth] ADMIN_PASSWORD_HASH is not configured");
      res.status(500).json({ error: "Server authentication is not configured" });
      return;
    }

    const valid = await bcrypt.compare(password, storedHash);
    if (!valid) {
      // Constant-time-ish delay to resist timing attacks
      await new Promise(r => setTimeout(r, 300));
      res.status(401).json({ error: "Invalid password" });
      return;
    }

    // Ensure admin user exists in DB
    const adminOpenId = "local-admin";
    await db.upsertUser({
      openId: adminOpenId,
      name: "Peter Yuill",
      email: null,
      loginMethod: "local",
      lastSignedIn: new Date(),
    });

    // Promote to admin if not already
    const user = await db.getUserByOpenId(adminOpenId);
    if (user && user.role !== "admin") {
      await db.setUserRole(adminOpenId, "admin");
    }

    const token = await signSession(adminOpenId, "Peter Yuill");
    const cookieOptions = getSessionCookieOptions(req);
    res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: ONE_YEAR_MS });
    res.json({ success: true });
  });

  /**
   * POST /api/auth/logout
   * Clears the session cookie.
   */
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    const cookieOptions = getSessionCookieOptions(req);
    res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
    res.json({ success: true });
  });
}
