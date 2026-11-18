import { getServiceSupabase } from "@/lib/supabase/service";
import OrdersRealtimeClient from "@/app/admin/orders/OrdersRealtimeClient";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const sb = getServiceSupabase();
  const [foodRes, bookRes] = await Promise.all([
    sb
      .from("food_orders")
      .select("id, status, total_kes, guest_name, room_number, guest_email, created_at, paid_at, receipt_key")
      .order("created_at", { ascending: false })
      .limit(100),
    sb
      .from("bookings")
      .select(
        "id, status, total_kes, room_name, first_name, last_name, email, check_in, check_out, created_at, paid_at, receipt_key"
      )
      .order("created_at", { ascending: false })
      .limit(100),
  ]);

  const food = foodRes.data ?? [];
  const bookings = bookRes.data ?? [];

  return (
    <div className="space-y-8">
      <p className="text-[13px] font-normal leading-5 tracking-normal text-gray-500">
        Latest room service orders and room reservations. Delete a row to remove a test so only real ones stay on the
        dashboard.
      </p>
      <OrdersRealtimeClient initialFood={food as never} initialBookings={bookings as never} />
    </div>
  );
}
