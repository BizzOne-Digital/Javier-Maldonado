import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { apiSuccess, apiError, handleApiError, sanitizeInput } from "@/lib/api-utils";
import { bookingQuerySchema, bookingUpdateSchema } from "@/lib/validations";
import Booking from "@/models/Booking";

export async function GET(req: Request) {
  try {
    const { admin, error } = await requireAdmin();
    if (!admin) return error!;

    const { searchParams } = new URL(req.url);
    const query = bookingQuerySchema.parse(Object.fromEntries(searchParams));

    const filter: Record<string, unknown> = {};
    if (query.status) filter.status = query.status;

    await connectDB();
    const skip = (query.page - 1) * query.limit;

    const [bookings, total] = await Promise.all([
      Booking.find(filter).sort({ createdAt: -1 }).skip(skip).limit(query.limit).lean(),
      Booking.countDocuments(filter),
    ]);

    return apiSuccess({
      bookings,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(req: Request) {
  try {
    const { admin, error } = await requireAdmin();
    if (!admin) return error!;

    const body = sanitizeInput(await req.json());
    const { id, status, internalNotes } = bookingUpdateSchema.parse(body);

    await connectDB();
    const booking = await Booking.findByIdAndUpdate(
      id,
      { ...(status && { status }), ...(internalNotes !== undefined && { internalNotes }) },
      { new: true, runValidators: true }
    );

    if (!booking) {
      return apiError("Booking not found", 404);
    }

    return apiSuccess(booking);
  } catch (error) {
    return handleApiError(error);
  }
}
