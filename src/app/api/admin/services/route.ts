import slugify from "slugify";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { apiSuccess, apiError, handleApiError, sanitizeInput } from "@/lib/api-utils";
import { serviceSchema } from "@/lib/validations";
import Service from "@/models/Service";

export async function GET() {
  try {
    const { admin, error } = await requireAdmin();
    if (!admin) return error!;

    await connectDB();
    const services = await Service.find().sort({ order: 1, createdAt: -1 }).lean();
    return apiSuccess(services);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: Request) {
  try {
    const { admin, error } = await requireAdmin();
    if (!admin) return error!;

    const body = sanitizeInput(await req.json());
    const data = serviceSchema.parse(body);

    const slug =
      data.slug ||
      slugify(data.en?.title || "service", { lower: true, strict: true });

    await connectDB();
    const existing = await Service.findOne({ slug });
    if (existing) {
      return apiError("A service with this slug already exists", 409);
    }

    const service = await Service.create({ ...data, slug });
    return apiSuccess(service, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
