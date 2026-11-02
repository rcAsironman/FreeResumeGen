import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["licensing-merge-overnight-resource.trycloudflare.com"],
  distDir: process.env.NEXT_DIST_DIR ?? (process.env.NODE_ENV === "development" ? ".next-dev" : ".next"),
};

export default nextConfig;
