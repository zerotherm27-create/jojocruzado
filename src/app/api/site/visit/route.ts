import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/client";
import { readSessionId, refreshSessionCookie } from "@/lib/analytics/sessionCookie";
import { isBot, parseUserAgent } from "@/lib/analytics/ua";
import { readGeo } from "@/lib/analytics/geo";

const MAX_FIELD_LENGTH = 300;

function truncate(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null;
  return value.trim().slice(0, MAX_FIELD_LENGTH);
}

/* Fire-and-forget visit beacon for src/components/SiteVisitTracker.tsx, called
   on mount and on every client-side route change. Named /api/site/visit
   rather than something like /api/track -- ad-blocker filter lists
   (EasyList/EasyPrivacy) match generic path keywords ("track", "collect",
   "beacon", "pixel", "analytics") regardless of domain.

   Fully fault-tolerant: wraps the whole body in try/catch, always returns
   204, never surfaces an error to the caller -- analytics must never be able
   to break a real page load. See supabase/migrations/0014_site_sessions_and_pageviews.sql
   for the schema and privacy rationale (no raw IP, no cookie payload beyond
   an opaque session id). */
export async function POST(request: NextRequest) {
  try {
    const userAgent = request.headers.get("user-agent");
    if (!userAgent || isBot(userAgent)) {
      return new NextResponse(null, { status: 204 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      body = {};
    }
    const path = truncate((body as { path?: unknown })?.path) ?? "/";
    const referrer = truncate((body as { referrer?: unknown })?.referrer);

    const supabase = createServiceRoleClient();
    const existingId = readSessionId(request);

    const now = new Date();
    let sessionId = existingId;

    if (existingId) {
      const { data: existing } = await supabase
        .from("site_sessions")
        .select("id, created_at, page_count")
        .eq("id", existingId)
        .maybeSingle();

      if (existing) {
        const durationSeconds = Math.max(
          0,
          Math.floor((now.getTime() - new Date(existing.created_at).getTime()) / 1000),
        );
        await supabase
          .from("site_sessions")
          .update({
            last_seen_at: now.toISOString(),
            duration_seconds: durationSeconds,
            page_count: existing.page_count + 1,
          })
          .eq("id", existingId);
      } else {
        sessionId = null;
      }
    }

    if (!sessionId) {
      sessionId = crypto.randomUUID();
      const { deviceType, os, browser } = parseUserAgent(userAgent);
      const { country, region, city } = readGeo(request);

      await supabase.from("site_sessions").insert({
        id: sessionId,
        created_at: now.toISOString(),
        last_seen_at: now.toISOString(),
        duration_seconds: 0,
        landing_path: path,
        page_count: 1,
        device_type: deviceType,
        os,
        browser,
        country,
        region,
        city,
        referrer,
      });
    }

    await supabase.from("site_pageviews").insert({
      session_id: sessionId,
      path,
      occurred_at: now.toISOString(),
    });

    const response = new NextResponse(null, { status: 204 });
    refreshSessionCookie(response, sessionId);
    return response;
  } catch (error) {
    console.error("site visit: failed", error);
    return new NextResponse(null, { status: 204 });
  }
}
