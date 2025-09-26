import type { NextConfig } from "next";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jkxkpilohakkbpgrbxgg.supabase.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "0.0.0.0",
        port: "8005",
        pathname: "/api/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8005",
        pathname: "/api/**",
      },
    ],
  },
  reactStrictMode: true,
};
module.exports = nextConfig;
