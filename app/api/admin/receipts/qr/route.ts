import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { requireAdminApi } from "@/lib/admin-auth";
import { getBookingById } from "@/lib/repositories/bookings";
import { getFoodOrderById } from "@/lib/repositories/food-orders";

export const runtime = "nodejs";

function resolveSiteUrl(req: Request): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim() || process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_URL?.trim().replace(/^https?:\/\//, "").replace(/\/$/, "");
  if (vercel) return `https://${vercel}`;
  return new URL(req.url).origin.replace(/\/$/, "");
}

export async function GET(req: Request) {
  const auth = await requireAdminApi();
  if (auth instanceof NextResponse) return auth;

  const url = new URL(req.url);
  const target = url.searchParams.get("target");
  const id = url.searchParams.get("id");
  if (!target || !id || (target !== "food" && target !== "booking")) {
    return NextResponse.json({ error: "Provide target=food|booking and id" }, { status: 400 });
  }

  let receiptPath = "";
  let fileStem = "";
  if (target === "food") {
    const order = await getFoodOrderById(id);
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    if (order.status !== "paid" || !order.receiptKey) {
      return NextResponse.json({ error: "QR is available after payment only" }, { status: 409 });
    }
    receiptPath = `/receipt/food/${order.id}?key=${encodeURIComponent(order.receiptKey)}`;
    fileStem = `food-${order.id.slice(0, 8)}`;
  } else {
    const booking = await getBookingById(id);
    if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    if (booking.status !== "paid" || !booking.receiptKey) {
      return NextResponse.json({ error: "QR is available after payment only" }, { status: 409 });
    }
    receiptPath = `/receipt/booking/${booking.id}?key=${encodeURIComponent(booking.receiptKey)}`;
    fileStem = `booking-${booking.id.slice(0, 8)}`;
  }

  const receiptUrl = `${resolveSiteUrl(req)}${receiptPath}`;
  const png = await QRCode.toBuffer(receiptUrl, {
    type: "png",
    width: 900,
    margin: 2,
    errorCorrectionLevel: "M",
  });

  return new NextResponse(new Uint8Array(png), {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `attachment; filename="${fileStem}-receipt-qr.png"`,
      "Cache-Control": "private, no-store",
    },
  });
}
