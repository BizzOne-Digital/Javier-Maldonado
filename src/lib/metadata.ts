import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

type Locale = "en" | "es";

interface PageMetadataOptions {
  title: string;
  description: string;
  path: string;
  locale: Locale;
  noIndex?: boolean;
}

export function createPageMetadata({
  title,
  description,
  path,
  locale,
  noIndex,
}: PageMetadataOptions): Metadata {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${siteConfig.domain}/${locale}${normalizedPath === "/" ? "" : normalizedPath}`;

  return {
    title: `${title} | ${siteConfig.title}`,
    description,
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.title,
      locale: locale === "es" ? "es_CA" : "en_CA",
      type: "website",
    },
    alternates: {
      canonical: url,
      languages: {
        en: `${siteConfig.domain}/en${normalizedPath === "/" ? "" : normalizedPath}`,
        es: `${siteConfig.domain}/es${normalizedPath === "/" ? "" : normalizedPath}`,
      },
    },
  };
}
