import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hophacks-organizers.s3.us-east-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "hophacks-website.s3.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
