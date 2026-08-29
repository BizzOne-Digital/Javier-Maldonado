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

interface LocalImageFieldProps {
  label: string;
  folder: UploadFolder;
  value: string;
  onChange: (url: string) => void;
  className?: string;
}

export function LocalImageField({
  label,
  folder,
  value,
  onChange,
  className,
}: LocalImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useAdminToast();
  const [uploading, setUploading] = useState(false);

  const removeStoredImage = async (url: string) => {
    if (!isStoredUploadUrl(url)) return;
    await deleteStoredUpload(url);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploading(true);
    const previousUrl = value;

    try {
      const result = await uploadImageToStorage(file, folder);
      if (!result.success) {
        showToast(result.error || "Upload failed", "error");
        return;
      }

      if (previousUrl && previousUrl !== result.url) {
        await removeStoredImage(previousUrl);
      }

      onChange(result.url);
      showToast("Image uploaded");
    } catch {
      showToast("Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (!value) return;

    if (isStoredUploadUrl(value)) {
      await removeStoredImage(value);
    }

    onChange("");
    showToast("Image removed");
  };

  return (
    <div className={cn("space-y-2", className)}>
      <label className={labelClass}>{label}</label>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />

      {value ? (
        <div className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-3">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-ivory">
            <Image
              src={value}
              alt={label}
              fill
              unoptimized={isStoredUploadUrl(value)}
              className="object-cover"
              sizes="96px"
            />
          </div>

          <div className="min-w-0 flex-1 space-y-2">
            <p className="truncate text-xs text-midnight/60">{value}</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={uploading}
                onClick={() => inputRef.current?.click()}
                className="rounded-lg border border-lake/30 px-3 py-1.5 text-xs font-semibold text-lake hover:bg-lake/5 disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Replace"}
              </button>
              <button
                type="button"
                disabled={uploading}
                onClick={handleRemove}
                className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-sm text-midnight/70 transition-colors hover:border-lake hover:bg-lake/5 disabled:opacity-50"
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-lake" />
              Uploading...
            </>
          ) : (
            <>
              <ImagePlus className="h-4 w-4 text-lake" />
              Choose image
            </>
          )}
        </button>
      )}
    </div>
  );
}
