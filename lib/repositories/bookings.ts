import type { BookingRecord } from "@/lib/hotel-types";
import { insertAdminNotification } from "@/lib/repositories/notifications";
import { rowToBooking, type BookingRow } from "@/lib/repositories/mappers";
import { getServiceSupabase } from "@/lib/supabase/service";

export async function getBookingById(id: string): Promise<BookingRecord | null> {
  const sb = getServiceSupabase();
  const { data, error } = await sb.from("bookings").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return rowToBooking(data as BookingRow);
}

export async function getBookingByMpesaCheckout(checkoutRequestId: string): Promise<BookingRecord | null> {
  const sb = getServiceSupabase();
  const { data, error } = await sb
    .from("bookings")
    .select("*")
    .filter("mpesa->>checkoutRequestId", "eq", checkoutRequestId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return rowToBooking(data as BookingRow);
}

export async function insertBooking(booking: BookingRecord): Promise<void> {
  const sb = getServiceSupabase();
  const { error } = await sb.from("bookings").insert({
    id: booking.id,
    status: booking.status,
    room_id: booking.roomId,
    room_name: booking.roomName,
    price_per_night: booking.pricePerNight,
    nights: booking.nights,
    total_kes: booking.totalKes,
    check_in: booking.checkIn,
    check_out: booking.checkOut,
    guests: booking.guests,
    first_name: booking.firstName,
    last_name: booking.lastName,
    email: booking.email,
    phone: booking.phone,
    special_requests: booking.specialRequests,
    receipt_key: booking.receiptKey,
    payment_provider: booking.paymentProvider ?? null,
    mpesa: booking.mpesa ?? null,
    paystack: booking.paystack ?? null,
    last_error: booking.lastError ?? null,
    paid_at: booking.paidAt ?? null,
  });
  if (error) throw error;
}

export async function updateBooking(
  id: string,
  patch: Partial<{
    status: BookingRecord["status"];
    mpesa: BookingRecord["mpesa"];
    paystack: BookingRecord["paystack"];
    paymentProvider: BookingRecord["paymentProvider"];
    lastError: string | null;
    paidAt: string | null;
  }>
): Promise<void> {
  const sb = getServiceSupabase();
  const row: Record<string, unknown> = {};
  if (patch.status !== undefined) row.status = patch.status;
  if (patch.mpesa !== undefined) row.mpesa = patch.mpesa;
  if (patch.paystack !== undefined) row.paystack = patch.paystack;
  if (patch.paymentProvider !== undefined) row.payment_provider = patch.paymentProvider;
  if (patch.lastError !== undefined) row.last_error = patch.lastError;
  if (patch.paidAt !== undefined) row.paid_at = patch.paidAt;
  if (Object.keys(row).length === 0) return;
  const { error } = await sb.from("bookings").update(row).eq("id", id);
  if (error) throw error;
}

export async function setBookingFailed(id: string, lastError: string): Promise<void> {
  await updateBooking(id, { status: "failed", lastError });
}

export async function markBookingPaidWithNotify(
  booking: BookingRecord,
  patch: Pick<BookingRecord, "paymentProvider"> & {
    mpesa?: BookingRecord["mpesa"];
    paystack?: BookingRecord["paystack"];
  }
): Promise<void> {
  if (booking.status === "paid") return;
  const paidAt = new Date().toISOString();
  const sb = getServiceSupabase();
  const { data, error } = await sb
    .from("bookings")
    .update({
      status: "paid",
      paid_at: paidAt,
      payment_provider: patch.paymentProvider,
      mpesa: patch.mpesa ?? booking.mpesa ?? null,
      paystack: patch.paystack ?? booking.paystack ?? null,
      last_error: null,
    })
    .eq("id", booking.id)
    .in("status", ["awaiting_payment", "processing_mpesa", "failed"])
    .select("id")
    .maybeSingle();
  if (error) throw error;
  if (!data) return;

  await insertAdminNotification({
    kind: "booking_paid",
    title: "Room booking paid",
    body: `${booking.firstName} ${booking.lastName} · ${booking.roomName} · KSh ${booking.totalKes.toLocaleString()}`,
    entityId: booking.id,
  });
}
