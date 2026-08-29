import { NextResponse } from "next/server";
import { apiError } from "@/lib/api-utils";
import {
  getStoredUpload,
  isUploadFolder,
  sanitizeUploadSegment,
} from "@/lib/stored-upload";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ folder: string; filename: string }> }
) {
  const { folder: folderParam, filename: filenameParam } = await params;

  if (!isUploadFolder(folderParam)) {
    return apiError("Invalid folder", 400);
  }

  const filename = sanitizeUploadSegment(filenameParam);
  if (!filename) {
    return apiError("Invalid filename", 400);
  }

  const upload = await getStoredUpload(folderParam, filename);
  if (!upload?.data) {
    return apiError("File not found", 404);
  }

  const data =
    upload.data instanceof Buffer
      ? upload.data
      : Buffer.from(upload.data as unknown as ArrayBuffer);

  return new NextResponse(new Uint8Array(data), {
    status: 200,
    headers: {
      "Content-Type": upload.mimeType,
      "Content-Length": String(upload.size),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
