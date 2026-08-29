import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { apiSuccess, handleApiError, sanitizeInput } from "@/lib/api-utils";
import { testimonialSchema } from "@/lib/validations";
import Testimonial from "@/models/Testimonial";

export async function GET() {
  try {
    const { admin, error } = await requireAdmin();
    if (!admin) return error!;

    await connectDB();
    const testimonials = await Testimonial.find().sort({ order: 1, createdAt: -1 }).lean();
    return apiSuccess(testimonials);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: Request) {
  try {
    const { admin, error } = await requireAdmin();
    if (!admin) return error!;

    const body = sanitizeInput(await req.json());
    const data = testimonialSchema.parse(body);

    await connectDB();
    const testimonial = await Testimonial.create(data);
    return apiSuccess(testimonial, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
