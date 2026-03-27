import { getServiceSupabase } from "@/lib/supabase/service";

export type FoodOrderSummary = {
  id: string;
  status: string;
  total_kes: number;
  guest_name: string;
  room_number: string;
  created_at: string;
};

export type BookingSummary = {
  id: string;
  status: string;
  total_kes: number;
  room_name: string;
  first_name: string;
  last_name: string;
  created_at: string;
};

export type NotificationSummary = {
  id: string;
  kind: string;
  title: string;
  body: string;
  read: boolean;
  created_at: string;
};

export async function fetchAdminOverview() {
  const sb = getServiceSupabase();

  const [unreadNotif, foodCount, bookCount, recentFood, recentBook, recentNotif] = await Promise.all([
    sb.from("admin_notifications").select("id", { count: "exact", head: true }).eq("read", false),
    sb.from("food_orders").select("id", { count: "exact", head: true }),
    sb.from("bookings").select("id", { count: "exact", head: true }),
    sb
      .from("food_orders")
      .select("id, status, total_kes, guest_name, room_number, created_at")
      .order("created_at", { ascending: false })
      .limit(15),
    sb
      .from("bookings")
      .select("id, status, total_kes, room_name, first_name, last_name, created_at")
      .order("created_at", { ascending: false })
      .limit(15),
    sb
      .from("admin_notifications")
      .select("id, kind, title, body, read, created_at")
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  return {
    unreadNotifications: unreadNotif.count ?? 0,
    foodOrdersTotal: foodCount.count ?? 0,
    bookingsTotal: bookCount.count ?? 0,
    recentFood: (recentFood.data ?? []) as FoodOrderSummary[],
    recentBookings: (recentBook.data ?? []) as BookingSummary[],
    recentNotifications: (recentNotif.data ?? []) as NotificationSummary[],
  };
}
