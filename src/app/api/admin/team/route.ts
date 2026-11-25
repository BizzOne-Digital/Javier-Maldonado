import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { apiSuccess, handleApiError, sanitizeInput, revalidateSite } from "@/lib/api-utils";
import { teamMemberSchema } from "@/lib/validations";
import TeamMember from "@/models/TeamMember";

export async function GET() {
  try {
    const { admin, error } = await requireAdmin();
    if (!admin) return error!;

    await connectDB();
    const team = await TeamMember.find().sort({ order: 1, createdAt: -1 }).lean();
    return apiSuccess(team);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: Request) {
  try {
    const { admin, error } = await requireAdmin();
    if (!admin) return error!;

    const body = sanitizeInput(await req.json());
    const data = teamMemberSchema.parse(body);

    await connectDB();
    const member = await TeamMember.create(data);
    revalidateSite();
    return apiSuccess(member, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
