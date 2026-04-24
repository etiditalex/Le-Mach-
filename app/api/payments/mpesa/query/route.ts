import { NextResponse } from "next/server";
import { mpesaStkQuery } from "@/lib/mpesa";
import { getBookingById, setBookingFailed, updateBooking } from "@/lib/repositories/bookings";
import { getFoodOrderById, setFoodOrderFailed, updateFoodOrder } from "@/lib/repositories/food-orders";
import { finalizeDarajaStkFromItems } from "@/lib/daraja-finalize-stk-from-items";

export const runtime = "nodejs";

type Body = {
  target: "food" | "booking";
  id: string;
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { target, id } = body;
  if (!target || !id) {
    return NextResponse.json({ error: "target and id are required" }, { status: 400 });
  }

  if (target === "food") {
    const order = await getFoodOrderById(id);
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    if (order.status === "paid") return NextResponse.json({ ok: true, status: "paid" });

    const checkoutRequestId = order.mpesa?.checkoutRequestId;
    if (!checkoutRequestId) {
      return NextResponse.json({ error: "No M-Pesa checkout reference on this order" }, { status: 400 });
    }

    const query = await mpesaStkQuery(checkoutRequestId);
    if (!query.ok) {
      await updateFoodOrder(order.id, { lastError: query.error });
      return NextResponse.json({ error: query.error, raw: query.raw }, { status: 502 });
    }

    if (query.status === "success") {
      await finalizeDarajaStkFromItems({
        checkoutRequestId,
        resultCode: 0,
        resultDesc: query.resultDesc,
        source: "query",
      });
      return NextResponse.json({ ok: true, status: "paid" });
    }

    if (query.status === "failed") {
      await setFoodOrderFailed(order.id, query.resultDesc || "M-Pesa transaction failed");
      return NextResponse.json({ ok: true, status: "failed", detail: query.resultDesc });
    }

    return NextResponse.json({ ok: true, status: "processing_mpesa", detail: query.resultDesc });
  }

  const booking = await getBookingById(id);
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  if (booking.status === "paid") return NextResponse.json({ ok: true, status: "paid" });

  const checkoutRequestId = booking.mpesa?.checkoutRequestId;
  if (!checkoutRequestId) {
    return NextResponse.json({ error: "No M-Pesa checkout reference on this booking" }, { status: 400 });
  }

  const query = await mpesaStkQuery(checkoutRequestId);
  if (!query.ok) {
    await updateBooking(booking.id, { lastError: query.error });
    return NextResponse.json({ error: query.error, raw: query.raw }, { status: 502 });
  }

  if (query.status === "success") {
    await finalizeDarajaStkFromItems({
      checkoutRequestId,
      resultCode: 0,
      resultDesc: query.resultDesc,
      source: "query",
    });
    return NextResponse.json({ ok: true, status: "paid" });
  }

  if (query.status === "failed") {
    await setBookingFailed(booking.id, query.resultDesc || "M-Pesa transaction failed");
    return NextResponse.json({ ok: true, status: "failed", detail: query.resultDesc });
  }

  return NextResponse.json({ ok: true, status: "processing_mpesa", detail: query.resultDesc });
}

