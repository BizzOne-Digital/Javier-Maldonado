import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { apiSuccess, apiError, handleApiError, sanitizeInput } from "@/lib/api-utils";
import { listingUpdateSchema } from "@/lib/validations";
import Listing from "@/models/Listing";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { admin, error } = await requireAdmin();
    if (!admin) return error!;

    const { id } = await params;
    const body = sanitizeInput(await req.json());
    const data = listingUpdateSchema.parse(body);

    await connectDB();
    const listing = await Listing.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!listing) {
      return apiError("Listing not found", 404);
    }

    return apiSuccess(listing);
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

    const listing = await Listing.findByIdAndDelete(id);
    if (!listing) {
      return apiError("Listing not found", 404);
    }

    return apiSuccess({ message: "Listing deleted" });
  } catch (error) {
    return handleApiError(error);
  }
}
