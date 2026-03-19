/**
 * Tests for the portable local auth module (Task 4 migration)
 * Covers: JWT sign/verify, session cookie flow, password validation
 */

import { describe, expect, it, vi, beforeEach } from "vitest";
import { signSession, verifySession } from "./_core/localAuth";

// Set a test JWT secret
process.env.JWT_SECRET = "test-secret-key-for-unit-tests-minimum-32-chars";

describe("localAuth — signSession / verifySession", () => {
  it("signs a session and verifies it successfully", async () => {
    const token = await signSession("local-admin", "Peter Yuill");
    expect(typeof token).toBe("string");
    expect(token.split(".")).toHaveLength(3); // JWT has 3 parts

    const payload = await verifySession(token);
    expect(payload).not.toBeNull();
    expect(payload?.openId).toBe("local-admin");
    expect(payload?.name).toBe("Peter Yuill");
  });

  it("returns null for an empty/undefined cookie", async () => {
    expect(await verifySession(null)).toBeNull();
    expect(await verifySession(undefined)).toBeNull();
    expect(await verifySession("")).toBeNull();
  });

  it("returns null for a tampered token", async () => {
    const token = await signSession("local-admin", "Peter Yuill");
    const tampered = token.slice(0, -5) + "XXXXX";
    const result = await verifySession(tampered);
    expect(result).toBeNull();
  });

  it("returns null for a token signed with a different secret", async () => {
    // Sign with a different secret
    const { SignJWT } = await import("jose");
    const wrongKey = new TextEncoder().encode("wrong-secret-key-for-testing-purposes-32");
    const badToken = await new SignJWT({ openId: "local-admin", appId: "local", name: "Hacker" })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setExpirationTime(Math.floor(Date.now() / 1000) + 3600)
      .sign(wrongKey);

    const result = await verifySession(badToken);
    expect(result).toBeNull();
  });
});

describe("auth.logout tRPC procedure", () => {
  it("clears the session cookie and returns success", async () => {
    const { appRouter } = await import("./routers");
    const { COOKIE_NAME } = await import("../shared/const");
    type CookieCall = { name: string; options: Record<string, unknown> };
    const clearedCookies: CookieCall[] = [];

    const ctx = {
      user: {
        id: 1,
        openId: "local-admin",
        email: null,
        name: "Peter Yuill",
        loginMethod: "local",
        role: "admin" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      },
      req: {
        protocol: "https",
        headers: {},
      } as any,
      res: {
        clearCookie: (name: string, options: Record<string, unknown>) => {
          clearedCookies.push({ name, options });
        },
      } as any,
    };

    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.logout();

    expect(result).toEqual({ success: true });
    expect(clearedCookies).toHaveLength(1);
    expect(clearedCookies[0]?.name).toBe(COOKIE_NAME);
    expect(clearedCookies[0]?.options).toMatchObject({
      maxAge: -1,
      httpOnly: true,
      path: "/",
    });
  });
});
