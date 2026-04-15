import { NextResponse } from "next/server";
import { mpesaStkPush, mpesaStkQuery, normalizeMsisdnKenya } from "@/lib/mpesa";
import { getBookingById, markBookingPaidWithNotify, updateBooking } from "@/lib/repositories/bookings";
import { getFoodOrderById, markFoodOrderPaidWithNotify, updateFoodOrder } from "@/lib/repositories/food-orders";

export const runtime = "nodejs";

type Body = {
  target: "food" | "booking";
  id: string;
  phone: string;
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

  try {
    const { target, id, phone } = body;
    if (!target || !id || !phone) {
      return NextResponse.json({ error: "target, id, and phone are required" }, { status: 400 });
    }

    const msisdn = normalizeMsisdnKenya(phone);
    if (!msisdn) {
      return NextResponse.json({ error: "Enter a valid Kenya mobile number" }, { status: 400 });
    }

    if (target === "food") {
      const order = await getFoodOrderById(id);
      if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
      if (order.status === "paid") return NextResponse.json({ error: "Already paid" }, { status: 400 });
      if (order.status === "processing_mpesa") {
        return NextResponse.json(
          { error: "STK already sent. Approve the prompt on your phone, or wait a minute and try again." },
          { status: 409 }
        );
      }
      if (!payable(order.status)) {
        return NextResponse.json({ error: "Order is not payable in this state" }, { status: 400 });
      }

      const push = await mpesaStkPush({
        amountKes: order.totalKes,
        phone254: msisdn,
        accountReference: `FOOD-${order.id.slice(0, 8)}`,
        transactionDesc: "Lemach food",
      });

      try {
        const fresh = await getFoodOrderById(id);
        if (!fresh || fresh.status === "paid") {
          // no-op
        } else if (!push.ok) {
          await updateFoodOrder(id, { lastError: push.error });
        } else {
          await updateFoodOrder(id, {
            status: "processing_mpesa",
            paymentProvider: "mpesa",
            lastError: null,
            mpesa: {
              ...fresh.mpesa,
              checkoutRequestId: push.checkoutRequestId,
              merchantRequestId: push.merchantRequestId,
              phone: msisdn,
            },
          });
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed to update order";
        return NextResponse.json({ error: msg }, { status: 500 });
      }

      if (!push.ok) {
        return NextResponse.json({ error: push.error, raw: push.raw }, { status: 502 });
      }
      const immediateQuery = await mpesaStkQuery(push.checkoutRequestId);
      if (immediateQuery.ok && immediateQuery.status === "failed") {
        await updateFoodOrder(id, {
          status: "failed",
          lastError: immediateQuery.resultDesc || "M-Pesa transaction failed",
        });
        return NextResponse.json(
          { error: immediateQuery.resultDesc || "M-Pesa transaction failed", raw: immediateQuery.raw },
          { status: 502 }
        );
      }
      if (immediateQuery.ok && immediateQuery.status === "success") {
        const latest = await getFoodOrderById(id);
        if (latest && latest.status !== "paid") {
          await markFoodOrderPaidWithNotify(latest, {
            paymentProvider: "mpesa",
            mpesa: latest.mpesa,
          });
        }
        return NextResponse.json({ ok: true, message: "M-Pesa payment confirmed." });
      }
      return NextResponse.json({
        ok: true,
        pending: true,
        message: "STK sent. Waiting for phone prompt/approval...",
      });
    }

    const booking = await getBookingById(id);
    if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    if (booking.status === "paid") return NextResponse.json({ error: "Already paid" }, { status: 400 });
    if (booking.status === "processing_mpesa") {
      return NextResponse.json(
        { error: "STK already sent. Approve the prompt on your phone, or wait a minute and try again." },
        { status: 409 }
      );
    }
    if (!payable(booking.status)) {
      return NextResponse.json({ error: "Booking is not payable in this state" }, { status: 400 });
    }

    const push = await mpesaStkPush({
      amountKes: booking.totalKes,
      phone254: msisdn,
      accountReference: `BOOK-${booking.id.slice(0, 8)}`,
      transactionDesc: "Lemach room",
    });

    try {
      const fresh = await getBookingById(id);
      if (!fresh || fresh.status === "paid") {
        // no-op
      } else if (!push.ok) {
        await updateBooking(id, { lastError: push.error });
      } else {
        await updateBooking(id, {
          status: "processing_mpesa",
          paymentProvider: "mpesa",
          lastError: null,
          mpesa: {
            ...fresh.mpesa,
            checkoutRequestId: push.checkoutRequestId,
            merchantRequestId: push.merchantRequestId,
            phone: msisdn,
          },
        });
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to update booking";
      return NextResponse.json({ error: msg }, { status: 500 });
    }

    if (!push.ok) {
      return NextResponse.json({ error: push.error, raw: push.raw }, { status: 502 });
    }
    const immediateQuery = await mpesaStkQuery(push.checkoutRequestId);
    if (immediateQuery.ok && immediateQuery.status === "failed") {
      await updateBooking(id, {
        status: "failed",
        lastError: immediateQuery.resultDesc || "M-Pesa transaction failed",
      });
      return NextResponse.json(
        { error: immediateQuery.resultDesc || "M-Pesa transaction failed", raw: immediateQuery.raw },
        { status: 502 }
      );
    }
    if (immediateQuery.ok && immediateQuery.status === "success") {
      const latest = await getBookingById(id);
      if (latest && latest.status !== "paid") {
        await markBookingPaidWithNotify(latest, {
          paymentProvider: "mpesa",
          mpesa: latest.mpesa,
        });
      }
      return NextResponse.json({ ok: true, message: "M-Pesa payment confirmed." });
    }
    return NextResponse.json({
      ok: true,
      pending: true,
      message: "STK sent. Waiting for phone prompt/approval...",
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "M-Pesa STK request failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
