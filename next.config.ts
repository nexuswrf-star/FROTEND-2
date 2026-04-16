import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  experimental: {
    allowedDevOrigins: [
      'space.z.ai',
      /.+\.space\.z\.ai$/,
    ],
  },
};

export default nextConfig;
