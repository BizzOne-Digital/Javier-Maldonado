// Client-safe helpers (no database imports).
export const IMAGE_SLOTS = [
  { key: "logo", label: "Logo", fallback: "/logo.png" },
  { key: "heroBackground", label: "Home hero background", fallback: "/hero-bg.png" },
  { key: "aboutImage", label: "About page image (optional, replaces logo panel)", fallback: "" },
] as const;
export type ImageSlotKey = (typeof IMAGE_SLOTS)[number]["key"];
export type SiteImages = Record<ImageSlotKey, string>;

/** MongoDB-safe key encoding (dots are not allowed in stored object keys). */
export const encodeKey = (k: string) => k.replace(/\./g, "~");
export const decodeKey = (k: string) => k.replace(/~/g, ".");


export type Section = { heading: string; body: string };
