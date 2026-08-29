"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { adminFetch } from "@/lib/admin-fetch";
import { siteConfig } from "@/config/site";
import { inputClass, labelClass } from "@/components/admin/form-styles";

interface SettingsForm {
  phone: string;
  email: string;
  brokerage: string;
  street: string;
  city: string;
  province: string;
  postal: string;
  instagram: string;
  facebook: string;
  linkedin: string;
  siteName: string;
  siteTitle: string;
  domain: string;
}

const defaultForm: SettingsForm = {
  phone: siteConfig.phone,
  email: siteConfig.email,
  brokerage: siteConfig.brokerage,
  street: siteConfig.address.street,
  city: siteConfig.address.city,
  province: siteConfig.address.province,
  postal: siteConfig.address.postal,
  instagram: siteConfig.social.instagram,
  facebook: siteConfig.social.facebook,
  linkedin: siteConfig.social.linkedin,
  siteName: siteConfig.name,
  siteTitle: siteConfig.title,
  domain: siteConfig.domain,
};

export default function AdminSettingsPage() {
  const [form, setForm] = useState<SettingsForm>(defaultForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    adminFetch<Record<string, Record<string, unknown>>>("/api/admin/settings")
      .then((res) => {
        if (!res.success) return;
        const s = res.data;
        setForm({
          phone: String(s.contact?.phone ?? defaultForm.phone),
          email: String(s.contact?.email ?? defaultForm.email),
          brokerage: String(s.contact?.brokerage ?? defaultForm.brokerage),
          street: String(s.contact?.street ?? defaultForm.street),
          city: String(s.contact?.city ?? defaultForm.city),
          province: String(s.contact?.province ?? defaultForm.province),
          postal: String(s.contact?.postal ?? defaultForm.postal),
          instagram: String(s.social?.instagram ?? defaultForm.instagram),
          facebook: String(s.social?.facebook ?? defaultForm.facebook),
          linkedin: String(s.social?.linkedin ?? defaultForm.linkedin),
          siteName: String(s.site?.name ?? defaultForm.siteName),
          siteTitle: String(s.site?.title ?? defaultForm.siteTitle),
          domain: String(s.site?.domain ?? defaultForm.domain),
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const res = await adminFetch("/api/admin/settings", {
      method: "PATCH",
      body: JSON.stringify({
        settings: {
          contact: {
            phone: form.phone,
            email: form.email,
            brokerage: form.brokerage,
            street: form.street,
            city: form.city,
            province: form.province,
            postal: form.postal,
          },
          social: {
            instagram: form.instagram,
            facebook: form.facebook,
            linkedin: form.linkedin,
          },
          site: {
            name: form.siteName,
            title: form.siteTitle,
            domain: form.domain,
          },
        },
      }),
    });

    setSaving(false);
    setMessage(res.success ? "Settings saved successfully." : res.error || "Failed to save.");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-lake border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-display text-2xl text-midnight">Settings</h1>
        <p className="text-midnight/50 text-sm mt-1">Manage site-wide configuration</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="rounded-xl border border-champagne/40 bg-white p-6 space-y-4">
          <h2 className="font-display text-lg text-midnight border-b border-champagne/30 pb-3">
            Site Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Site Name</label>
              <input className={inputClass} value={form.siteName} onChange={(e) => setForm({ ...form, siteName: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>Site Title</label>
              <input className={inputClass} value={form.siteTitle} onChange={(e) => setForm({ ...form, siteTitle: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Domain</label>
              <input className={inputClass} value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} />
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-champagne/40 bg-white p-6 space-y-4">
          <h2 className="font-display text-lg text-midnight border-b border-champagne/30 pb-3">
            Contact Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Phone</label>
              <input className={inputClass} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input type="email" className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Brokerage</label>
              <input className={inputClass} value={form.brokerage} onChange={(e) => setForm({ ...form, brokerage: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Street Address</label>
              <input className={inputClass} value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>City</label>
              <input className={inputClass} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>Province</label>
              <input className={inputClass} value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>Postal Code</label>
              <input className={inputClass} value={form.postal} onChange={(e) => setForm({ ...form, postal: e.target.value })} />
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-champagne/40 bg-white p-6 space-y-4">
          <h2 className="font-display text-lg text-midnight border-b border-champagne/30 pb-3">
            Social Media
          </h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Instagram</label>
              <input className={inputClass} value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>Facebook</label>
              <input className={inputClass} value={form.facebook} onChange={(e) => setForm({ ...form, facebook: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>LinkedIn</label>
              <input className={inputClass} value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} />
            </div>
          </div>
        </section>

        {message && (
          <p className={`text-sm ${message.includes("success") ? "text-lake" : "text-copper"}`}>
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-copper text-ivory font-semibold hover:bg-copper/90 disabled:opacity-50 transition-colors"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving…" : "Save Settings"}
        </button>
      </form>
    </div>
  );
}
