import { getAdminFromCookie } from "@/lib/auth";
import { apiSuccess, apiError } from "@/lib/api-utils";

export async function GET() {
  const admin = await getAdminFromCookie();
  if (!admin) {
    return apiError("Unauthorized", 401);
  }
  return apiSuccess(admin);
}
