import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  devIndicators: false,
  // eslint : {
  //   ignoreDuringBuilds : true
  // },
  typescript : {
    ignoreBuildErrors : true
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // works for app router
    },
  },
};

export default nextConfig;
