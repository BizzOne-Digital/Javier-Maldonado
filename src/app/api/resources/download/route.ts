import { connectDB } from "@/lib/db";
import { cloudinary } from "@/lib/cloudinary";
import { apiSuccess, apiError, handleApiError, sanitizeInput } from "@/lib/api-utils";
import { resourceDownloadSchema } from "@/lib/validations";
import { notifyLeadSubmission } from "@/lib/notifications";
import Resource from "@/models/Resource";
import Lead from "@/models/Lead";

export async function POST(req: Request) {
  try {
    const body = sanitizeInput(await req.json());
    const data = resourceDownloadSchema.parse(body);

    await connectDB();
    const resource = await Resource.findOne({ slug: data.slug, published: true });
    if (!resource) {
      return apiError("Resource not found", 404);
    }

    await Lead.create({
      type: "resource-download",
      name: data.name,
      email: data.email,
      phone: data.phone,
      language: data.language,
      metadata: {
        resourceSlug: resource.slug,
        resourceTitle: resource.en?.title || resource.slug,
      },
    });

    await Resource.findByIdAndUpdate(resource._id, { $inc: { downloadCount: 1 } });

    await notifyLeadSubmission({
      type: "resource-download",
      name: data.name,
      email: data.email,
      phone: data.phone,
      metadata: {
        resourceSlug: resource.slug,
        resourceTitle: resource.en?.title || resource.slug,
      },
    });

    let downloadUrl = resource.fileUrl;
    if (resource.publicId) {
      downloadUrl = cloudinary.url(resource.publicId, {
        resource_type: "raw",
        type: "upload",
        sign_url: true,
        secure: true,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
      });
    }

    return apiSuccess({ downloadUrl });
  } catch (error) {
    return handleApiError(error);
  }
}
