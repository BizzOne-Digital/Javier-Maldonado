import { connectDB } from "@/lib/db";
import { apiSuccess, handleApiError, sanitizeInput } from "@/lib/api-utils";
import { leadCreateSchema } from "@/lib/validations";
import { notifyLeadSubmission } from "@/lib/notifications";
import Lead from "@/models/Lead";

export async function POST(req: Request) {
  try {
    const body = sanitizeInput(await req.json());
    const data = leadCreateSchema.parse(body);

    await connectDB();
    const lead = await Lead.create(data);

    await notifyLeadSubmission({
      type: lead.type,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      message: lead.message,
      metadata: lead.metadata as Record<string, unknown>,
    });

    return apiSuccess({ id: lead._id, message: "Thank you for your submission" }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
