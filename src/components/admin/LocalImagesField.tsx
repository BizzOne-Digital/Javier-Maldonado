"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { useAdminToast } from "@/components/admin/AdminToastProvider";
import { labelClass } from "@/components/admin/form-styles";
import {
  deleteStoredUpload,
  uploadImageToStorage,
} from "@/lib/admin-upload";
import { isStoredUploadUrl } from "@/lib/image-url";
import type { UploadFolder } from "@/models/StoredUpload";
import { cn } from "@/lib/utils";

export interface StoredImageItem {
  url: string;
  order: number;
}

interface LocalImagesFieldProps {
  label: string;
  folder: UploadFolder;
  value: StoredImageItem[];
  onChange: (images: StoredImageItem[]) => void;
  className?: string;
}

export function LocalImagesField({
  label,
  folder,
  value,
  onChange,
  className,
}: LocalImagesFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useAdminToast();
  const [uploading, setUploading] = useState(false);

  const sorted = [...value].sort((a, b) => a.order - b.order);

  const handleAdd = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploading(true);
    try {
      const result = await uploadImageToStorage(file, folder);
      if (!result.success) {
        showToast(result.error || "Upload failed", "error");
        return;
      }

      onChange([
        ...value,
        { url: result.url, order: value.length },
      ]);
      showToast("Image uploaded");
    } catch {
      showToast("Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async (index: number) => {
    const item = sorted[index];
    if (!item) return;

    if (isStoredUploadUrl(item.url)) {
      await deleteStoredUpload(item.url);
    }

    const next = sorted
      .filter((_, i) => i !== index)
      .map((image, order) => ({ ...image, order }));

    onChange(next);
    showToast("Image removed");
  };

  return (
    <div className={cn("space-y-3", className)}>
      <label className={labelClass}>{label}</label>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={handleAdd}
      />

      {sorted.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {sorted.map((item, index) => (
            <div
              key={`${item.url}-${index}`}
              className="relative overflow-hidden rounded-xl border border-gray-200 bg-white"
            >
              <div className="relative aspect-[4/3] bg-ivory">
                <Image
                  src={item.url}
                  alt={`${label} ${index + 1}`}
                  fill
                  unoptimized={isStoredUploadUrl(item.url)}
                  className="object-cover"
                  sizes="160px"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute right-2 top-2 rounded-full bg-red-600 p-1.5 text-white shadow hover:bg-red-700"
                aria-label="Remove image"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-4 text-sm text-midnight/70 transition-colors hover:border-lake hover:bg-lake/5 disabled:opacity-50"
      >
        {uploading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-lake" />
            Uploading...
          </>
        ) : (
          <>
            <ImagePlus className="h-4 w-4 text-lake" />
            Add image
          </>
        )}
      </button>
    </div>
  );
}
