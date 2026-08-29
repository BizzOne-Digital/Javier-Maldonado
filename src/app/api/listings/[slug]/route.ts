import { connectDB } from "@/lib/db";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-utils";
import Listing from "@/models/Listing";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await connectDB();

    const listing = await Listing.findOne({ slug, published: true }).lean();
    if (!listing) {
      return apiError("Listing not found", 404);
    }

    return apiSuccess(listing);
  } catch (error) {
    return handleApiError(error);
  }
}
