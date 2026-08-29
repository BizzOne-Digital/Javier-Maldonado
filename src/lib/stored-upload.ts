import { randomBytes } from "crypto";
import { connectDB } from "@/lib/db";
import StoredUpload, { type UploadFolder } from "@/models/StoredUpload";

export const UPLOAD_FOLDERS: UploadFolder[] = [
  "products",
  "gallery",
  "pages",
  "misc",
];

export const ALLOWED_IMAGE_MIMES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export function isUploadFolder(value: string): value is UploadFolder {
  return UPLOAD_FOLDERS.includes(value as UploadFolder);
}

export function sanitizeUploadSegment(value: string): string | null {
  if (!value || value.includes("..") || value.includes("/") || value.includes("\\")) {
    return null;
  }
  return value;
}

export function buildUploadUrl(folder: UploadFolder, filename: string): string {
  return `/api/uploads/${folder}/${filename}`;
}

export function parseUploadUrl(
  url: string
): { folder: UploadFolder; filename: string } | null {
  const match = url.match(/^\/api\/uploads\/([^/]+)\/([^/]+)$/);
  if (!match) return null;

  const folder = match[1];
  const filename = match[2];

  if (!isUploadFolder(folder) || !sanitizeUploadSegment(filename)) {
    return null;
  }

  return { folder, filename };
}

export function generateUploadFilename(mimeType: string): string {
  const ext = MIME_TO_EXT[mimeType];
  if (!ext) {
    throw new Error("Unsupported mime type");
  }
  return `${Date.now()}-${randomBytes(8).toString("hex")}.${ext}`;
}

export async function saveStoredUpload(input: {
  folder: UploadFolder;
  mimeType: string;
  buffer: Buffer;
}) {
  await connectDB();

  const filename = generateUploadFilename(input.mimeType);

  const doc = await StoredUpload.create({
    folder: input.folder,
    filename,
    mimeType: input.mimeType,
    size: input.buffer.length,
    data: input.buffer,
  });

  return {
    folder: doc.folder,
    filename: doc.filename,
    mimeType: doc.mimeType,
    size: doc.size,
    url: buildUploadUrl(doc.folder, doc.filename),
  };
}

export async function getStoredUpload(folder: UploadFolder, filename: string) {
  await connectDB();
  return StoredUpload.findOne({ folder, filename }).lean();
}

export async function deleteStoredUploadByUrl(url: string): Promise<boolean> {
  const parsed = parseUploadUrl(url);
  if (!parsed) return false;

  await connectDB();
  const result = await StoredUpload.deleteOne({
    folder: parsed.folder,
    filename: parsed.filename,
  });

  return result.deletedCount > 0;
}

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_MIMES.has(file.type)) {
    return "Only JPEG, PNG, WebP, and GIF images are allowed";
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return "Image must be 8MB or smaller";
  }
  return null;
}
