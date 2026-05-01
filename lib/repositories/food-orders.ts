import type { FoodOrder } from "@/lib/hotel-types";
import { insertAdminNotification } from "@/lib/repositories/notifications";
import { rowToFoodOrder, type FoodOrderRow } from "@/lib/repositories/mappers";
import { getServiceSupabase } from "@/lib/supabase/service";

export async function getFoodOrderById(id: string): Promise<FoodOrder | null> {
  const sb = getServiceSupabase();
  const { data, error } = await sb.from("food_orders").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return rowToFoodOrder(data as FoodOrderRow);
}

export async function getFoodOrderByMpesaCheckout(checkoutRequestId: string): Promise<FoodOrder | null> {
  const sb = getServiceSupabase();
  const { data, error } = await sb
    .from("food_orders")
    .select("*")
    .filter("mpesa->>checkoutRequestId", "eq", checkoutRequestId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return rowToFoodOrder(data as FoodOrderRow);
}

export async function insertFoodOrder(order: FoodOrder): Promise<void> {
  const sb = getServiceSupabase();
  const { error } = await sb.from("food_orders").insert({
    id: order.id,
    status: order.status,
    lines: order.lines,
    total_kes: order.totalKes,
    room_number: order.roomNumber,
    guest_name: order.guestName,
    guest_email: order.guestEmail,
    guest_phone: order.guestPhone,
    receipt_key: order.receiptKey,
    payment_provider: order.paymentProvider ?? null,
    mpesa: order.mpesa ?? null,
    last_error: order.lastError ?? null,
    paid_at: order.paidAt ?? null,
  });
  if (error) throw error;

  await insertAdminNotification({
    kind: "food_created",
    title: "New food order",
    body: `${order.guestName} · ${order.roomNumber ? `Room ${order.roomNumber}` : "No room"} · KSh ${order.totalKes.toLocaleString()}`,
    entityId: order.id,
  });
}

export async function updateFoodOrder(
  id: string,
  patch: Partial<{
    status: FoodOrder["status"];
    mpesa: FoodOrder["mpesa"];
    paymentProvider: FoodOrder["paymentProvider"];
    lastError: string | null;
    paidAt: string | null;
  }>
): Promise<void> {
  const sb = getServiceSupabase();
  const row: Record<string, unknown> = {};
  if (patch.status !== undefined) row.status = patch.status;
  if (patch.mpesa !== undefined) row.mpesa = patch.mpesa;
  if (patch.paymentProvider !== undefined) row.payment_provider = patch.paymentProvider;
  if (patch.lastError !== undefined) row.last_error = patch.lastError;
  if (patch.paidAt !== undefined) row.paid_at = patch.paidAt;
  if (Object.keys(row).length === 0) return;
  const { error } = await sb.from("food_orders").update(row).eq("id", id);
  if (error) throw error;
}

export async function setFoodOrderFailed(id: string, lastError: string): Promise<void> {
  await updateFoodOrder(id, { status: "failed", lastError });
}

export async function markFoodOrderPaidWithNotify(
  order: FoodOrder,
  patch: Pick<FoodOrder, "paymentProvider"> & { mpesa?: FoodOrder["mpesa"] }
): Promise<void> {
  if (order.status === "paid") return;
  const paidAt = new Date().toISOString();
  const sb = getServiceSupabase();
  const { data, error } = await sb
    .from("food_orders")
    .update({
      status: "paid",
      paid_at: paidAt,
      payment_provider: patch.paymentProvider,
      mpesa: patch.mpesa ?? order.mpesa ?? null,
      last_error: null,
    })
    .eq("id", order.id)
    .in("status", ["awaiting_payment", "processing_mpesa", "failed"])
    .select("id")
    .maybeSingle();
  if (error) throw error;
  if (!data) return;

  await insertAdminNotification({
    kind: "food_paid",
    title: "Food order paid",
    body: `${order.guestName} · ${order.roomNumber ? `Room ${order.roomNumber}` : "No room"} · KSh ${order.totalKes.toLocaleString()}`,
    entityId: order.id,
  });
}
