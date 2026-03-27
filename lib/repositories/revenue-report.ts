import { getServiceSupabase } from "@/lib/supabase/service";
import type { OrderLine } from "@/lib/hotel-types";

const FOOD_CATEGORIES = new Set(["breakfast", "lunch", "dinner", "desserts"]);

export type DrinkBucketKey = "alcohol" | "juice" | "other_drinks" | "unknown";

export type LineBuckets = {
  foodKes: number;
  alcoholKes: number;
  juiceKes: number;
  otherDrinksKes: number;
  unknownKes: number;
  sumLineKes: number;
};

export type RoomServiceRoomRow = LineBuckets & {
  roomNumber: string;
  orderCount: number;
  totalKes: number;
};

export type BookingRoomRow = {
  roomId: string;
  roomName: string;
  totalKes: number;
  bookingCount: number;
};

export type RevenueReport = {
  period: {
    from: string | null;
    to: string | null;
    description: string;
  };
  foodOrders: {
    orderCount: number;
    sumOrderTotalsKes: number;
    buckets: LineBuckets;
    byRoom: RoomServiceRoomRow[];
  };
  bookings: {
    bookingCount: number;
    sumTotalsKes: number;
    byRoom: BookingRoomRow[];
  };
  combinedPaidKes: number;
};

function bucketForCategory(cat: string): "food" | DrinkBucketKey {
  const c = cat.trim().toLowerCase();
  if (FOOD_CATEGORIES.has(c)) return "food";
  if (c === "alcohol") return "alcohol";
  if (c === "juice") return "juice";
  if (c === "beverages") return "other_drinks";
  return "unknown";
}

function emptyBuckets(): LineBuckets {
  return {
    foodKes: 0,
    alcoholKes: 0,
    juiceKes: 0,
    otherDrinksKes: 0,
    unknownKes: 0,
    sumLineKes: 0,
  };
}

function addLineToBuckets(b: LineBuckets, line: OrderLine, category: string | undefined): void {
  const lineTotal = Math.max(0, line.price) * Math.max(0, line.quantity);
  b.sumLineKes += lineTotal;
  const bucket = bucketForCategory(category ?? "unknown");
  switch (bucket) {
    case "food":
      b.foodKes += lineTotal;
      break;
    case "alcohol":
      b.alcoholKes += lineTotal;
      break;
    case "juice":
      b.juiceKes += lineTotal;
      break;
    case "other_drinks":
      b.otherDrinksKes += lineTotal;
      break;
    default:
      b.unknownKes += lineTotal;
      break;
  }
}

function inPeriod(iso: string | null, fromMs: number | null, toMs: number | null): boolean {
  if (fromMs == null && toMs == null) return true;
  if (!iso) return false;
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return false;
  if (fromMs != null && t < fromMs) return false;
  if (toMs != null && t > toMs) return false;
  return true;
}

