import path from "node:path";
import type { NextConfig } from "next";

// Derived from the env var rather than hardcoded, so it doesn't silently break if
// the Supabase project is ever recreated under a different ref.
const supabaseHostname = process.env.SUPABASE_URL
  ? new URL(process.env.SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  // A lockfile in a parent directory otherwise makes Next infer the wrong workspace root.
  outputFileTracingRoot: path.join(__dirname),
  images: {
    remotePatterns: supabaseHostname
      ? [{ protocol: "https", hostname: supabaseHostname }]
      : [],
  },
};

export default nextConfig;
