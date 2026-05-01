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
    <div className="max-w-6xl mx-auto space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders & bookings</h1>
        <p className="text-gray-600 mt-1">Latest room service orders and room reservations.</p>
      </div>
      <OrdersRealtimeClient initialFood={food as never} initialBookings={bookings as never} />
    </div>
  );
}
