import { cookies } from "next/headers";
import { connectDB } from "@/lib/db";
import { verifyPassword, signToken, setAuthCookie } from "@/lib/auth";
import { apiSuccess, apiError, handleApiError, sanitizeInput } from "@/lib/api-utils";
import { loginSchema } from "@/lib/validations";
import AdminUser from "@/models/AdminUser";

export async function POST(req: Request) {
  try {
    const body = sanitizeInput(await req.json());
    const { email, password } = loginSchema.parse(body);

    await connectDB();
    const admin = await AdminUser.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return apiError("Invalid email or password", 401);
    }

    const valid = await verifyPassword(password, admin.password);
    if (!valid) {
      return apiError("Invalid email or password", 401);
    }

    const token = signToken({ id: admin._id.toString(), email: admin.email });
    const cookieStore = await cookies();
    cookieStore.set(setAuthCookie(token));

    return apiSuccess({
      id: admin._id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
