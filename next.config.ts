import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // デプロイ時の型エラーを無視する設定
    ignoreBuildErrors: true,
  },
  eslint: {
    // デプロイ時のESLintエラーを無視する設定
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;