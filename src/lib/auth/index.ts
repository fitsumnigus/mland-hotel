// src/lib/auth/index.ts
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "markland-hotel-dev-secret-change-in-production-2024"
);

const COOKIE_NAME  = "mh_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export interface SessionPayload {
  userId:    string;
  email:     string;
  role:      string;
  firstName: string | null;
  lastName:  string | null;
  iat?:      number;
  exp?:      number;
}

// ─── Token creation ───────────────────────────────────────────────────

export async function signToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);
}

// ─── Token verification ───────────────────────────────────────────────

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

// ─── Cookie helpers ───────────────────────────────────────────────────

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge:   COOKIE_MAX_AGE,
    path:     "/",
  });
}

export async function getSessionFromCookie(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token       = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

// ─── Middleware helper ────────────────────────────────────────────────

export async function getSessionFromRequest(req: NextRequest): Promise<SessionPayload | null> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export function requireRole(session: SessionPayload | null, minRole: "STAFF" | "ADMIN" | "SUPER_ADMIN"): boolean {
  if (!session) return false;
  const hierarchy = { GUEST: 0, STAFF: 1, ADMIN: 2, SUPER_ADMIN: 3 };
  const userLevel = hierarchy[session.role as keyof typeof hierarchy] ?? 0;
  const minLevel  = hierarchy[minRole];
  return userLevel >= minLevel;
}

// ─── Middleware factory (used in middleware.ts) ───────────────────────

export function createAuthMiddleware(adminPaths: string[]) {
  return async (req: NextRequest): Promise<NextResponse | null> => {
    const isAdminPath = adminPaths.some((p) => req.nextUrl.pathname.startsWith(p));
    if (!isAdminPath) return null;

    const session = await getSessionFromRequest(req);

    if (!session || !requireRole(session, "STAFF")) {
      const loginUrl = new URL("/admin-login", req.url);
      loginUrl.searchParams.set("redirect", req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    return null; // allow through
  };
}
