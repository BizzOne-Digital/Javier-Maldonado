"use client";

import { useCallback, useEffect, useState } from "react";
import { Download, Search } from "lucide-react";
import { adminFetch } from "@/lib/admin-fetch";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { inputClass, selectClass } from "@/components/admin/form-styles";

interface Lead {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  type: string;
  status: string;
  message?: string;
  createdAt: string;
}

const LEAD_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "appointment_scheduled",
  "closed",
  "archived",
] as const;

const LEAD_TYPES = [
  "buyer",
  "seller",
  "rental",
  "investor",
  "contact",
  "home-value",
  "property-inquiry",
  "resource-download",
] as const;

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);
    if (typeFilter) params.set("type", typeFilter);
    if (search) params.set("search", search);

    adminFetch<{ leads: Lead[] }>(`/api/admin/leads?${params}`)
      .then((res) => {
        if (res.success) setLeads(res.data.leads);
      })
      .finally(() => setLoading(false));
  }, [statusFilter, typeFilter, search]);

  useEffect(() => {
    load();
  }, [load]);

  const updateStatus = async (id: string, status: string) => {
    const res = await adminFetch("/api/admin/leads", {
      method: "PATCH",
      body: JSON.stringify({ id, status }),
    });
    if (res.success) load();
  };

  const exportCsv = async () => {
    const params = new URLSearchParams({ export: "csv" });
    if (statusFilter) params.set("status", statusFilter);
    if (typeFilter) params.set("type", typeFilter);
    if (search) params.set("search", search);

    const res = await fetch(`/api/admin/leads?${params}`, {
      credentials: "include",
    });
    if (!res.ok) return;

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-midnight">Leads</h1>
          <p className="text-midnight/50 text-sm mt-1">Manage incoming leads</p>
        </div>
        <button
          type="button"
          onClick={exportCsv}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-lake/40 text-lake text-sm font-medium hover:bg-lake/5 transition-colors"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-midnight/40" />
          <input
            className={`${inputClass} pl-9`}
            placeholder="Search name, email, phone…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && setSearch(searchInput)}
          />
        </div>
        <select
          className={`${selectClass} w-auto min-w-[140px]`}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, " ")}
            </option>
          ))}
        </select>
        <select
          className={`${selectClass} w-auto min-w-[140px]`}
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">All Types</option>
          {LEAD_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setSearch(searchInput)}
          className="px-4 py-2 rounded-lg bg-midnight text-ivory text-sm font-medium hover:bg-midnight/90"
        >
          Filter
        </button>
      </div>

      <DataTable
        loading={loading}
        data={leads as unknown as Record<string, unknown>[]}
        columns={[
          {
            key: "name",
            header: "Contact",
            render: (row) => {
              const l = row as unknown as Lead;
              return (
                <div>
                  <p className="font-medium">{l.name}</p>
                  <p className="text-xs text-midnight/50">{l.email}</p>
                  {l.phone && <p className="text-xs text-midnight/40">{l.phone}</p>}
                </div>
              );
            },
          },
          {
            key: "type",
            header: "Type",
            render: (row) => (
              <span className="text-xs capitalize">
                {(row as unknown as Lead).type.replace(/-/g, " ")}
              </span>
            ),
          },
          {
            key: "status",
            header: "Status",
            render: (row) => {
              const l = row as unknown as Lead;
              return (
                <select
                  className="text-xs rounded border border-champagne/40 px-2 py-1 bg-white"
                  value={l.status}
                  onChange={(e) => updateStatus(l._id, e.target.value)}
                >
                  {LEAD_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.replace(/_/g, " ")}
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
              const msg = (row as unknown as Lead).message;
              return (
                <span className="text-xs text-midnight/60 line-clamp-2 max-w-xs">
                  {msg || "—"}
                </span>
              );
            },
          },
          {
            key: "createdAt",
            header: "Date",
            render: (row) =>
              new Date((row as unknown as Lead).createdAt).toLocaleDateString(),
          },
        ]}
      />
    </div>
  );
}
