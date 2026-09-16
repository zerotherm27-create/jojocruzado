import "server-only";
import type { NextRequest } from "next/server";

export type VisitorGeo = {
  country: string | null;
  region: string | null;
  city: string | null;
};

// Vercel resolves and sets these on every production request -- no separate
// IP-geolocation lookup, and the raw IP is never read or stored. Absent in
// local dev, which is fine (all three come back null there).
export function readGeo(request: NextRequest): VisitorGeo {
  return {
    country: request.headers.get("x-vercel-ip-country"),
    region: request.headers.get("x-vercel-ip-country-region"),
    city: request.headers.get("x-vercel-ip-city"),
  };
}
