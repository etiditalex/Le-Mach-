import { NextResponse } from "next/server";
import { fulfillPaystackReference } from "@/lib/paystack-fulfill";
import { getBookingById } from "@/lib/repositories/bookings";
import { getFoodOrderById } from "@/lib/repositories/food-orders";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const reference = new URL(req.url).searchParams.get("reference");
  if (!reference) {
    return NextResponse.json({ error: "reference required" }, { status: 400 });
  }
  const r = await fulfillPaystackReference(reference);
  if (!r.ok) {
    return NextResponse.json({ ok: false, error: r.error }, { status: 400 });
  }

  let receiptKey: string | undefined;
  if (r.target === "food") {
    receiptKey = (await getFoodOrderById(r.entityId))?.receiptKey;
  } else {
    receiptKey = (await getBookingById(r.entityId))?.receiptKey;
  }

  return NextResponse.json({
    ok: true,
    reference,
    target: r.target,
    entityId: r.entityId,
    receiptKey,
  });
}
