import slugify from "slugify";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { apiSuccess, apiError, handleApiError, sanitizeInput } from "@/lib/api-utils";
import { listingCreateSchema } from "@/lib/validations";
import Listing from "@/models/Listing";

export async function GET(req: Request) {
  try {
    const { admin, error } = await requireAdmin();
    if (!admin) return error!;

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") || 20)));
    const skip = (page - 1) * limit;

    await connectDB();
    const [listings, total] = await Promise.all([
      Listing.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Listing.countDocuments(),
    ]);

    return apiSuccess({
      listings,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: Request) {
  try {
    const { admin, error } = await requireAdmin();
    if (!admin) return error!;

    const body = sanitizeInput(await req.json());
    const data = listingCreateSchema.parse(body);

    const slug =
      data.slug ||
      slugify(`${data.address}-${data.city}`, { lower: true, strict: true });

    await connectDB();
    const existing = await Listing.findOne({ slug });
    if (existing) {
      return apiError("A listing with this slug already exists", 409);
    }

    const listing = new Listing({ ...data, slug });
    await listing.save();
    return apiSuccess(listing, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
