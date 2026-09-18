// Shared by AnalyticsBeacon.tsx (page views) and ChatWidget.tsx (chat_opened,
// chat_message_sent) so the request shape lives in one place. Always
// fire-and-forget: analytics must never block rendering or a chat send, and
// a blocked/failed request is silently dropped, not surfaced to the caller.
export function trackEvent(eventType: string, path?: string) {
  try {
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        event_type: eventType,
        path,
        referrer: typeof document !== "undefined" ? document.referrer : undefined,
      }),
    }).catch(() => {});
  } catch {
    // Ignore -- fetch/keepalive can throw in some environments (e.g. request too large).
  }
}
