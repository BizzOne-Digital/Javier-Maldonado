import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { apiError, handleApiError } from "@/lib/api-utils";
import {
  deleteStoredUploadByUrl,
  isUploadFolder,
  saveStoredUpload,
  validateImageFile,
} from "@/lib/stored-upload";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { admin, error } = await requireAdmin();
    if (!admin) return error!;

    const formData = await req.formData();
    const file = formData.get("file");
    const folderValue = String(formData.get("folder") || "").trim();

    if (!(file instanceof File)) {
      return apiError("No file provided", 400);
    }

    if (!isUploadFolder(folderValue)) {
      return apiError("Invalid folder. Use products, gallery, pages, or misc.", 400);
    }

    const validationError = validateImageFile(file);
    if (validationError) {
      return apiError(validationError, 400);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const saved = await saveStoredUpload({
      folder: folderValue,
      mimeType: file.type,
      buffer,
    });

    return NextResponse.json(
      {
        success: true,
        url: saved.url,
        filename: saved.filename,
        size: saved.size,
        folder: saved.folder,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(req: Request) {
  try {
    const { admin, error } = await requireAdmin();
    if (!admin) return error!;

    const body = (await req.json()) as { url?: string };
    const url = body.url?.trim();

    if (!url) {
      return apiError("URL is required", 400);
    }

    const deleted = await deleteStoredUploadByUrl(url);
    if (!deleted) {
      return apiError("Upload not found", 404);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
