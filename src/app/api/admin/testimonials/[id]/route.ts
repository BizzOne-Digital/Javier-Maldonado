import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { apiSuccess, apiError, handleApiError, sanitizeInput } from "@/lib/api-utils";
import { testimonialSchema } from "@/lib/validations";
import Testimonial from "@/models/Testimonial";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { admin, error } = await requireAdmin();
    if (!admin) return error!;

    const { id } = await params;
    await connectDB();

    const testimonial = await Testimonial.findById(id).lean();
    if (!testimonial) {
      return apiError("Testimonial not found", 404);
    }

    return apiSuccess(testimonial);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { admin, error } = await requireAdmin();
    if (!admin) return error!;

    const { id } = await params;
    const body = sanitizeInput(await req.json());
    const data = testimonialSchema.partial().parse(body);

    await connectDB();
    const testimonial = await Testimonial.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!testimonial) {
      return apiError("Testimonial not found", 404);
    }

    return apiSuccess(testimonial);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { admin, error } = await requireAdmin();
    if (!admin) return error!;

    const { id } = await params;
    await connectDB();

    const testimonial = await Testimonial.findByIdAndDelete(id);
    if (!testimonial) {
      return apiError("Testimonial not found", 404);
    }

    return apiSuccess({ message: "Testimonial deleted" });
  } catch (error) {
    return handleApiError(error);
  }
}
