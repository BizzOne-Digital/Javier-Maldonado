"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { adminFetch } from "@/lib/admin-fetch";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { FormModal } from "@/components/admin/FormModal";
import { LocalImageField } from "@/components/admin/LocalImageField";
import { inputClass, labelClass, checkboxClass } from "@/components/admin/form-styles";

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  headshot?: string;
  order: number;
  published: boolean;
  en?: { bio?: string };
}

const emptyForm = {
  name: "",
  role: "",
  email: "",
  phone: "",
  headshot: "",
  bio: "",
  order: "0",
  published: false,
  linkedin: "",
  instagram: "",
};

export default function AdminTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    adminFetch<TeamMember[]>("/api/admin/team")
      .then((res) => {
        if (res.success) setMembers(res.data);
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

  const openEdit = (member: TeamMember) => {
    setEditing(member);
    setForm({
      name: member.name,
      role: member.role,
      email: member.email || "",
      phone: member.phone || "",
      headshot: member.headshot || "",
      bio: member.en?.bio || "",
      order: String(member.order),
      published: member.published,
      linkedin: "",
      instagram: "",
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this team member?")) return;
    const res = await adminFetch(`/api/admin/team/${id}`, { method: "DELETE" });
    if (res.success) load();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      name: form.name,
      role: form.role,
      email: form.email || undefined,
      phone: form.phone || undefined,
      headshot: form.headshot || undefined,
      order: Number(form.order),
      published: form.published,
      en: { bio: form.bio },
      social: {
        linkedin: form.linkedin || undefined,
        instagram: form.instagram || undefined,
      },
    };

    const res = editing
      ? await adminFetch(`/api/admin/team/${editing._id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        })
      : await adminFetch("/api/admin/team", {
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
          <h1 className="font-display text-2xl text-midnight">Team</h1>
          <p className="text-midnight/50 text-sm mt-1">Manage team members</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-copper text-ivory text-sm font-semibold hover:bg-copper/90"
        >
          <Plus className="w-4 h-4" /> Add Member
        </button>
      </div>

      <DataTable
        loading={loading}
        data={members as unknown as Record<string, unknown>[]}
        columns={[
          { key: "name", header: "Name" },
          { key: "role", header: "Role" },
          { key: "email", header: "Email" },
          {
            key: "published",
            header: "Status",
            render: (row) => (
              <StatusBadge
                status={(row as unknown as TeamMember).published ? "published" : "draft"}
              />
            ),
          },
          {
            key: "actions",
            header: "Actions",
            render: (row) => {
              const m = row as unknown as TeamMember;
              return (
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => openEdit(m)} className="p-1.5 text-lake hover:bg-lake/10 rounded">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button type="button" onClick={() => handleDelete(m._id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded">
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
        title={editing ? "Edit Team Member" : "Add Team Member"}
        onSubmit={handleSubmit}
        loading={saving}
        size="lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Name</label>
            <input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label className={labelClass}>Role</label>
            <input className={inputClass} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input type="email" className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Phone</label>
            <input className={inputClass} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <LocalImageField
            label="Headshot"
            folder="pages"
            value={form.headshot}
            onChange={(headshot) => setForm({ ...form, headshot })}
            className="md:col-span-2"
          />
          <div className="md:col-span-2">
            <label className={labelClass}>Bio (EN)</label>
            <textarea className={inputClass} rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>LinkedIn</label>
            <input className={inputClass} value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Instagram</label>
            <input className={inputClass} value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} />
          </div>
          <label className="flex items-center gap-2 text-sm md:col-span-2">
            <input type="checkbox" className={checkboxClass} checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
            Published
          </label>
        </div>
      </FormModal>
    </div>
  );
}
