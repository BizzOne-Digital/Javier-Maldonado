"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { AdminToastProvider } from "./AdminToastProvider";
import { adminFetch } from "@/lib/admin-fetch";

interface AdminUser {
  name?: string;
  email: string;
}

export function AdminLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/admin/login";
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(!isLogin);

  useEffect(() => {
    if (isLogin) {
      setLoading(false);
      return;
    }

    adminFetch<AdminUser>("/api/auth/me")
      .then((json) => {
        if (json.success) {
          setUser(json.data);
        } else {
          router.replace("/admin/login");
        }
      })
      .catch(() => router.replace("/admin/login"))
      .finally(() => setLoading(false));
  }, [isLogin, router]);

  if (isLogin) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-lake border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <AdminToastProvider>
      <div className="min-h-screen bg-ivory flex">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AdminHeader user={user} />
          <main className="flex-1 p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </AdminToastProvider>
  );
}
