import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  experimental: {
    ppr: false,
  },
};

export default nextConfig;