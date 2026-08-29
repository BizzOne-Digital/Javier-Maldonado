import type { UploadFolder } from "@/models/StoredUpload";

export type UploadResponse = {
  success: true;
  url: string;
  filename: string;
  size: number;
  folder: UploadFolder;
};

export type UploadErrorResponse = {
  success: false;
  error: string;
};

export async function uploadImageToStorage(
  file: File,
  folder: UploadFolder
): Promise<UploadResponse | UploadErrorResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const res = await fetch("/api/upload", {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  return res.json();
}

export async function deleteStoredUpload(url: string): Promise<boolean> {
  const res = await fetch("/api/upload", {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  if (!res.ok) return false;
  const json = (await res.json()) as { success?: boolean };
  return Boolean(json.success);
}

/** @deprecated Use uploadImageToStorage for admin images */
export async function uploadFile(file: File, folder = "misc") {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const res = await fetch("/api/admin/upload", {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  return res.json() as Promise<
    | {
        success: true;
        data?: { url: string; publicId: string };
        url?: string;
        filename?: string;
      }
    | { success: false; error: string }
  >;
}
