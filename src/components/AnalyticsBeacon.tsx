"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/analytics/track";

// Renders nothing -- just fires one page_view event per path, including
// client-side navigations, for src/app/admin/(dashboard)/analytics/page.tsx.
// Mounted once in src/app/(site)/layout.tsx, same tier as ChatWidget.
export default function AnalyticsBeacon() {
  const pathname = usePathname();

  useEffect(() => {
    trackEvent("page_view", pathname);
  }, [pathname]);

  return null;
}
