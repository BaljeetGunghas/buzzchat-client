import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['randomuser.me', "res.cloudinary.com"], // ✅ Add allowed external image domains here
  },
};

export default nextConfig;