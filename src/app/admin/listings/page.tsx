"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { adminFetch } from "@/lib/admin-fetch";
import { formatCurrency } from "@/lib/utils";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { FormModal } from "@/components/admin/FormModal";
import { LocalImagesField, type StoredImageItem } from "@/components/admin/LocalImagesField";
import { inputClass, labelClass, selectClass, checkboxClass } from "@/components/admin/form-styles";

interface Listing {
  _id: string;
  address: string;
  city: string;
  price: number;
  status: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  published: boolean;
  featured: boolean;
  images?: StoredImageItem[];
  en?: { title?: string; description?: string };
}

const emptyForm = {
  address: "",
  city: "",
  price: "",
  status: "for_sale",
  propertyType: "Detached",
  bedrooms: "0",
  bathrooms: "0",
  squareFootage: "",
  published: false,
  featured: false,
  enTitle: "",
  enDescription: "",
  images: [] as StoredImageItem[],
};

export default function AdminListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Listing | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    adminFetch<{ listings: Listing[] }>("/api/admin/listings")
      .then((res) => {
        if (res.success) setListings(res.data.listings);
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

  const openEdit = (listing: Listing) => {
    setEditing(listing);
    setForm({
      address: listing.address,
      city: listing.city,
      price: String(listing.price),
      status: listing.status,
      propertyType: listing.propertyType,
      bedrooms: String(listing.bedrooms),
      bathrooms: String(listing.bathrooms),
      squareFootage: "",
      published: listing.published,
      featured: listing.featured,
      enTitle: listing.en?.title || "",
      enDescription: listing.en?.description || "",
      images: (listing.images || []).map((image, order) => ({
        url: image.url,
        order: image.order ?? order,
      })),
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this listing?")) return;
    const res = await adminFetch(`/api/admin/listings/${id}`, { method: "DELETE" });
    if (res.success) load();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      address: form.address,
      city: form.city,
      price: Number(form.price),
      status: form.status,
      propertyType: form.propertyType,
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      squareFootage: form.squareFootage ? Number(form.squareFootage) : undefined,
      published: form.published,
      featured: form.featured,
      images: form.images.map((image, order) => ({
        url: image.url,
        publicId: "",
        order,
      })),
      en: { title: form.enTitle, description: form.enDescription },
    };

    const res = editing
      ? await adminFetch(`/api/admin/listings/${editing._id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        })
      : await adminFetch("/api/admin/listings", {
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
          <h1 className="font-display text-2xl text-midnight">Listings</h1>
          <p className="text-midnight/50 text-sm mt-1">Manage property listings</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-copper text-ivory text-sm font-semibold hover:bg-copper/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Listing
        </button>
      </div>

      <DataTable
        loading={loading}
        data={listings as unknown as Record<string, unknown>[]}
        columns={[
          {
            key: "address",
            header: "Property",
            render: (row) => {
              const l = row as unknown as Listing;
              return (
                <div>
                  <p className="font-medium">{l.address}</p>
                  <p className="text-xs text-midnight/50">{l.city}</p>
                </div>
              );
            },
          },
          {
            key: "price",
            header: "Price",
            render: (row) => formatCurrency((row as unknown as Listing).price),
          },
          {
            key: "status",
            header: "Status",
            render: (row) => <StatusBadge status={(row as unknown as Listing).status} />,
          },
          {
            key: "published",
            header: "Published",
            render: (row) => (
              <StatusBadge
                status={(row as unknown as Listing).published ? "published" : "draft"}
              />
            ),
          },
          {
            key: "actions",
            header: "Actions",
            className: "w-24",
            render: (row) => {
              const l = row as unknown as Listing;
              return (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(l)}
                    className="p-1.5 text-lake hover:bg-lake/10 rounded"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(l._id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                  >
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
        title={editing ? "Edit Listing" : "Add Listing"}
        onSubmit={handleSubmit}
        loading={saving}
        size="xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className={labelClass}>Address</label>
            <input
              className={inputClass}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              required
            />
          </div>
          <div>
            <label className={labelClass}>City</label>
            <input
              className={inputClass}
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Price</label>
            <input
              type="number"
              className={inputClass}
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select
              className={selectClass}
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="for_sale">For Sale</option>
              <option value="for_lease">For Lease</option>
              <option value="sold">Sold</option>
              <option value="leased">Leased</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Property Type</label>
            <input
              className={inputClass}
              value={form.propertyType}
              onChange={(e) => setForm({ ...form, propertyType: e.target.value })}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Bedrooms</label>
            <input
              type="number"
              className={inputClass}
              value={form.bedrooms}
              onChange={(e) => setForm({ ...form, bedrooms: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass}>Bathrooms</label>
            <input
              type="number"
              className={inputClass}
              value={form.bathrooms}
              onChange={(e) => setForm({ ...form, bathrooms: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass}>Square Footage</label>
            <input
              type="number"
              className={inputClass}
              value={form.squareFootage}
              onChange={(e) => setForm({ ...form, squareFootage: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Title (EN)</label>
            <input
              className={inputClass}
              value={form.enTitle}
              onChange={(e) => setForm({ ...form, enTitle: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Description (EN)</label>
            <textarea
              className={inputClass}
              rows={3}
              value={form.enDescription}
              onChange={(e) => setForm({ ...form, enDescription: e.target.value })}
            />
          </div>
          <LocalImagesField
            label="Property Photos"
            folder="gallery"
            value={form.images}
            onChange={(images) => setForm({ ...form, images })}
            className="md:col-span-2"
          />
          <div className="flex items-center gap-6 md:col-span-2">
            <label className="flex items-center gap-2 text-sm text-midnight">
              <input
                type="checkbox"
                className={checkboxClass}
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
              />
              Published
            </label>
            <label className="flex items-center gap-2 text-sm text-midnight">
              <input
                type="checkbox"
                className={checkboxClass}
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              />
              Featured
            </label>
          </div>
        </div>
      </FormModal>
    </div>
  );
}
