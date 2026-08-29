"use client";

import { useCallback, useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import { DataTable } from "@/components/admin/DataTable";
import { selectClass } from "@/components/admin/form-styles";

interface Booking {
  _id: string;
  name: string;
  email: string;
  phone: string;
  consultationType: string;
  preferredDate: string;
  preferredTime: string;
  status: string;
  message?: string;
  createdAt: string;
}

const BOOKING_STATUSES = ["pending", "confirmed", "completed", "cancelled"] as const;

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);

    adminFetch<{ bookings: Booking[] }>(`/api/admin/bookings?${params}`)
      .then((res) => {
        if (res.success) setBookings(res.data.bookings);
      })
      .finally(() => setLoading(false));
  }, [statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const updateStatus = async (id: string, status: string) => {
    const res = await adminFetch("/api/admin/bookings", {
      method: "PATCH",
      body: JSON.stringify({ id, status }),
    });
    if (res.success) load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-midnight">Bookings</h1>
          <p className="text-midnight/50 text-sm mt-1">Manage consultation bookings</p>
        </div>
        <select
          className={`${selectClass} w-auto min-w-[160px]`}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          {BOOKING_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <DataTable
        loading={loading}
        data={bookings as unknown as Record<string, unknown>[]}
        columns={[
          {
            key: "name",
            header: "Client",
            render: (row) => {
              const b = row as unknown as Booking;
              return (
                <div>
                  <p className="font-medium">{b.name}</p>
                  <p className="text-xs text-midnight/50">{b.email}</p>
                  <p className="text-xs text-midnight/40">{b.phone}</p>
                </div>
              );
            },
          },
          {
            key: "consultationType",
            header: "Type",
            render: (row) => (row as unknown as Booking).consultationType,
          },
          {
            key: "preferredDate",
            header: "Preferred",
            render: (row) => {
              const b = row as unknown as Booking;
              return (
                <span className="text-sm">
                  {b.preferredDate} at {b.preferredTime}
                </span>
              );
            },
          },
          {
            key: "status",
            header: "Status",
            render: (row) => {
              const b = row as unknown as Booking;
              return (
                <select
                  className="text-xs rounded border border-champagne/40 px-2 py-1 bg-white"
                  value={b.status}
                  onChange={(e) => updateStatus(b._id, e.target.value)}
                >
                  {BOOKING_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              );
            },
          },
          {
            key: "message",
            header: "Message",
            render: (row) => {
              const msg = (row as unknown as Booking).message;
              return (
                <span className="text-xs text-midnight/60 line-clamp-2 max-w-xs">
                  {msg || "—"}
                </span>
              );
            },
          },
          {
            key: "createdAt",
            header: "Submitted",
            render: (row) =>
              new Date((row as unknown as Booking).createdAt).toLocaleDateString(),
          },
        ]}
      />
    </div>
  );
}
