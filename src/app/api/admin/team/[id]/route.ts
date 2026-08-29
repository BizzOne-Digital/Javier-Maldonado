import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { apiSuccess, apiError, handleApiError, sanitizeInput } from "@/lib/api-utils";
import { teamMemberSchema } from "@/lib/validations";
import TeamMember from "@/models/TeamMember";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { admin, error } = await requireAdmin();
    if (!admin) return error!;

    const { id } = await params;
    await connectDB();

    const member = await TeamMember.findById(id).lean();
    if (!member) {
      return apiError("Team member not found", 404);
    }

    return apiSuccess(member);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { admin, error } = await requireAdmin();
    if (!admin) return error!;

    const { id } = await params;
    const body = sanitizeInput(await req.json());
    const data = teamMemberSchema.partial().parse(body);

    await connectDB();
    const member = await TeamMember.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!member) {
      return apiError("Team member not found", 404);
    }

    return apiSuccess(member);
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

    const member = await TeamMember.findByIdAndDelete(id);
    if (!member) {
      return apiError("Team member not found", 404);
    }

    return apiSuccess({ message: "Team member deleted" });
  } catch (error) {
    return handleApiError(error);
  }
}
