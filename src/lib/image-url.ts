export const PLACEHOLDER_IMAGE = "/placeholder-image.svg";

export function isLegacyUploadUrl(url: string): boolean {
  return (
    url.startsWith("/uploads/") ||
    url.startsWith("uploads/") ||
    url.includes("/public/uploads/")
  );
}

export function isStoredUploadUrl(url: string): boolean {
  return url.startsWith("/api/uploads/");
}

/** Resolve a content image URL, falling back for missing or legacy disk paths. */
export function resolveImageSrc(url?: string | null): string {
  if (!url || !url.trim()) return PLACEHOLDER_IMAGE;
  if (isLegacyUploadUrl(url)) return PLACEHOLDER_IMAGE;
  return url;
}
