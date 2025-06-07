import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Firebase App HostingではAPI routesを使用できるため、static exportは無効にする
  // output: 'export',
  // trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
