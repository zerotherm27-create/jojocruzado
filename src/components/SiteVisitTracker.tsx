"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Powers the session/device/geo/duration/bounce-rate breakdowns on
// /admin/analytics -- separate from AnalyticsBeacon.tsx, which logs a flat
// event list (page_view/chat_opened/chat_message_sent) for the chat funnel
// and isn't session-aware. Mounted once in src/app/(site)/layout.tsx, same
// tier as AnalyticsBeacon; that layout never renders under /admin, so no
// separate path exclusion is needed here.
const HEARTBEAT_INTERVAL_MS = 15_000;

export default function SiteVisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    try {
      fetch("/api/site/visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
          path: pathname,
          referrer: typeof document !== "undefined" ? document.referrer : undefined,
        }),
      }).catch(() => {});
    } catch {
      // Ignore -- fetch/keepalive can throw in some environments (e.g. request too large).
    }
  }, [pathname]);

  useEffect(() => {
    function sendHeartbeat() {
      try {
        navigator.sendBeacon("/api/site/heartbeat");
      } catch {
        // Ignore -- sendBeacon can throw if the payload/queue is rejected.
      }
    }

    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") sendHeartbeat();
    }, HEARTBEAT_INTERVAL_MS);

    function handleVisibilityChange() {
      if (document.visibilityState === "hidden") sendHeartbeat();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", sendHeartbeat);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", sendHeartbeat);
    };
  }, []);

  return null;
}
