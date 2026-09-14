import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/client";

// Only these three are ever sent, from src/lib/analytics/track.ts's two call
// sites (AnalyticsBeacon.tsx, ChatWidget.tsx) -- anything else is rejected
// rather than silently letting an arbitrary event_type into the table.
const ALLOWED_EVENT_TYPES = new Set(["page_view", "chat_opened", "chat_message_sent"]);
const MAX_FIELD_LENGTH = 300;

function truncate(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null;
  return value.trim().slice(0, MAX_FIELD_LENGTH);
}

/* Fire-and-forget event logging for src/app/admin/(dashboard)/analytics/page.tsx.
   No PII collected (no IP, no User-Agent, no cookie/session id) -- see
   supabase/migrations/0013_analytics_events.sql. Always resolves fast and
   never surfaces an error to the caller: analytics must never block a page
   render or a chat message send. */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new NextResponse(null, { status: 204 });
  }

  const eventType = (body as { event_type?: unknown })?.event_type;
  if (typeof eventType !== "string" || !ALLOWED_EVENT_TYPES.has(eventType)) {
    return new NextResponse(null, { status: 204 });
  }

  try {
    const supabase = createServiceRoleClient();
    await supabase.from("analytics_events").insert({
      event_type: eventType,
      path: truncate((body as { path?: unknown })?.path),
      referrer: truncate((body as { referrer?: unknown })?.referrer),
    });
  } catch (error) {
    console.error("analytics track: insert failed", error);
  }

  return new NextResponse(null, { status: 204 });
}
