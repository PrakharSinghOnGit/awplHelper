import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["avatars.githubusercontent.com"],
  },
  reactStrictMode: false,
  devIndicators: false,
};

export default nextConfig;
