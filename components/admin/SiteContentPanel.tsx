"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Trash2, Loader2, FileText } from "lucide-react";

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
      <div>
        <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
          <FileText className="w-7 h-7 text-primary" />
          Site content
        </h1>
        <p className="text-zinc-400 mt-1">
          Text snippets for pages (taglines, footers). Use stable slugs; wire the public site to{" "}
          <code className="text-xs bg-zinc-800 text-zinc-200 px-1 rounded border border-zinc-700">
            /api/public/content?slug=...
          </code>{" "}
          when needed.
        </p>
      </div>

      {info && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 text-amber-900 px-4 py-3 text-sm">{info}</div>
      )}
      {err && (
        <div className="rounded-xl border border-red-200 bg-red-50 text-red-800 px-4 py-3 text-sm">{err}</div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
        <h2 className="font-semibold text-gray-900">{editingId ? "Edit block" : "New block"}</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Slug (unique key)</label>
            <input
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              disabled={!!editingId}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-50"
              placeholder="e.g. tagline_home"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Body</label>
            <textarea
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              rows={6}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-sans"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={saving || !form.slug.trim() || !form.title.trim()}
            onClick={() => void save()}
            className="inline-flex items-center gap-2 rounded-lg bg-primary text-white px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {editingId ? "Save" : "Create"}
          </button>
          {(editingId || form.slug) && (
            <button type="button" onClick={cancelEdit} className="rounded-lg border px-4 py-2 text-sm">
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
                <p className="font-mono text-xs text-gray-500">{r.slug}</p>
                <p className="font-semibold text-gray-900">{r.title}</p>
                <p className="text-sm text-gray-600 mt-2 whitespace-pre-wrap line-clamp-3">{r.body}</p>
                <p className="text-xs text-gray-400 mt-2">Updated {new Date(r.updated_at).toLocaleString()}</p>
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
