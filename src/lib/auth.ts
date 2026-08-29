import jwt, { type SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import AdminUser from "@/models/AdminUser";
import { connectDB } from "./db";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const JWT_EXPIRES = (process.env.JWT_EXPIRES_IN || "7d") as SignOptions["expiresIn"];

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: { id: string; email: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; email: string };
  } catch {
    return null;
  }
}

export async function getAdminFromCookie() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return null;
  const decoded = verifyToken(token);
  if (!decoded) return null;
  await connectDB();
  const admin = await AdminUser.findById(decoded.id).select("-password");
  return admin;
}

export function setAuthCookie(token: string) {
  return {
    name: "admin_token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
}
