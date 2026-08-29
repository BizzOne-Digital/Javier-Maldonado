import { connectDB } from "@/lib/db";
import { apiSuccess, handleApiError } from "@/lib/api-utils";
import BlogPost from "@/models/BlogPost";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") || 12)));
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = { published: true };
    if (category) filter.category = category;

    await connectDB();
    const [posts, total] = await Promise.all([
      BlogPost.find(filter)
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-en.content -es.content")
        .lean(),
      BlogPost.countDocuments(filter),
    ]);

    return apiSuccess({
      posts,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
