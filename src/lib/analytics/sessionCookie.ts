import "server-only";
import type { NextRequest, NextResponse } from "next/server";

// Session identity lives in an httpOnly cookie, never client storage, so the
// client tracker (src/components/SiteVisitTracker.tsx) never needs to know
// or handle the session id at all. A boring name, same reasoning as the
// route paths below -- see src/app/api/site/visit/route.ts.
const COOKIE_NAME = "sma_visit";

// Sliding window: refreshed on every response, so 30 minutes of inactivity
// expires the cookie on its own -- no cleanup job, no server-side timeout
// tracking needed. Matches the "session" definition used throughout the
// /admin/analytics aggregation (src/app/admin/(dashboard)/analytics/page.tsx).
const MAX_AGE_SECONDS = 30 * 60;

export function readSessionId(request: NextRequest): string | null {
  return request.cookies.get(COOKIE_NAME)?.value ?? null;
}

// Called on every response from /api/site/visit and /api/site/heartbeat,
// whether the session is new or existing, so the expiry keeps sliding.
export function refreshSessionCookie(response: NextResponse, sessionId: string) {
  response.cookies.set(COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}
