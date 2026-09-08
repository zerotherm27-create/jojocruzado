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
  experimental: {
    serverActions: {
      // Default is 1MB, which a single real photo already exceeds — the Site
      // Settings form can submit up to three photos (hero/story/about) in one
      // Server Action call, hence the 413 crash on /admin/settings in production.
      bodySizeLimit: "15mb",
    },
  },
};

export default nextConfig;
