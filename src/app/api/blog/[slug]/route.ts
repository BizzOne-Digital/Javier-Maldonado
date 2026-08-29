import { connectDB } from "@/lib/db";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-utils";
import BlogPost from "@/models/BlogPost";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await connectDB();

    const post = await BlogPost.findOne({ slug, published: true }).lean();
    if (!post) {
      return apiError("Blog post not found", 404);
    }

    return apiSuccess(post);
  } catch (error) {
    return handleApiError(error);
  }
}
