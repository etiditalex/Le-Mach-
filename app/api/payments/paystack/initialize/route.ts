import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { appBaseUrl } from "@/lib/app-url";
import { paystackInitialize } from "@/lib/paystack";
import { getBookingById, updateBooking } from "@/lib/repositories/bookings";
import { getFoodOrderById, updateFoodOrder } from "@/lib/repositories/food-orders";

export const runtime = "nodejs";

type Body = {
  target: "food" | "booking";
  id: string;
};

function payable(status: string) {
  return status === "awaiting_payment" || status === "failed";
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { target, id } = body;
  if (!target || !id) return NextResponse.json({ error: "target and id required" }, { status: 400 });

  const reference = `LMCH_${target === "food" ? "F" : "B"}_${id.replace(/-/g, "").slice(0, 12)}_${randomBytes(3).toString("hex")}`;
  const callbackUrl = `${appBaseUrl()}/order/success`;

  try {
    if (target === "food") {
      const order = await getFoodOrderById(id);
      if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
      if (order.status === "paid") return NextResponse.json({ error: "Already paid" }, { status: 400 });
      if (!payable(order.status)) {
        return NextResponse.json({ error: "Order is not payable in this state" }, { status: 400 });
      }

      const init = await paystackInitialize({
        email: order.guestEmail,
        amountKes: order.totalKes,
        reference,
        callbackUrl,
        metadata: { target: "food", entityId: order.id },
      });

      const fresh = await getFoodOrderById(id);
      if (!fresh || fresh.status === "paid") {
        return NextResponse.json({ error: "Order state changed" }, { status: 409 });
      }
      if (!init.ok) {
        await updateFoodOrder(id, { lastError: init.error });
        return NextResponse.json({ error: init.error }, { status: 502 });
      }
      await updateFoodOrder(id, {
        paymentProvider: "paystack",
        lastError: null,
        paystack: { reference, accessCode: init.accessCode },
      });

      return NextResponse.json({
        authorizationUrl: init.authorizationUrl,
        reference,
      });
    }

    const booking = await getBookingById(id);
    if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    if (booking.status === "paid") return NextResponse.json({ error: "Already paid" }, { status: 400 });
    if (!payable(booking.status)) {
      return NextResponse.json({ error: "Booking is not payable in this state" }, { status: 400 });
    }

    const init = await paystackInitialize({
      email: booking.email,
      amountKes: booking.totalKes,
      reference,
      callbackUrl,
      metadata: { target: "booking", entityId: booking.id },
    });

    const fresh = await getBookingById(id);
    if (!fresh || fresh.status === "paid") {
      return NextResponse.json({ error: "Booking state changed" }, { status: 409 });
    }
    if (!init.ok) {
      await updateBooking(id, { lastError: init.error });
      return NextResponse.json({ error: init.error }, { status: 502 });
    }
    await updateBooking(id, {
      paymentProvider: "paystack",
      lastError: null,
      paystack: { reference, accessCode: init.accessCode },
    });

    return NextResponse.json({
      authorizationUrl: init.authorizationUrl,
      reference,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Initialize failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
