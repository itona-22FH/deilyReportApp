import type { NextConfig } from "next";

const nextConfig: NextConfig = {
};

module.exports = {
  webpack(config: { resolve: { extensions: string[]; }; }) {
    config.resolve.extensions.push('.mjs');  // .mjs を明示的に解決する設定を追加
    return config;
  },
};

// next.config.js
module.exports = {
  reactStrictMode: false,
};

export default nextConfig;
