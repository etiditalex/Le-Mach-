import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { newReceiptKey } from "@/lib/store-keys";
import { fetchRoomById } from "@/lib/repositories/rooms";
import { insertBooking } from "@/lib/repositories/bookings";

export const runtime = "nodejs";

type Body = {
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests?: string;
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const {
    roomId,
    checkIn,
    checkOut,
    guests,
    firstName,
    lastName,
    email,
    phone,
    specialRequests,
  } = body;

  if (!roomId || !checkIn || !checkOut || !firstName?.trim() || !lastName?.trim() || !email?.trim() || !phone?.trim()) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const room = await fetchRoomById(roomId);
    if (!room) throw new Error("Invalid room");

    const inD = new Date(checkIn);
    const outD = new Date(checkOut);
    if (outD <= inD) throw new Error("Check-out must be after check-in");

    const diffMs = outD.getTime() - inD.getTime();
    const nights = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    const totalKes = room.pricePerNight * nights;

    const id = randomUUID();
    const booking = {
      id,
      type: "booking" as const,
      status: "awaiting_payment" as const,
      roomId: room.id,
      roomName: room.name,
      pricePerNight: room.pricePerNight,
      nights,
      totalKes,
      checkIn,
      checkOut,
      guests: Math.max(1, Math.min(20, Math.floor(Number(guests) || 1))),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      specialRequests: (specialRequests || "").trim(),
      receiptKey: newReceiptKey(),
      createdAt: new Date().toISOString(),
    };

    await insertBooking(booking);
    return NextResponse.json({ bookingId: id });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to create booking";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
