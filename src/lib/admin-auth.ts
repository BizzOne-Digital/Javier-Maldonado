import { getAdminFromCookie } from "./auth";
import { apiError } from "./api-utils";
import { NextResponse } from "next/server";

export async function requireAdmin() {
  const admin = await getAdminFromCookie();
  if (!admin) {
    return { admin: null, error: apiError("Unauthorized", 401) };
  }
  return { admin, error: null };
}

export function unauthorizedResponse() {
  return apiError("Unauthorized", 401);
}
