import { getServiceSupabase } from "@/lib/supabase/service";

export type FoodOrderSummary = {
  id: string;
  status: string;
  total_kes: number;
  guest_name: string;
  room_number: string | null;
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

export type OverviewDay = {
  key: string;
  label: string;
  paidKes: number;
  foodOrders: number;
  bookings: number;
};

type PaidRow = {
  total_kes: number | string | null;
  paid_at: string | null;
  created_at: string;
};

const NAIROBI = "Africa/Nairobi";

function nairobiKey(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: NAIROBI,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function weekdayLabel(key: string): string {
  const date = new Date(`${key}T12:00:00+03:00`);
  return new Intl.DateTimeFormat("en-US", { timeZone: NAIROBI, weekday: "short" }).format(date);
}

function dayKeyFromIso(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return nairobiKey(date);
}

function money(value: number | string | null | undefined) {
  const n = typeof value === "number" ? value : Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

function buildWindow(now = new Date()): OverviewDay[] {
  const todayNoon = new Date(`${nairobiKey(now)}T12:00:00+03:00`);
  const days: OverviewDay[] = [];
  for (let offset = 13; offset >= 0; offset -= 1) {
    const date = new Date(todayNoon.getTime() - offset * 24 * 60 * 60 * 1000);
    const key = nairobiKey(date);
    days.push({ key, label: weekdayLabel(key), paidKes: 0, foodOrders: 0, bookings: 0 });
  }
  return days;
}

export function blankAdminOverview() {
  return {
    unreadNotifications: 0,
    foodOrdersTotal: 0,
    bookingsTotal: 0,
    recentFood: [] as FoodOrderSummary[],
    recentBookings: [] as BookingSummary[],
    recentNotifications: [] as NotificationSummary[],
    paidFoodKes: 0,
    paidBookingsKes: 0,
    paidFoodCount: 0,
    paidBookingCount: 0,
    weekPaidKes: 0,
    previousWeekPaidKes: 0,
    days: buildWindow().slice(7),
  };
}

export async function fetchAdminOverview() {
  const sb = getServiceSupabase();
  const since = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString();

  const [unreadNotif, foodCount, bookCount, recentFood, recentBook, recentNotif, paidFood, paidBook, createdFood, createdBook] =
    await Promise.all([
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
      sb.from("food_orders").select("total_kes, paid_at, created_at").eq("status", "paid"),
      sb.from("bookings").select("total_kes, paid_at, created_at").eq("status", "paid"),
      sb.from("food_orders").select("created_at").gte("created_at", since),
      sb.from("bookings").select("created_at").gte("created_at", since),
    ]);

  const windowDays = buildWindow();
  const indexByKey = new Map(windowDays.map((day, index) => [day.key, index]));

  const addPaid = (rows: PaidRow[] | null) => {
    let sum = 0;
    let count = 0;
    for (const row of rows ?? []) {
      const amount = money(row.total_kes);
      sum += amount;
      count += 1;
      const key = dayKeyFromIso(row.paid_at || row.created_at);
      if (!key) continue;
      const index = indexByKey.get(key);
      if (index == null) continue;
      windowDays[index].paidKes += amount;
    }
    return { sum, count };
  };

  const addCreated = (rows: { created_at: string }[] | null, field: "foodOrders" | "bookings") => {
    for (const row of rows ?? []) {
      const key = dayKeyFromIso(row.created_at);
      if (!key) continue;
      const index = indexByKey.get(key);
      if (index == null) continue;
      windowDays[index][field] += 1;
    }
  };

  const foodPaid = addPaid((paidFood.data ?? []) as PaidRow[]);
  const bookingPaid = addPaid((paidBook.data ?? []) as PaidRow[]);
  addCreated((createdFood.data ?? []) as { created_at: string }[], "foodOrders");
  addCreated((createdBook.data ?? []) as { created_at: string }[], "bookings");

  const previousWeekPaidKes = windowDays.slice(0, 7).reduce((sum, day) => sum + day.paidKes, 0);
  const days = windowDays.slice(7);
  const weekPaidKes = days.reduce((sum, day) => sum + day.paidKes, 0);

  return {
    unreadNotifications: unreadNotif.count ?? 0,
    foodOrdersTotal: foodCount.count ?? 0,
    bookingsTotal: bookCount.count ?? 0,
    recentFood: (recentFood.data ?? []) as FoodOrderSummary[],
    recentBookings: (recentBook.data ?? []) as BookingSummary[],
    recentNotifications: (recentNotif.data ?? []) as NotificationSummary[],
    paidFoodKes: foodPaid.sum,
    paidBookingsKes: bookingPaid.sum,
    paidFoodCount: foodPaid.count,
    paidBookingCount: bookingPaid.count,
    weekPaidKes,
    previousWeekPaidKes,
    days,
  };
}
