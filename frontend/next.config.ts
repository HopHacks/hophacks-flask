import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // In dev, proxy API calls to the local Flask backend so requests stay
  // same-origin and the HttpOnly refresh-token cookie works (frontend-old
  // used CRA's "proxy" field for the same purpose). Leave
  // NEXT_PUBLIC_BACKENDURL unset in .env.local to use this. In prod the env
  // var is set and axios calls the backend directly, bypassing the rewrite.
  async rewrites() {
    if (process.env.NODE_ENV !== "development") return [];
    return [
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:5000/api/:path*",
      },
    ];
  },
};

export default nextConfig;
