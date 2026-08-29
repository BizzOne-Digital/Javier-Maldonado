"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { adminFetch } from "@/lib/admin-fetch";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { FormModal } from "@/components/admin/FormModal";
import { LocalImageField } from "@/components/admin/LocalImageField";
import { inputClass, labelClass, checkboxClass } from "@/components/admin/form-styles";

interface Service {
  _id: string;
  slug: string;
  icon?: string;
  order: number;
  published: boolean;
  image?: string;
  en?: { title?: string; description?: string };
}

const emptyForm = {
  title: "",
  description: "",
  content: "",
  icon: "",
  image: "",
  order: "0",
  published: false,
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    adminFetch<Service[]>("/api/admin/services")
      .then((res) => {
        if (res.success) setServices(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (service: Service) => {
    setEditing(service);
    setForm({
      title: service.en?.title || "",
      description: service.en?.description || "",
      content: "",
      icon: service.icon || "",
      image: service.image || "",
      order: String(service.order),
      published: service.published,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    const res = await adminFetch(`/api/admin/services/${id}`, { method: "DELETE" });
    if (res.success) load();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      icon: form.icon || undefined,
      image: form.image || undefined,
      order: Number(form.order),
      published: form.published,
      en: {
        title: form.title,
        description: form.description,
        content: form.content,
      },
    };

    const res = editing
      ? await adminFetch(`/api/admin/services/${editing._id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        })
      : await adminFetch("/api/admin/services", {
          method: "POST",
          body: JSON.stringify(payload),
        });

    setSaving(false);
    if (res.success) {
      setModalOpen(false);
      load();
    } else {
      alert(res.error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-midnight">Services</h1>
          <p className="text-midnight/50 text-sm mt-1">Manage service offerings</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-copper text-ivory text-sm font-semibold hover:bg-copper/90"
        >
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      <DataTable
        loading={loading}
        data={services as unknown as Record<string, unknown>[]}
        columns={[
          {
            key: "title",
            header: "Title",
            render: (row) => (row as unknown as Service).en?.title || "—",
          },
          { key: "slug", header: "Slug" },
          { key: "order", header: "Order" },
          {
            key: "published",
            header: "Status",
            render: (row) => (
              <StatusBadge
                status={(row as unknown as Service).published ? "published" : "draft"}
              />
            ),
          },
          {
            key: "actions",
            header: "Actions",
            render: (row) => {
              const s = row as unknown as Service;
              return (
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => openEdit(s)} className="p-1.5 text-lake hover:bg-lake/10 rounded">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button type="button" onClick={() => handleDelete(s._id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            },
          },
        ]}
      />

      <FormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Service" : "Add Service"}
        onSubmit={handleSubmit}
        loading={saving}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Title (EN)</label>
            <input className={inputClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div>
            <label className={labelClass}>Description (EN)</label>
            <textarea className={inputClass} rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Content (EN)</label>
            <textarea className={inputClass} rows={4} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Icon</label>
              <input className={inputClass} value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="e.g. home" />
            </div>
            <div>
              <label className={labelClass}>Order</label>
              <input type="number" className={inputClass} value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} />
            </div>
          </div>
          <LocalImageField
            label="Service Image"
            folder="pages"
            value={form.image}
            onChange={(image) => setForm({ ...form, image })}
          />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className={checkboxClass} checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
            Published
          </label>
        </div>
      </FormModal>
    </div>
  );
}
