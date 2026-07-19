import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Same-origin /api proxy so the HttpOnly refresh-token cookie is always
  // first-party (cross-site cookies to the raw API Gateway URL are dropped
  // by browsers, which kills session refresh — the prod login loop).
  //
  // - Dev: proxies to the local Flask server (the docker dev API listens on
  //   :5001). Leave NEXT_PUBLIC_BACKENDURL unset in .env.local.
  // - Prod (Vercel): set BACKEND_ORIGIN to the backend base URL *including
  //   any stage prefix*, e.g.
  //   https://btl4e6jswl.execute-api.us-east-1.amazonaws.com/production
  //   and REMOVE NEXT_PUBLIC_BACKENDURL so axios uses same-origin paths.
  //   As a safety net, production builds ignore NEXT_PUBLIC_BACKENDURL
  //   entirely (see configureAxios in app/util/auth.tsx).
  async rewrites() {
    const target =
      process.env.BACKEND_ORIGIN ??
      (process.env.NODE_ENV === "development" ? "http://127.0.0.1:5001" : null);
    if (!target) return [];
    return [
      {
        source: "/api/:path*",
        destination: `${target}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
