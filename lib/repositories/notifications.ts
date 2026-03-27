import { getServiceSupabase } from "@/lib/supabase/service";
import type { AdminNotification } from "@/lib/hotel-types";

export async function insertAdminNotification(n: {
  kind: AdminNotification["kind"];
  title: string;
  body: string;
  entityId: string;
}): Promise<void> {
  const sb = getServiceSupabase();
  const { error } = await sb.from("admin_notifications").insert({
    kind: n.kind,
    title: n.title,
    body: n.body,
    entity_id: n.entityId,
  });
  if (error) throw error;
}
