import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { apiSuccess, apiError, handleApiError, sanitizeInput, revalidateSite } from "@/lib/api-utils";
import { resourceSchema } from "@/lib/validations";
import Resource from "@/models/Resource";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { admin, error } = await requireAdmin();
    if (!admin) return error!;

    const { id } = await params;
    await connectDB();

    const resource = await Resource.findById(id).lean();
    if (!resource) {
      return apiError("Resource not found", 404);
    }

    return apiSuccess(resource);
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
    const data = resourceSchema.partial().parse(body);

    await connectDB();
    const resource = await Resource.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!resource) {
      return apiError("Resource not found", 404);
    }

    revalidateSite();
    return apiSuccess(resource);
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

    const resource = await Resource.findByIdAndDelete(id);
    if (!resource) {
      return apiError("Resource not found", 404);
    }

    revalidateSite();
    return apiSuccess({ message: "Resource deleted" });
  } catch (error) {
    return handleApiError(error);
  }
}
