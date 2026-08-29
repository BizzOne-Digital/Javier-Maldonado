import slugify from "slugify";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { apiSuccess, apiError, handleApiError, sanitizeInput } from "@/lib/api-utils";
import { resourceSchema } from "@/lib/validations";
import Resource from "@/models/Resource";

export async function GET() {
  try {
    const { admin, error } = await requireAdmin();
    if (!admin) return error!;

    await connectDB();
    const resources = await Resource.find().sort({ createdAt: -1 }).lean();
    return apiSuccess(resources);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: Request) {
  try {
    const { admin, error } = await requireAdmin();
    if (!admin) return error!;

    const body = sanitizeInput(await req.json());
    const data = resourceSchema.parse(body);

    const slug =
      data.slug ||
      slugify(data.en?.title || "resource", { lower: true, strict: true });

    await connectDB();
    const existing = await Resource.findOne({ slug });
    if (existing) {
      return apiError("A resource with this slug already exists", 409);
    }

    const resource = await Resource.create({ ...data, slug });
    return apiSuccess(resource, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
