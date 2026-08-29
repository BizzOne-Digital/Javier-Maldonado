import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { apiSuccess, handleApiError, sanitizeInput } from "@/lib/api-utils";
import { settingsPatchSchema } from "@/lib/validations";
import SiteSettings from "@/models/SiteSettings";

export async function GET() {
  try {
    const { admin, error } = await requireAdmin();
    if (!admin) return error!;

    await connectDB();
    const settings = await SiteSettings.find().lean();

    const merged: Record<string, Record<string, unknown>> = {};
    for (const setting of settings) {
      merged[setting.key] = setting.value as Record<string, unknown>;
    }

    return apiSuccess(merged);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(req: Request) {
  try {
    const { admin, error } = await requireAdmin();
    if (!admin) return error!;

    const body = sanitizeInput(await req.json());
    const { settings } = settingsPatchSchema.parse(body);

    await connectDB();

    const updates = await Promise.all(
      Object.entries(settings).map(([key, value]) =>
        SiteSettings.findOneAndUpdate(
          { key },
          { key, value },
          { upsert: true, new: true, runValidators: true }
        )
      )
    );

    const merged: Record<string, Record<string, unknown>> = {};
    for (const setting of updates) {
      if (setting) {
        merged[setting.key] = setting.value as Record<string, unknown>;
      }
    }

    return apiSuccess(merged);
  } catch (error) {
    return handleApiError(error);
  }
}
