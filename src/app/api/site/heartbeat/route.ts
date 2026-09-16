import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/client";
import { readSessionId, refreshSessionCookie } from "@/lib/analytics/sessionCookie";

/* Keeps duration_seconds accurate for visitors who land on one page and stay
   a while (a bounce-eligible session would otherwise show a near-zero
   duration). Called via navigator.sendBeacon from
   src/components/SiteVisitTracker.tsx every ~15s while the tab is visible,
   plus once on pagehide for a final update.

   No bot filtering here: this endpoint never creates a session, only
   extends one that /api/site/visit already screened, so a request with no
   matching session id is simply a no-op. Same fault-tolerance contract as
   /api/site/visit -- see that route for the ad-blocker-naming rationale. */
export async function POST(request: NextRequest) {
  try {
    const sessionId = readSessionId(request);
    if (!sessionId) {
      return new NextResponse(null, { status: 204 });
    }

    const supabase = createServiceRoleClient();
    const { data: existing } = await supabase
      .from("site_sessions")
      .select("created_at")
      .eq("id", sessionId)
      .maybeSingle();

    if (!existing) {
      return new NextResponse(null, { status: 204 });
    }

    const now = new Date();
    const durationSeconds = Math.max(
      0,
      Math.floor((now.getTime() - new Date(existing.created_at).getTime()) / 1000),
    );

    await supabase
      .from("site_sessions")
      .update({ last_seen_at: now.toISOString(), duration_seconds: durationSeconds })
      .eq("id", sessionId);

    const response = new NextResponse(null, { status: 204 });
    refreshSessionCookie(response, sessionId);
    return response;
  } catch (error) {
    console.error("site heartbeat: failed", error);
    return new NextResponse(null, { status: 204 });
  }
}
