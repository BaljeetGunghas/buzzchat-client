import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   images: {
    domains: ['randomuser.me'], // ✅ Add allowed external image domains here
  },
};

export default nextConfig;
