import { NextResponse } from "next/server";
import { parseMpesaStkCallback } from "@/lib/mpesa-callback";
import {
  getBookingByMpesaCheckout,
  getBookingById,
  markBookingPaidWithNotify,
  setBookingFailed,
} from "@/lib/repositories/bookings";
import {
  getFoodOrderById,
  getFoodOrderByMpesaCheckout,
  markFoodOrderPaidWithNotify,
  setFoodOrderFailed,
} from "@/lib/repositories/food-orders";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ResultCode: 1, ResultDesc: "Invalid JSON" }, { status: 400 });
  }

  const parsed = parseMpesaStkCallback(json);
  if (!parsed) {
    return NextResponse.json({ ResultCode: 1, ResultDesc: "Invalid callback" }, { status: 400 });
  }

  try {
    const order = await getFoodOrderByMpesaCheckout(parsed.checkoutRequestId);
    if (order) {
      const latest = (await getFoodOrderById(order.id)) ?? order;
      if (parsed.resultCode === 0) {
        if (latest.status !== "paid") {
          if (parsed.amount !== undefined && parsed.amount !== latest.totalKes) {
            await setFoodOrderFailed(latest.id, `M-Pesa amount mismatch (expected ${latest.totalKes})`);
          } else {
            await markFoodOrderPaidWithNotify(latest, {
              paymentProvider: "mpesa",
              mpesa: {
                ...latest.mpesa,
                checkoutRequestId: parsed.checkoutRequestId,
                merchantRequestId: parsed.merchantRequestId,
                receiptNumber: parsed.receipt,
                phone: parsed.phone || latest.mpesa?.phone,
              },
            });
          }
        }
      } else {
        await setFoodOrderFailed(latest.id, parsed.resultDesc || "M-Pesa cancelled or failed");
      }
    } else {
      const booking = await getBookingByMpesaCheckout(parsed.checkoutRequestId);
      if (booking) {
        const latest = (await getBookingById(booking.id)) ?? booking;
        if (parsed.resultCode === 0) {
          if (latest.status !== "paid") {
            if (parsed.amount !== undefined && parsed.amount !== latest.totalKes) {
              await setBookingFailed(latest.id, `M-Pesa amount mismatch (expected ${latest.totalKes})`);
            } else {
              await markBookingPaidWithNotify(latest, {
                paymentProvider: "mpesa",
                mpesa: {
                  ...latest.mpesa,
                  checkoutRequestId: parsed.checkoutRequestId,
                  merchantRequestId: parsed.merchantRequestId,
                  receiptNumber: parsed.receipt,
                  phone: parsed.phone || latest.mpesa?.phone,
                },
              });
            }
          }
        } else {
          await setBookingFailed(latest.id, parsed.resultDesc || "M-Pesa cancelled or failed");
        }
      }
    }
  } catch (e) {
    console.error("mpesa webhook", e);
  }

  return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
}
