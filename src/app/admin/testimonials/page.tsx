"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { adminFetch } from "@/lib/admin-fetch";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { FormModal } from "@/components/admin/FormModal";
import { inputClass, labelClass, checkboxClass } from "@/components/admin/form-styles";

interface Testimonial {
  _id: string;
  name: string;
  location?: string;
  rating?: number;
  featured: boolean;
  published: boolean;
  order: number;
  en?: { quote?: string };
}

const emptyForm = {
  name: "",
  location: "",
  rating: "5",
  order: "0",
  quote: "",
  featured: false,
  published: false,
};

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    adminFetch<Testimonial[]>("/api/admin/testimonials")
      .then((res) => {
        if (res.success) setItems(res.data);
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

  const openEdit = (item: Testimonial) => {
    setEditing(item);
    setForm({
      name: item.name,
      location: item.location || "",
      rating: String(item.rating ?? 5),
      order: String(item.order),
      quote: item.en?.quote || "",
      featured: item.featured,
      published: item.published,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    const res = await adminFetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
    if (res.success) load();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      name: form.name,
      location: form.location || undefined,
      rating: Number(form.rating),
      order: Number(form.order),
      featured: form.featured,
      published: form.published,
      en: { quote: form.quote },
    };

    const res = editing
      ? await adminFetch(`/api/admin/testimonials/${editing._id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        })
      : await adminFetch("/api/admin/testimonials", {
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
          <h1 className="font-display text-2xl text-midnight">Testimonials</h1>
          <p className="text-midnight/50 text-sm mt-1">Manage client testimonials</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-copper text-ivory text-sm font-semibold hover:bg-copper/90"
        >
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      </div>

      <DataTable
        loading={loading}
        data={items as unknown as Record<string, unknown>[]}
        columns={[
          { key: "name", header: "Name" },
          { key: "location", header: "Location" },
          {
            key: "rating",
            header: "Rating",
            render: (row) => `${(row as unknown as Testimonial).rating ?? 5} ★`,
          },
          {
            key: "published",
            header: "Status",
            render: (row) => (
              <StatusBadge
                status={(row as unknown as Testimonial).published ? "published" : "draft"}
              />
            ),
          },
          {
            key: "actions",
            header: "Actions",
            render: (row) => {
              const t = row as unknown as Testimonial;
              return (
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => openEdit(t)} className="p-1.5 text-lake hover:bg-lake/10 rounded">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button type="button" onClick={() => handleDelete(t._id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded">
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
        title={editing ? "Edit Testimonial" : "Add Testimonial"}
        onSubmit={handleSubmit}
        loading={saving}
      >
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Name</label>
            <input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label className={labelClass}>Location</label>
            <input className={inputClass} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Rating</label>
              <input type="number" min={1} max={5} className={inputClass} value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>Order</label>
              <input type="number" className={inputClass} value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Quote (EN)</label>
            <textarea className={inputClass} rows={4} value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} required />
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className={checkboxClass} checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
              Published
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className={checkboxClass} checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
              Featured
            </label>
          </div>
        </div>
      </FormModal>
    </div>
  );
}
