import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

const locales = ["en", "es"] as const;

const staticPages = [
  "",
  "/about",
  "/buy",
  "/sell",
  "/rent",
  "/invest",
  "/listings",
  "/areas",
  "/calculators",
  "/calculators/mortgage",
  "/calculators/purchase",
  "/calculators/cmhc",
  "/calculators/land-transfer-tax",
  "/calculators/home-worth",
  "/resources",
  "/testimonials",
  "/booking",
  "/team",
  "/contact",
  "/privacy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.domain;
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const page of staticPages) {
      entries.push({
        url: `${base}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === "" ? "weekly" : "monthly",
        priority: page === "" ? 1 : 0.8,
        alternates: {
          languages: {
            en: `${base}/en${page}`,
            es: `${base}/es${page}`,
          },
        },
      });
    }
  }

  return entries;
}
