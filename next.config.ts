import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A lockfile in a parent directory otherwise makes Next infer the wrong workspace root.
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
