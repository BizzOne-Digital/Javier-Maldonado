import { cache } from "react";
import { connectDB } from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";
import { siteConfig } from "@/config/site";
import { IMAGE_SLOTS, decodeKey, type Section, type SiteImages } from "@/lib/site-content-shared";

export type Locale = "en" | "es";
export type SiteConfig = Omit<typeof siteConfig, "serviceAreas"> & {
  serviceAreas: string[];
};
/** Flat map: dotted message path -> overriding value (string or string[]). */
export type OverrideValue = string | string[] | Section[];
export type FlatOverrides = Record<string, OverrideValue>;
export type ContentOverrides = Record<Locale, FlatOverrides>;

export { IMAGE_SLOTS, encodeKey, decodeKey } from "@/lib/site-content-shared";
export type { ImageSlotKey, SiteImages, Section } from "@/lib/site-content-shared";

const UNSAFE = new Set(["__proto__", "constructor", "prototype"]);

export const readSettings = cache(
  async (): Promise<Record<string, Record<string, unknown>>> => {
    try {
      await connectDB();
      const rows = await SiteSettings.find().lean();
      const out: Record<string, Record<string, unknown>> = {};
      for (const row of rows) out[row.key] = (row.value ?? {}) as Record<string, unknown>;
      return out;
    } catch {
      return {};
    }
  }
);

const str = (v: unknown, fallback: string) =>
  typeof v === "string" && v.trim() ? v.trim() : fallback;

export async function getSiteConfig(): Promise<SiteConfig> {
  const s = await readSettings();
  const c = s.contact ?? {};
  const soc = s.social ?? {};
  const site = s.site ?? {};

  const phone = str(c.phone, siteConfig.phone);
  const street = str(c.street, siteConfig.address.street);
  const city = str(c.city, siteConfig.address.city);
  const province = str(c.province, siteConfig.address.province);
  const postal = str(c.postal, siteConfig.address.postal);

  const areasRaw = site.serviceAreas;
  const areas = Array.isArray(areasRaw)
    ? areasRaw.map((a) => String(a).trim()).filter(Boolean)
    : [];

  return {
    ...siteConfig,
    name: str(site.name, siteConfig.name),
    title: str(site.title, siteConfig.title),
    domain: str(site.domain, siteConfig.domain).replace(/\/$/, ""),
    phone,
    phoneHref: `tel:+${phone.replace(/\D/g, "")}`,
    email: str(c.email, siteConfig.email),
    brokerage: str(c.brokerage, siteConfig.brokerage),
    address: {
      street,
      city,
      province,
      postal,
      full: `${street}, ${city}, ${province} ${postal}`,
    },
    social: {
      instagram: str(soc.instagram, siteConfig.social.instagram),
      facebook: str(soc.facebook, siteConfig.social.facebook),
      linkedin: str(soc.linkedin, siteConfig.social.linkedin),
    },
    serviceAreas: areas.length ? areas : [...siteConfig.serviceAreas],
    disclaimer: str(site.disclaimer, siteConfig.disclaimer),
  };
}

export async function getSiteImages(): Promise<SiteImages> {
  const s = await readSettings();
  const img = s.images ?? {};
  const out = {} as SiteImages;
  for (const slot of IMAGE_SLOTS) out[slot.key] = str(img[slot.key], slot.fallback);
  return out;
}

export async function getContentOverrides(): Promise<ContentOverrides> {
  const s = await readSettings();
  const raw = (s.content ?? {}) as Partial<Record<Locale, Record<string, unknown>>>;
  const result: ContentOverrides = { en: {}, es: {} };
  for (const locale of ["en", "es"] as const) {
    for (const [k, v] of Object.entries(raw[locale] ?? {})) {
      if (typeof v === "string") result[locale][decodeKey(k)] = v;
      else if (Array.isArray(v)) {
        if (v.every((i) => typeof i === "object" && i)) {
          result[locale][decodeKey(k)] = (v as Record<string, unknown>[]).map((i) => ({
            heading: String(i.heading ?? ""),
            body: String(i.body ?? ""),
          }));
        } else {
          result[locale][decodeKey(k)] = v.map(String);
        }
      }
    }
  }
  return result;
}

/** Deep-clone `messages` and apply overrides whose path already exists with the same shape. */
export function applyOverrides(
  messages: Record<string, unknown>,
  overrides: FlatOverrides
): Record<string, unknown> {
  const clone = structuredClone(messages);
  for (const [path, value] of Object.entries(overrides)) {
    const parts = path.split(".");
    if (parts.some((p) => UNSAFE.has(p))) continue;
    let node: unknown = clone;
    for (let i = 0; i < parts.length - 1; i++) {
      node = typeof node === "object" && node ? (node as Record<string, unknown>)[parts[i]] : undefined;
    }
    if (typeof node !== "object" || !node) continue;
    const last = parts[parts.length - 1];
    const current = (node as Record<string, unknown>)[last];
    if (typeof current === "string" && typeof value === "string") {
      (node as Record<string, unknown>)[last] = value;
    } else if (Array.isArray(current) && Array.isArray(value)) {
      (node as Record<string, unknown>)[last] = value;
    }
  }
  return clone;
}

export async function getMergedMessages(locale: Locale) {
  const base = (await import(`../../messages/${locale}.json`)).default;
  const overrides = await getContentOverrides();
  return applyOverrides(base, overrides[locale]);
}
