import { connectDB } from "@/lib/db";
import { apiSuccess, handleApiError } from "@/lib/api-utils";
import Resource from "@/models/Resource";

export async function GET() {
  try {
    await connectDB();
    const resources = await Resource.find({ published: true })
      .select("-fileUrl -publicId")
      .sort({ createdAt: -1 })
      .lean();
    return apiSuccess(resources);
  } catch (error) {
    return handleApiError(error);
  }
}
