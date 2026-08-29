import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { apiSuccess, apiError, handleApiError, sanitizeInput } from "@/lib/api-utils";
import { serviceSchema } from "@/lib/validations";
import Service from "@/models/Service";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { admin, error } = await requireAdmin();
    if (!admin) return error!;

    const { id } = await params;
    await connectDB();

    const service = await Service.findById(id).lean();
    if (!service) {
      return apiError("Service not found", 404);
    }

    return apiSuccess(service);
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
    const data = serviceSchema.partial().parse(body);

    await connectDB();
    const service = await Service.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!service) {
      return apiError("Service not found", 404);
    }

    return apiSuccess(service);
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

    const service = await Service.findByIdAndDelete(id);
    if (!service) {
      return apiError("Service not found", 404);
    }

    return apiSuccess({ message: "Service deleted" });
  } catch (error) {
    return handleApiError(error);
  }
}
