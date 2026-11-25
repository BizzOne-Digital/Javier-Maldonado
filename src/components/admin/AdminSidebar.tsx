"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Home,
  Users,
  Calendar,
  MessageSquare,
  UsersRound,
  FolderOpen,
  Briefcase,
  Settings,
  ExternalLink,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/listings", label: "Listings", icon: Home },
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/admin/bookings", label: "Bookings", icon: Calendar },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquare },
  { href: "/admin/team", label: "Team", icon: UsersRound },
  { href: "/admin/resources", label: "Resources", icon: FolderOpen },
  { href: "/admin/content", label: "Site Content", icon: FileText },
  { href: "/admin/services", label: "Services", icon: Briefcase },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <aside className="w-64 shrink-0 bg-midnight text-ivory flex flex-col min-h-screen border-r border-champagne/10">
      <div className="px-5 py-6 border-b border-champagne/10">
        <Link href="/admin" className="block">
          <span className="font-display text-lg text-champagne">Javier Maldonado</span>
          <span className="block font-label text-[10px] uppercase tracking-[0.2em] text-lake mt-0.5">
            Admin Portal
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              isActive(href, exact)
                ? "bg-lake/20 text-champagne border border-lake/30"
                : "text-champagne/70 hover:bg-white/5 hover:text-champagne"
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-champagne/10">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-3 py-2 text-sm text-champagne/60 hover:text-copper transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          View Site
        </Link>
      </div>
    </aside>
  );
}
