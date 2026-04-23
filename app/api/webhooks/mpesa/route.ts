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

function callbackUrlFromEnv(): string {
  const explicit = process.env.MPESA_CALLBACK_URL?.trim();
  if (explicit) return explicit;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, "");
  if (appUrl) return `${appUrl}/api/webhooks/mpesa`;

  const vercel = process.env.VERCEL_URL?.trim().replace(/^https?:\/\//, "").replace(/\/$/, "");
  if (vercel) return `https://${vercel}/api/webhooks/mpesa`;

  return "/api/webhooks/mpesa";
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "mpesa-webhook",
    callbackUrl: callbackUrlFromEnv(),
    message: "Use POST for Daraja STK callbacks.",
  });
}

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
          if (parsed.amount === undefined || !parsed.receipt) {
            await setFoodOrderFailed(latest.id, "Incomplete M-Pesa callback metadata");
          } else if (Math.round(parsed.amount) !== latest.totalKes) {
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
            if (parsed.amount === undefined || !parsed.receipt) {
              await setBookingFailed(latest.id, "Incomplete M-Pesa callback metadata");
            } else if (Math.round(parsed.amount) !== latest.totalKes) {
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
