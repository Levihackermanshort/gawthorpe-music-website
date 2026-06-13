import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /* Other configurations can be added if needed */
  webpack: (config, { dev }) => {
    if (dev) {
      // Disable persistent disk caching in development to prevent ENOENT webpack cache write panics
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
