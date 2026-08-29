"use client";

import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import { adminFetch } from "@/lib/admin-fetch";

interface AdminHeaderProps {
  user: { name?: string; email: string };
  title?: string;
}

export function AdminHeader({ user, title }: AdminHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await adminFetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
  };

  return (
    <header className="h-16 shrink-0 bg-white border-b border-champagne/40 px-6 flex items-center justify-between">
      <div>
        {title && (
          <h1 className="font-display text-xl text-midnight">{title}</h1>
        )}
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-midnight/70">
          <div className="w-8 h-8 rounded-full bg-lake/15 flex items-center justify-center">
            <User className="w-4 h-4 text-lake" />
          </div>
          <div className="hidden sm:block">
            <p className="font-medium text-midnight">{user.name || "Admin"}</p>
            <p className="text-xs text-midnight/50">{user.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 text-sm text-midnight/70 hover:text-copper border border-champagne/40 rounded-lg hover:border-copper/40 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