export async function fetchRevenueReport(params: { from?: string | null; to?: string | null }): Promise<RevenueReport> {
  const fromDay = params.from?.trim() || null;
  const toDay = params.to?.trim() || null;

  const fromMs = fromDay ? new Date(`${fromDay}T00:00:00.000Z`).getTime() : null;
  const toMs = toDay ? new Date(`${toDay}T23:59:59.999Z`).getTime() : null;

  const periodDescription =
    fromDay && toDay
      ? `${fromDay} → ${toDay} (paid date)`
      : fromDay
        ? `From ${fromDay} (paid date)`
        : toDay
          ? `Through ${toDay} (paid date)`
          : "All time (paid date)";

  const sb = getServiceSupabase();

  const [{ data: menuRows }, { data: foodRows }, { data: bookingRows }] = await Promise.all([
    sb.from("menu_items").select("id, category"),
    sb
      .from("food_orders")
      .select("lines, total_kes, room_number, status, paid_at, created_at")
      .eq("status", "paid"),
    sb
      .from("bookings")
      .select("id, room_id, room_name, total_kes, status, paid_at, created_at")
      .eq("status", "paid"),
  ]);

  const categoryByMenuId = new Map<string, string>();
  for (const row of menuRows ?? []) {
    const r = row as { id: string; category: string };
    categoryByMenuId.set(r.id, r.category);
  }

  const paidFood = (foodRows ?? []).filter((row) => {
    const r = row as { paid_at: string | null; created_at: string };
    const ts = r.paid_at || r.created_at;
    return inPeriod(ts, fromMs, toMs);
  });

  const paidBookings = (bookingRows ?? []).filter((row) => {
    const r = row as { paid_at: string | null; created_at: string };
    const ts = r.paid_at || r.created_at;
    return inPeriod(ts, fromMs, toMs);
  });

  const totals = emptyBuckets();
  const byRoomMap = new Map<
    string,
    LineBuckets & { orderCount: number; totalKes: number }
  >();

  let sumOrderTotalsKes = 0;

  for (const row of paidFood) {
    const r = row as {
      lines: OrderLine[] | null;
      total_kes: number;
      room_number: string;
    };
    sumOrderTotalsKes += r.total_kes;
    const roomKey = r.room_number.trim() || "—";
    if (!byRoomMap.has(roomKey)) {
      byRoomMap.set(roomKey, {
        ...emptyBuckets(),
        orderCount: 0,
        totalKes: 0,
      });
    }
    const roomAgg = byRoomMap.get(roomKey)!;
    roomAgg.orderCount += 1;
    roomAgg.totalKes += r.total_kes;

    const lines = (r.lines ?? []) as OrderLine[];
    for (const line of lines) {
      const cat = categoryByMenuId.get(line.id);
      addLineToBuckets(totals, line, cat);
      addLineToBuckets(roomAgg, line, cat);
    }
  }

  const bookingByRoom = new Map<string, { roomName: string; totalKes: number; bookingCount: number }>();
  let sumBookingTotalsKes = 0;

  for (const row of paidBookings) {
    const b = row as { room_id: string; room_name: string; total_kes: number };
    sumBookingTotalsKes += b.total_kes;
    const key = b.room_id;
    const existing = bookingByRoom.get(key);
    if (existing) {
      existing.totalKes += b.total_kes;
      existing.bookingCount += 1;
    } else {
      bookingByRoom.set(key, {
        roomName: b.room_name,
        totalKes: b.total_kes,
        bookingCount: 1,
      });
    }
  }

  const byRoom: RoomServiceRoomRow[] = [...byRoomMap.entries()]
    .map(([roomNumber, agg]) => ({
      roomNumber,
      foodKes: agg.foodKes,
      alcoholKes: agg.alcoholKes,
      juiceKes: agg.juiceKes,
      otherDrinksKes: agg.otherDrinksKes,
      unknownKes: agg.unknownKes,
      sumLineKes: agg.sumLineKes,
      orderCount: agg.orderCount,
      totalKes: agg.totalKes,
    }))
    .sort((a, b) => b.totalKes - a.totalKes);

  const bookingRowsOut: BookingRoomRow[] = [...bookingByRoom.entries()]
    .map(([roomId, v]) => ({
      roomId,
      roomName: v.roomName,
      totalKes: v.totalKes,
      bookingCount: v.bookingCount,
    }))
    .sort((a, b) => b.totalKes - a.totalKes);

  return {
    period: {
      from: fromDay,
      to: toDay,
      description: periodDescription,
    },
    foodOrders: {
      orderCount: paidFood.length,
      sumOrderTotalsKes,
      buckets: totals,
      byRoom,
    },
    bookings: {
      bookingCount: paidBookings.length,
      sumTotalsKes: sumBookingTotalsKes,
      byRoom: bookingRowsOut,
    },
    combinedPaidKes: sumOrderTotalsKes + sumBookingTotalsKes,
  };
}
