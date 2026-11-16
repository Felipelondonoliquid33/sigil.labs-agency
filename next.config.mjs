/** @type {import('next').NextConfig} */
import { fileURLToPath } from "node:url";

const nextConfig = {
  outputFileTracingRoot: fileURLToPath(new URL(".", import.meta.url)),
  distDir: process.env.SIGIL_BUILD_DIR || ".next",
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  async rewrites() {
    // El artículo es una carpeta estática en public/blog/<slug>/: la URL limpia sirve su index.html.
    return {
      beforeFiles: [
        { source: "/blog/generacion-rebusque", destination: "/blog/generacion-rebusque/index.html" },
      ],
    };
  },
  async redirects() {
    // URLs cortas para compartir.
    return [{ source: "/rebusque", destination: "/blog/generacion-rebusque", permanent: false }];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://*.analytics.google.com https://*.vercel-insights.com; img-src 'self' data: blob: https:; style-src 'self' 'unsafe-inline'; font-src 'self' data: https:; media-src 'self' blob: https:; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'; upgrade-insecure-requests" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
      {
        // JS y CSS del artículo van versionados con ?v=hash: caché largo. Imágenes y librerías: una semana.
        source: "/blog/:slug/:dir(js|css)/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/blog/:slug/:dir(media|vendor|fonts)/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800" }],
      },
    ];
  },
};

export default nextConfig;
