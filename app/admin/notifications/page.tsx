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
    <div className="mx-auto max-w-3xl space-y-5">
      <p className="text-[13px] font-normal leading-5 tracking-normal text-gray-500">Payment and booking alerts from M-Pesa Daraja.</p>

      {error && (
        <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-[13px] font-normal text-red-800">
          {error.message}
        </div>
      )}
      <NotificationsRealtimeClient initial={rows as never} />
    </div>
  );
}
