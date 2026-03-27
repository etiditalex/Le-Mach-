import { getServiceSupabase } from "@/lib/supabase/service";

export const dynamic = "force-dynamic";

export default async function AdminNotificationsPage() {
  const sb = getServiceSupabase();
  const { data, error } = await sb
    .from("admin_notifications")
    .select("id, kind, title, body, read, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  const rows = data ?? [];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-600 mt-1">Payment and booking alerts from M-Pesa / Paystack.</p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-100 text-red-800 px-4 py-3 text-sm">
          {error.message}
        </div>
      )}

      <ul className="space-y-3">
        {rows.length === 0 ? (
          <li className="rounded-xl bg-white border border-gray-200 p-8 text-center text-gray-500 text-sm">
            No notifications yet.
          </li>
        ) : (
          rows.map((n) => (
            <li
              key={n.id}
              className={`rounded-xl border p-4 shadow-sm ${
                n.read ? "bg-white border-gray-200" : "bg-amber-50/50 border-amber-100"
              }`}
            >
              <div className="flex justify-between gap-2 items-start">
                <p className="font-semibold text-gray-900">{n.title}</p>
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {new Date(n.created_at).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{n.body}</p>
              <p className="text-xs text-gray-400 mt-2">
                {n.kind}
                {!n.read && " · unread"}
              </p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
