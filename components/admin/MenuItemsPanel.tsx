"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Trash2, Loader2 } from "lucide-react";

type Item = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
};

const CATEGORIES = ["breakfast", "lunch", "dinner", "desserts", "beverages", "alcohol", "juice"] as const;

export default function MenuItemsPanel() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const emptyForm = {
    id: "",
    name: "",
    description: "",
    price: "",
    image: "",
    category: "lunch",
  };
  const [form, setForm] = useState(emptyForm);

  const load = useCallback(async () => {
    setErr(null);
    const res = await fetch("/api/admin/menu-items");
    const data = (await res.json()) as { items?: Item[]; error?: string };
    if (!res.ok) {
      setErr(data.error || "Failed to load");
      setItems([]);
    } else {
      setItems(data.items ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const startEdit = (it: Item) => {
    setEditingId(it.id);
    setForm({
      id: it.id,
      name: it.name,
      description: it.description,
      price: String(it.price),
      image: it.image,
      category: it.category,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const save = async () => {
    setSaving(true);
    setErr(null);
    try {
      if (editingId) {
        const res = await fetch(`/api/admin/menu-items/${encodeURIComponent(editingId)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            description: form.description,
            price: Number(form.price),
            image: form.image,
            category: form.category,
          }),
        });
        const data = (await res.json()) as { error?: string };
        if (!res.ok) throw new Error(data.error || "Save failed");
      } else {
        const res = await fetch("/api/admin/menu-items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: form.id.trim() || undefined,
            name: form.name,
            description: form.description,
            price: Number(form.price),
            image: form.image,
            category: form.category,
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
    if (!confirm(`Delete menu item "${id}"?`)) return;
    setErr(null);
    const res = await fetch(`/api/admin/menu-items/${encodeURIComponent(id)}`, { method: "DELETE" });
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
        <h1 className="text-2xl font-bold text-zinc-100">Menu items</h1>
        <p className="text-zinc-400 mt-1">Create, edit, and remove dishes shown on the public menu.</p>
      </div>

      {err && (
        <div className="rounded-xl border border-red-200 bg-red-50 text-red-800 px-4 py-3 text-sm">{err}</div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
        <h2 className="font-semibold text-gray-900">{editingId ? "Edit item" : "Add item"}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {!editingId && (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Id (optional)</label>
              <input
                value={form.id}
                onChange={(e) => setForm({ ...form, id: e.target.value })}
                placeholder="auto-generated if empty"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          )}
          {editingId && (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Id</label>
              <input value={form.id} disabled className="w-full rounded-lg border bg-gray-50 px-3 py-2 text-sm" />
            </div>
          )}
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
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
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
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Image URL</label>
            <input
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
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
            {editingId ? "Save changes" : "Create item"}
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
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium w-24" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((it) => (
                <tr key={it.id} className={editingId === it.id ? "bg-amber-50/50" : ""}>
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-900">{it.name}</span>
                    <p className="text-xs text-gray-500 truncate max-w-xs">{it.description}</p>
                  </td>
                  <td className="px-4 py-3">{it.category}</td>
                  <td className="px-4 py-3 tabular-nums">KSh {it.price.toLocaleString()}</td>
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
