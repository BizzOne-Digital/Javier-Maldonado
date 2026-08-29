"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Plus, Pencil, Trash2, Upload } from "lucide-react";
import { adminFetch, uploadFile } from "@/lib/admin-fetch";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { FormModal } from "@/components/admin/FormModal";
import { inputClass, labelClass, checkboxClass } from "@/components/admin/form-styles";

interface Resource {
  _id: string;
  slug: string;
  fileUrl: string;
  publicId?: string;
  published: boolean;
  en?: { title?: string; description?: string };
}

const emptyForm = {
  title: "",
  description: "",
  fileUrl: "",
  publicId: "",
  published: false,
};

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Resource | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(() => {
    setLoading(true);
    adminFetch<Resource[]>("/api/admin/resources")
      .then((res) => {
        if (res.success) setResources(res.data);
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

  const openEdit = (resource: Resource) => {
    setEditing(resource);
    setForm({
      title: resource.en?.title || "",
      description: resource.en?.description || "",
      fileUrl: resource.fileUrl,
      publicId: resource.publicId || "",
      published: resource.published,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this resource?")) return;
    const res = await adminFetch(`/api/admin/resources/${id}`, { method: "DELETE" });
    if (res.success) load();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const res = await uploadFile(file, "javiermaldonado/resources");
    setUploading(false);

    if (res.success) {
      setForm({
        ...form,
        fileUrl: res.data?.url || res.url || "",
        publicId: res.data?.publicId || res.filename || "",
      });
    } else {
      alert(res.error || "Upload failed");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fileUrl) {
      alert("Please upload a file or provide a file URL");
      return;
    }

    setSaving(true);

    const payload = {
      fileUrl: form.fileUrl,
      publicId: form.publicId || undefined,
      published: form.published,
      en: { title: form.title, description: form.description },
    };

    const res = editing
      ? await adminFetch(`/api/admin/resources/${editing._id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        })
      : await adminFetch("/api/admin/resources", {
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
          <h1 className="font-display text-2xl text-midnight">Resources</h1>
          <p className="text-midnight/50 text-sm mt-1">Manage downloadable resources</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-copper text-ivory text-sm font-semibold hover:bg-copper/90"
        >
          <Plus className="w-4 h-4" /> Add Resource
        </button>
      </div>

      <DataTable
        loading={loading}
        data={resources as unknown as Record<string, unknown>[]}
        columns={[
          {
            key: "title",
            header: "Title",
            render: (row) => (row as unknown as Resource).en?.title || "—",
          },
          { key: "slug", header: "Slug" },
          {
            key: "fileUrl",
            header: "File",
            render: (row) => (
              <a
                href={(row as unknown as Resource).fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lake hover:text-copper text-xs underline"
              >
                View
              </a>
            ),
          },
          {
            key: "published",
            header: "Status",
            render: (row) => (
              <StatusBadge
                status={(row as unknown as Resource).published ? "published" : "draft"}
              />
            ),
          },
          {
            key: "actions",
            header: "Actions",
            render: (row) => {
              const r = row as unknown as Resource;
              return (
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => openEdit(r)} className="p-1.5 text-lake hover:bg-lake/10 rounded">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button type="button" onClick={() => handleDelete(r._id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded">
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
        title={editing ? "Edit Resource" : "Add Resource"}
        onSubmit={handleSubmit}
        loading={saving}
      >
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Title (EN)</label>
            <input className={inputClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div>
            <label className={labelClass}>Description (EN)</label>
            <textarea className={inputClass} rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>File</label>
            <div className="flex items-center gap-3">
              <input
                ref={fileRef}
                type="file"
                className="hidden"
                onChange={handleFileUpload}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-lake/40 text-lake text-sm hover:bg-lake/5 disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                {uploading ? "Uploading…" : "Upload File"}
              </button>
              {form.fileUrl && (
                <span className="text-xs text-midnight/50 truncate max-w-[200px]">
                  File attached
                </span>
              )}
            </div>
          </div>
          <div>
            <label className={labelClass}>Or File URL</label>
            <input className={inputClass} value={form.fileUrl} onChange={(e) => setForm({ ...form, fileUrl: e.target.value })} placeholder="https://..." />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className={checkboxClass} checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
            Published
          </label>
        </div>
      </FormModal>
    </div>
  );
}
