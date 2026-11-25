"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { FlatOverrides, SiteConfig, SiteImages } from "@/lib/site-content";
import { siteConfig as defaultConfig } from "@/config/site";

export interface SiteContextValue {
  siteConfig: SiteConfig;
  /** Overrides for the hardcoded label trees (keys without the "labels." prefix). */
  labelOverrides: { en: FlatOverrides; es: FlatOverrides };
  images: SiteImages;
}

const fallback: SiteContextValue = {
  siteConfig: { ...defaultConfig, serviceAreas: [...defaultConfig.serviceAreas] },
  labelOverrides: { en: {}, es: {} },
  images: { logo: "/logo.png", heroBackground: "/hero-bg.png", aboutImage: "" },
};

const SiteContext = createContext<SiteContextValue>(fallback);

export function SiteContextProvider({
  value,
  children,
}: {
  value: SiteContextValue;
  children: ReactNode;
}) {
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export const useSiteContext = () => useContext(SiteContext);
export const useSiteConfig = () => useContext(SiteContext).siteConfig;
export const useSiteImages = () => useContext(SiteContext).images;
