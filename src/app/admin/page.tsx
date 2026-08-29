"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Home,
  Users,
  Calendar,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { adminFetch } from "@/lib/admin-fetch";
import { StatusBadge } from "@/components/admin/StatusBadge";

interface DashboardData {
  stats: {
    listings: { total: number; published: number };
    leads: { total: number; new: number };
    bookings: { total: number; pending: number };
    testimonials: { published: number };
    team: { published: number };
    resources: { published: number };
    services: { published: number };
  };
  recentLeads: Array<{
    _id: string;
    name: string;
    email: string;
    type: string;
    status: string;
    createdAt: string;
  }>;
  recentBookings: Array<{
    _id: string;
    name: string;
    consultationType: string;
    preferredDate: string;
    status: string;
    createdAt: string;
  }>;
}

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  href,
}: {
  label: string;
  value: number | string;
  sub?: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-xl border border-champagne/40 bg-white p-5 hover:border-lake/40 hover:shadow-md transition-all group"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-label text-xs uppercase tracking-wider text-midnight/50">
            {label}
          </p>
          <p className="font-display text-3xl text-midnight mt-1">{value}</p>
          {sub && <p className="text-xs text-midnight/50 mt-1">{sub}</p>}
        </div>
        <div className="p-2.5 rounded-lg bg-lake/10 text-lake group-hover:bg-lake/20 transition-colors">
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </Link>
  );
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch<DashboardData>("/api/admin/dashboard")
      .then((res) => {
        if (res.success) setData(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-lake border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <p className="text-midnight/50 text-center py-12">
        Failed to load dashboard data.
      </p>
    );
  }

  const { stats, recentLeads, recentBookings } = data;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl text-midnight">Dashboard</h1>
        <p className="text-midnight/50 text-sm mt-1">
          Overview of your real estate portal
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Listings"
          value={stats.listings.total}
          sub={`${stats.listings.published} published`}
          icon={Home}
          href="/admin/listings"
        />
        <StatCard
          label="Leads"
          value={stats.leads.total}
          sub={`${stats.leads.new} new`}
          icon={Users}
          href="/admin/leads"
        />
        <StatCard
          label="Bookings"
          value={stats.bookings.total}
          sub={`${stats.bookings.pending} pending`}
          icon={Calendar}
          href="/admin/bookings"
        />
        <StatCard
          label="Testimonials"
          value={stats.testimonials.published}
          sub="published"
          icon={MessageSquare}
          href="/admin/testimonials"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-champagne/40 bg-white p-4 text-center">
          <p className="text-2xl font-display text-midnight">{stats.team.published}</p>
          <p className="text-xs text-midnight/50 mt-1">Team Members</p>
        </div>
        <div className="rounded-xl border border-champagne/40 bg-white p-4 text-center">
          <p className="text-2xl font-display text-midnight">{stats.services.published}</p>
          <p className="text-xs text-midnight/50 mt-1">Services</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-champagne/40 bg-white overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-champagne/30">
            <h2 className="font-display text-lg text-midnight">Recent Leads</h2>
            <Link
              href="/admin/leads"
              className="text-sm text-lake hover:text-copper flex items-center gap-1"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-champagne/20">
            {recentLeads.length === 0 ? (
              <p className="px-5 py-8 text-sm text-midnight/50 text-center">No leads yet</p>
            ) : (
              recentLeads.map((lead) => (
                <div key={lead._id} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-midnight">{lead.name}</p>
                    <p className="text-xs text-midnight/50">{lead.email}</p>
                  </div>
                  <StatusBadge status={lead.status} />
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl border border-champagne/40 bg-white overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-champagne/30">
            <h2 className="font-display text-lg text-midnight">Recent Bookings</h2>
            <Link
              href="/admin/bookings"
              className="text-sm text-lake hover:text-copper flex items-center gap-1"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-champagne/20">
            {recentBookings.length === 0 ? (
              <p className="px-5 py-8 text-sm text-midnight/50 text-center">No bookings yet</p>
            ) : (
              recentBookings.map((booking) => (
                <div key={booking._id} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-midnight">{booking.name}</p>
                    <p className="text-xs text-midnight/50">
                      {booking.consultationType} · {booking.preferredDate}
                    </p>
                  </div>
                  <StatusBadge status={booking.status} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
