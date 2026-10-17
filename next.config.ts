import type { NextConfig } from "next";

const weekCache = "public, max-age=604800, stale-while-revalidate=2592000";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  trailingSlash: false,
  experimental: {
    // CSS goes into the HTML: no render-blocking stylesheet request, faster FCP/LCP.
    inlineCss: true,
  },
  async redirects() {
    return [
      // Apex → www happens in the Vercel domain settings. These keep old/short links working.
      { source: "/whatsapp", destination: "/#enquire", permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: "/:file(favicon.ico|icon.svg|icon-192.png|icon-512.png|apple-icon.png|og.jpg)",
        headers: [{ key: "Cache-Control", value: weekCache }],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      { source: "/api/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex" }] },
    ];
  },
};

export default nextConfig;
