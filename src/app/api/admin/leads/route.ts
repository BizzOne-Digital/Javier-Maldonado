import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { apiSuccess, apiError, handleApiError, sanitizeInput } from "@/lib/api-utils";
import { leadQuerySchema, leadUpdateSchema } from "@/lib/validations";
import Lead from "@/models/Lead";

function toCsv(leads: Record<string, unknown>[]) {
  const headers = [
    "id",
    "type",
    "status",
    "name",
    "email",
    "phone",
    "message",
    "source",
    "language",
    "createdAt",
  ];
  const rows = leads.map((lead) =>
    headers
      .map((h) => {
        const val = lead[h];
        const str = val instanceof Date ? val.toISOString() : String(val ?? "");
        return `"${str.replace(/"/g, '""')}"`;
      })
      .join(",")
  );
  return [headers.join(","), ...rows].join("\n");
}

export async function GET(req: Request) {
  try {
    const { admin, error } = await requireAdmin();
    if (!admin) return error!;

    const { searchParams } = new URL(req.url);
    const query = leadQuerySchema.parse(Object.fromEntries(searchParams));

    const filter: Record<string, unknown> = {};
    if (query.status) filter.status = query.status;
    if (query.type) filter.type = query.type;
    if (query.search) {
      filter.$or = [
        { name: new RegExp(query.search, "i") },
        { email: new RegExp(query.search, "i") },
        { phone: new RegExp(query.search, "i") },
      ];
    }

    await connectDB();

    if (query.export === "csv") {
      const leads = await Lead.find(filter).sort({ createdAt: -1 }).lean();
      const csv = toCsv(
        leads.map((l) => ({
          id: l._id.toString(),
          type: l.type,
          status: l.status,
          name: l.name,
          email: l.email,
          phone: l.phone ?? "",
          message: l.message ?? "",
          source: l.source ?? "",
          language: l.language,
          createdAt: l.createdAt,
        }))
      );
      return new NextResponse(csv, {
        status: 200,
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="leads-${Date.now()}.csv"`,
        },
      });
    }

    const skip = (query.page - 1) * query.limit;
    const [leads, total] = await Promise.all([
      Lead.find(filter).sort({ createdAt: -1 }).skip(skip).limit(query.limit).lean(),
      Lead.countDocuments(filter),
    ]);

    return apiSuccess({
      leads,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(req: Request) {
  try {
    const { admin, error } = await requireAdmin();
    if (!admin) return error!;

    const body = sanitizeInput(await req.json());
    const { id, status, internalNotes } = leadUpdateSchema.parse(body);

    await connectDB();
    const lead = await Lead.findByIdAndUpdate(
      id,
      { ...(status && { status }), ...(internalNotes !== undefined && { internalNotes }) },
      { new: true, runValidators: true }
    );

    if (!lead) {
      return apiError("Lead not found", 404);
    }

    return apiSuccess(lead);
  } catch (error) {
    return handleApiError(error);
  }
}
