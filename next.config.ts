import type { NextConfig } from "next";

const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig: NextConfig = {
  // Silencing Turbopack error since we use webpack-based PWA plugin
  // @ts-ignore
  turbopack: {}
};

export default withPWA(nextConfig);
