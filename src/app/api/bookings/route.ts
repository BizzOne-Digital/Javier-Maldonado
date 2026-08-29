import { connectDB } from "@/lib/db";
import { apiSuccess, handleApiError, sanitizeInput } from "@/lib/api-utils";
import { bookingCreateSchema } from "@/lib/validations";
import { notifyBookingSubmission } from "@/lib/notifications";
import Booking from "@/models/Booking";

export async function POST(req: Request) {
  try {
    const body = sanitizeInput(await req.json());
    const data = bookingCreateSchema.parse(body);

    await connectDB();
    const booking = await Booking.create(data);

    await notifyBookingSubmission({
      name: booking.name,
      email: booking.email,
      phone: booking.phone,
      consultationType: booking.consultationType,
      preferredDate: booking.preferredDate,
      preferredTime: booking.preferredTime,
      message: booking.message,
    });

    return apiSuccess({ id: booking._id, message: "Booking request submitted" }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
