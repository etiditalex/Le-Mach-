import { NextResponse } from "next/server";
import { mpesaStkQuery } from "@/lib/mpesa";
import { finalizeDarajaStkFromItems } from "@/lib/daraja-finalize-stk-from-items";
import { getBookingById } from "@/lib/repositories/bookings";
import { getFoodOrderById } from "@/lib/repositories/food-orders";

export const runtime = "nodejs";

type Body = {
  target?: "food" | "booking";
  id?: string;
  checkoutRequestId?: string;
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  let checkoutRequestId = body.checkoutRequestId?.trim() || "";
  if (!checkoutRequestId && body.target && body.id) {
    if (body.target === "food") {
      const order = await getFoodOrderById(body.id);
      if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
      checkoutRequestId = order.mpesa?.checkoutRequestId || "";
    } else {
      const booking = await getBookingById(body.id);
      if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
      checkoutRequestId = booking.mpesa?.checkoutRequestId || "";
    }
  }

  if (!checkoutRequestId) {
    return NextResponse.json({ error: "Provide checkoutRequestId or target+id" }, { status: 400 });
  }

  const query = await mpesaStkQuery(checkoutRequestId);
  if (!query.ok) {
    return NextResponse.json({ ok: false, error: query.error, raw: query.raw }, { status: 502 });
  }

  if (query.status === "pending") {
    return NextResponse.json({ ok: true, status: "processing_mpesa", detail: query.resultDesc });
  }

  const finalized = await finalizeDarajaStkFromItems({
    checkoutRequestId,
    resultCode: query.status === "success" ? 0 : query.resultCode ?? 1,
    resultDesc: query.resultDesc,
    source: "query",
  });

  if (!finalized.matched) {
    return NextResponse.json({ ok: true, status: "unmatched", detail: "No local record found for checkoutRequestId." });
  }

  return NextResponse.json({
    ok: true,
    status: finalized.status === "already_paid" ? "paid" : finalized.status,
    target: finalized.target,
    targetId: finalized.targetId,
    detail: finalized.reason || query.resultDesc,
  });
}
