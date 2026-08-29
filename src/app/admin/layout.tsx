import type { Metadata } from "next";
import { AdminLayoutShell } from "@/components/admin/AdminLayoutShell";

export const metadata: Metadata = {
  title: "Admin | Javier Maldonado Real Estate",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutShell>{children}</AdminLayoutShell>;
}
