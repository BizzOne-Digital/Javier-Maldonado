import { connectDB } from "@/lib/db";
import { apiSuccess, handleApiError } from "@/lib/api-utils";
import Testimonial from "@/models/Testimonial";

export async function GET() {
  try {
    await connectDB();
    const testimonials = await Testimonial.find({ published: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();
    return apiSuccess(testimonials);
  } catch (error) {
    return handleApiError(error);
  }
}
