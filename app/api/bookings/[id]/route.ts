import { NextResponse } from "next/server";
import { getBookingById } from "@/lib/repositories/bookings";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const booking = await getBookingById(id);
    if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({
      id: booking.id,
      status: booking.status,
      totalKes: booking.totalKes,
      receiptKey: booking.receiptKey,
      roomName: booking.roomName,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      lastError: booking.lastError,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
