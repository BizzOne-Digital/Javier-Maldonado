import { connectDB } from "@/lib/db";
import { apiSuccess, handleApiError } from "@/lib/api-utils";
import TeamMember from "@/models/TeamMember";

export async function GET() {
  try {
    await connectDB();
    const team = await TeamMember.find({ published: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();
    return apiSuccess(team);
  } catch (error) {
    return handleApiError(error);
  }
}
