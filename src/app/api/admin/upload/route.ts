import { requireAdmin } from "@/lib/admin-auth";
import { apiError, handleApiError } from "@/lib/api-utils";
import { uploadImage } from "@/lib/cloudinary";
import {
  deleteStoredUploadByUrl,
  isUploadFolder,
  saveStoredUpload,
  validateImageFile,
} from "@/lib/stored-upload";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Legacy admin upload route — images go to MongoDB; other files still use Cloudinary when configured. */
export async function POST(req: Request) {
  try {
    const { admin, error } = await requireAdmin();
    if (!admin) return error!;

    const formData = await req.formData();
    const file = formData.get("file");
    const folder = (formData.get("folder") as string) || "misc";

    if (!(file instanceof File)) {
      return apiError("No file provided", 400);
    }

    const imageError = validateImageFile(file);
    if (!imageError && isUploadFolder(folder)) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const saved = await saveStoredUpload({
        folder,
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
          data: {
            url: saved.url,
            publicId: saved.filename,
          },
        },
        { status: 201 }
      );
    }

    if (imageError && file.type.startsWith("image/")) {
      return apiError(imageError, 400);
    }

    const result = await uploadImage(file, folder);
    return NextResponse.json(
      {
        success: true,
        data: result,
        url: result.url,
        filename: result.publicId,
        folder,
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
