"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Pencil, Trash2, Loader2 } from "lucide-react";

type Item = {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image_url: string;
  sort_order: number;
};

const CATEGORY_OPTIONS = [
  { value: "wines", label: "Wines" },
  { value: "cans", label: "Cans" },
  { value: "beers", label: "Beers" },
  { value: "whiskey", label: "Whiskey" },
  { value: "vodka", label: "Vodka" },
  { value: "shots", label: "Shots" },
  { value: "tequila", label: "Tequila" },
  { value: "gin", label: "Gin" },
  { value: "rum-spirits", label: "Rum & Spirits" },
  { value: "creams-liqueurs", label: "Creams & Liqueurs" },
] as const;

async function uploadBrandImage(file: File): Promise<string> {
  const fd = new FormData();
  fd.set("file", file);
  const res = await fetch("/api/admin/bar-brands/upload", {
    method: "POST",
    body: fd,
  });
  const data = (await res.json()) as { url?: string; error?: string };
  if (!res.ok || !data.url) throw new Error(data.error || "Upload failed");
  return data.url;
}

export default function BarBrandsPanel() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const emptyForm = {
    name: "",
    description: "",
    category: "wines",
    price: "",
    sort_order: "0",
  };
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const clearFile = useCallback(() => {
    setImageFile(null);
    setPreviewUrl((prev) => {
      if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
      return null;
    });
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const load = useCallback(async () => {
    setErr(null);
    const res = await fetch("/api/admin/bar-brands");
    const data = (await res.json()) as { items?: Item[]; error?: string };
    if (!res.ok) {
      setErr(data.error || "Failed to load");
      setItems([]);
    } else {
      setItems(data.items ?? []);
      if (data.error && !(data.items?.length)) setErr(data.error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const startEdit = (it: Item) => {
    clearFile();
    setEditingId(it.id);
    setForm({
      name: it.name,
      description: it.description,
      category: it.category || "wines",
      price: String(it.price),
      sort_order: String(it.sort_order),
    });
    setPreviewUrl(it.image_url);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    clearFile();
    setPreviewUrl(null);
  };

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    clearFile();
    setImageFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const save = async () => {
    setSaving(true);
    setErr(null);
    try {
      let imageUrl: string;

      if (imageFile) {
        imageUrl = await uploadBrandImage(imageFile);
      } else if (editingId && previewUrl && !previewUrl.startsWith("blob:")) {
        imageUrl = previewUrl;
      } else {
        throw new Error("Choose an image from your device");
      }

      if (editingId) {
        const payload: Record<string, unknown> = {
          name: form.name,
          description: form.description,
          category: form.category,
          price: Number(form.price),
          sort_order: Number(form.sort_order) || 0,
        };
        if (imageFile) payload.image_url = imageUrl;

        const res = await fetch(`/api/admin/bar-brands/${encodeURIComponent(editingId)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = (await res.json()) as { error?: string };
        if (!res.ok) throw new Error(data.error || "Save failed");
      } else {
        const res = await fetch("/api/admin/bar-brands", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            description: form.description,
            category: form.category,
            price: Number(form.price),
            sort_order: Number(form.sort_order) || 0,
            image_url: imageUrl,
          }),
        });
        const data = (await res.json()) as { error?: string };
        if (!res.ok) throw new Error(data.error || "Create failed");
      }
      cancelEdit();
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Error");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this brand?")) return;
    setErr(null);
    const res = await fetch(`/api/admin/bar-brands/${encodeURIComponent(id)}`, { method: "DELETE" });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setErr(data.error || "Delete failed");
      return;
    }
    if (editingId === id) cancelEdit();
    await load();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bar — alcohol brands</h1>
        <p className="text-gray-600 mt-1">
          Manage brands, prices, and descriptions on the Bar &amp; Restaurant page. Images are uploaded from your
          device to Supabase Storage.
        </p>
      </div>

      {err && (
        <div className="rounded-xl border border-red-200 bg-red-50 text-red-800 px-4 py-3 text-sm">{err}</div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
        <h2 className="font-semibold text-gray-900">{editingId ? "Edit brand" : "Add brand"}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Price (KSh)</label>
            <input
              type="number"
              min={0}
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Sort order</label>
            <input
              type="number"
              value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">Lower numbers appear first on the bar page.</p>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Image (from device)</label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={onPickFile}
              className="w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border file:border-gray-300 file:bg-white file:px-3 file:py-1.5"
            />
            {editingId && !imageFile && (
              <p className="text-xs text-gray-500 mt-1">Leave unchanged to keep the current photo, or pick a new file to replace it.</p>
            )}
          </div>
          {previewUrl && (
            <div className="md:col-span-2 flex items-start gap-4">
              <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 shrink-0">
                <Image src={previewUrl} alt="Preview" fill className="object-cover" unoptimized />
              </div>
            </div>
          )}
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={saving || !form.name.trim()}
            onClick={() => void save()}
            className="inline-flex items-center gap-2 rounded-lg bg-primary text-white px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {editingId ? "Save changes" : "Create brand"}
          </button>
          {(editingId || form.name) && (
            <button type="button" onClick={cancelEdit} className="rounded-lg border px-4 py-2 text-sm">
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Brand</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium w-24" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((it) => (
                <tr key={it.id} className={editingId === it.id ? "bg-amber-50/50" : ""}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-100 shrink-0">
                        <Image src={it.image_url} alt="" fill className="object-cover" unoptimized />
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">{it.name}</span>
                        <p className="text-xs text-gray-500 truncate max-w-md">{it.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium capitalize text-gray-700">
                      {it.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 tabular-nums">KSh {it.price.toLocaleString()}</td>
                  <td className="px-4 py-3 tabular-nums">{it.sort_order}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => startEdit(it)}
                        className="p-2 rounded-lg hover:bg-gray-100 text-primary"
                        aria-label="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => void remove(it.id)}
                        className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                        aria-label="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
