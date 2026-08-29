import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function apiError(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    return apiError(error.issues.map((i) => i.message).join(", "), 422);
  }
  console.error(error);
  return apiError("Internal server error", 500);
}

export function sanitizeInput(obj: Record<string, unknown>) {
  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      sanitized[key] = value.replace(/\$/g, "").trim();
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}
