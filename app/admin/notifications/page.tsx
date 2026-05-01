import { getServiceSupabase } from "@/lib/supabase/service";
import NotificationsRealtimeClient from "@/app/admin/NotificationsRealtimeClient";

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
        <p className="text-gray-600 mt-1">Payment and booking alerts from M-Pesa Daraja.</p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-100 text-red-800 px-4 py-3 text-sm">
          {error.message}
        </div>
      )}
      <NotificationsRealtimeClient initial={rows as never} />
    </div>
  );
}
