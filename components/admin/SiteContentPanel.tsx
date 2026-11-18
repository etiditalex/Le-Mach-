"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Trash2, Loader2 } from "lucide-react";

type Row = {
  id: string;
  slug: string;
  title: string;
  body: string;
  updated_at: string;
};

export default function SiteContentPanel() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const emptyForm = { slug: "", title: "", body: "" };
  const [form, setForm] = useState(emptyForm);

  const load = useCallback(async () => {
    setErr(null);
    setInfo(null);
    const res = await fetch("/api/admin/site-content");
    const data = (await res.json()) as { items?: Row[]; error?: string };
    if (data.error && !data.items?.length) {
      setInfo(data.error);
      setRows([]);
    } else {
      setRows(data.items ?? []);
      if (data.error) setInfo(data.error);
    }
    if (!res.ok && !data.items) setErr(data.error || "Failed to load");
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const startEdit = (r: Row) => {
    setEditingId(r.id);
    setForm({ slug: r.slug, title: r.title, body: r.body });
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
        const res = await fetch(`/api/admin/site-content/${encodeURIComponent(editingId)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug: form.slug, title: form.title, body: form.body }),
        });
        const data = (await res.json()) as { error?: string };
        if (!res.ok) throw new Error(data.error || "Save failed");
      } else {
        const res = await fetch("/api/admin/site-content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug: form.slug, title: form.title, body: form.body }),
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

  const remove = async (id: string, slug: string) => {
    if (!confirm(`Delete content block "${slug}"?`)) return;
    setErr(null);
    const res = await fetch(`/api/admin/site-content/${encodeURIComponent(id)}`, { method: "DELETE" });
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
    <div className="max-w-4xl mx-auto space-y-8">
      <p className="text-[13px] font-normal leading-5 tracking-normal text-gray-500">
        Text snippets for pages (taglines, footers). Use stable slugs; wire the public site to{" "}
        <code className="rounded bg-gray-100 px-1 text-[12px] font-normal">/api/public/content?slug=...</code> when needed.
      </p>

      {info && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] font-normal text-amber-900">{info}</div>
      )}
      {err && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-normal text-red-800">{err}</div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-[15px] font-bold tracking-normal text-gray-900">{editingId ? "Edit block" : "New block"}</h2>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-[12px] font-normal tracking-normal text-gray-600">Slug (unique key)</label>
            <input
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              disabled={!!editingId}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 disabled:bg-gray-50"
              placeholder="e.g. tagline_home"
            />
          </div>
          <div>
            <label className="mb-1 block text-[12px] font-normal tracking-normal text-gray-600">Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-[12px] font-normal tracking-normal text-gray-600">Body</label>
            <textarea
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              rows={6}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={saving || !form.slug.trim() || !form.title.trim()}
            onClick={() => void save()}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {editingId ? "Save" : "Create"}
          </button>
          {(editingId || form.slug) && (
            <button type="button" onClick={cancelEdit} className="rounded-lg border px-4 py-2">
              Cancel
            </button>
          )}
        </div>
      </div>

      <ul className="space-y-3">
        {rows.map((r) => (
          <li
            key={r.id}
            className={`rounded-xl border p-4 shadow-sm ${editingId === r.id ? "border-primary/40 bg-amber-50/30" : "bg-white border-gray-200"}`}
          >
            <div className="flex justify-between gap-2 items-start">
              <div>
                <p className="font-mono text-[12px] font-normal text-gray-500">{r.slug}</p>
                <p className="text-[12px] font-medium tracking-normal text-gray-900">{r.title}</p>
                <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-[13px] font-normal text-gray-600">{r.body}</p>
                <p className="mt-2 text-[12px] font-normal tracking-normal text-gray-400">Updated {new Date(r.updated_at).toLocaleString()}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button type="button" onClick={() => startEdit(r)} className="p-2 rounded-lg hover:bg-gray-100 text-primary">
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => void remove(r.id, r.slug)}
                  className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
