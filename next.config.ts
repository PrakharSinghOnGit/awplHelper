import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  fastRefresh: true,
  concurrentFeatures: true,
  productionBrowserSourceMaps: false, // Disable source maps in development
  optimizeFonts: false, // Disable font optimization
  minify: false, // Disable minification

  /* config options here */
};

export default nextConfig;
