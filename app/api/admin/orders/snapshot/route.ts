import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { getServiceSupabase } from "@/lib/supabase/service";

export const runtime = "nodejs";

export async function GET() {
  const auth = await requireAdminApi();
  if (auth instanceof NextResponse) return auth;

  const sb = getServiceSupabase();
  const [foodRes, bookRes] = await Promise.all([
    sb
      .from("food_orders")
      .select("id, status, total_kes, guest_name, room_number, guest_email, created_at, paid_at, receipt_key")
      .order("created_at", { ascending: false })
      .limit(100),
    sb
      .from("bookings")
      .select("id, status, total_kes, room_name, first_name, last_name, email, check_in, check_out, created_at, paid_at, receipt_key")
      .order("created_at", { ascending: false })
      .limit(100),
  ]);

  if (foodRes.error) return NextResponse.json({ error: foodRes.error.message }, { status: 500 });
  if (bookRes.error) return NextResponse.json({ error: bookRes.error.message }, { status: 500 });

  return NextResponse.json(
    {
      food: foodRes.data ?? [],
      bookings: bookRes.data ?? [],
      serverTime: new Date().toISOString(),
    },
    {
      headers: { "Cache-Control": "no-store" },
    }
  );
}

