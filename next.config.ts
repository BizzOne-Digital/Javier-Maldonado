import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

function buildRemotePatterns() {
  const patterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
    { protocol: "https", hostname: "images.unsplash.com" },
    { protocol: "https", hostname: "res.cloudinary.com" },
    { protocol: "http", hostname: "localhost", pathname: "/api/uploads/**" },
    { protocol: "https", hostname: "localhost", pathname: "/api/uploads/**" },
  ];

  const frontend = process.env.FRONTEND_URL || process.env.VERCEL_URL;
  if (frontend) {
    try {
      const normalized = frontend.startsWith("http")
        ? frontend
        : `https://${frontend}`;
      const url = new URL(normalized);
      patterns.push({
        protocol: url.protocol.replace(":", "") as "http" | "https",
        hostname: url.hostname,
        pathname: "/api/uploads/**",
      });
    } catch {
      // ignore invalid FRONTEND_URL
    }
  }

  return patterns;
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: buildRemotePatterns(),
  },
};

export default withNextIntl(nextConfig);
