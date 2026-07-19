import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Some Flask endpoints are slash-terminated (/api/resumes/, /api/admin/).
  // Without this, Next 308-redirects them to the slashless form BEFORE the
  // /api rewrite runs, and the redirect chain through API Gateway drops the
  // stage prefix — resume upload/download broke in prod this way. Flask
  // accepts both forms (strict_slashes disabled in create_app).
  skipTrailingSlashRedirect: true,
  // Same-origin /api proxy so the HttpOnly refresh-token cookie is always
  // first-party (cross-site cookies to the raw API Gateway URL are dropped
  // by browsers, which kills session refresh — the prod login loop).
  //
  // - Dev: proxies to the local Flask server (the docker dev API listens on
  //   :5001). Leave NEXT_PUBLIC_BACKENDURL unset in .env.local.
  // - Prod (Vercel): BACKEND_ORIGIN overrides the backend base URL
  //   (including any stage prefix). When unset, production builds fall back
  //   to the live Lambda stage below — an unset env var must degrade to the
  //   working backend, not to rewrites:[] (which 404s every /api call on
  //   the deployed site). Production builds also ignore
  //   NEXT_PUBLIC_BACKENDURL entirely (see configureAxios in
  //   app/util/auth.tsx).
  async rewrites() {
    const target =
      process.env.BACKEND_ORIGIN ??
      (process.env.NODE_ENV === "development"
        ? "http://127.0.0.1:5001"
        : "https://btl4e6jswl.execute-api.us-east-1.amazonaws.com/production");
    return [
      {
        source: "/api/:path*",
        destination: `${target}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
