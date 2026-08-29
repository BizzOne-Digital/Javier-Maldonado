import Image, { type ImageProps } from "next/image";
import { isStoredUploadUrl, resolveImageSrc } from "@/lib/image-url";

type ContentImageProps = Omit<ImageProps, "src"> & {
  src?: string | null;
};

/** Frontend image helper with legacy upload fallback and MongoDB upload support. */
export function ContentImage({ src, alt, ...props }: ContentImageProps) {
  const resolved = resolveImageSrc(typeof src === "string" ? src : "");
  const unoptimized = isStoredUploadUrl(resolved) || resolved.endsWith(".svg");

  return (
    <Image
      {...props}
      src={resolved}
      alt={alt || ""}
      unoptimized={unoptimized || props.unoptimized}
    />
  );
}
