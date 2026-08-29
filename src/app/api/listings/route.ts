import { connectDB } from "@/lib/db";
import { apiSuccess, handleApiError } from "@/lib/api-utils";
import { listingQuerySchema } from "@/lib/validations";
import Listing from "@/models/Listing";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = listingQuerySchema.parse(Object.fromEntries(searchParams));

    const filter: Record<string, unknown> = { published: true };

    if (query.city) filter.city = new RegExp(query.city, "i");
    if (query.status) filter.status = query.status;
    if (query.type) filter.propertyType = new RegExp(query.type, "i");
    if (query.beds) filter.bedrooms = { $gte: query.beds };
    if (query.baths) filter.bathrooms = { $gte: query.baths };

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      filter.price = {};
      if (query.minPrice !== undefined) (filter.price as Record<string, number>).$gte = query.minPrice;
      if (query.maxPrice !== undefined) (filter.price as Record<string, number>).$lte = query.maxPrice;
    }

    const sortMap: Record<string, Record<string, 1 | -1>> = {
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
    };
    const sort = sortMap[query.sort] || sortMap.newest;

    await connectDB();
    const skip = (query.page - 1) * query.limit;

    const [listings, total] = await Promise.all([
      Listing.find(filter).sort(sort).skip(skip).limit(query.limit).lean(),
      Listing.countDocuments(filter),
    ]);

    return apiSuccess({
      listings,
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
