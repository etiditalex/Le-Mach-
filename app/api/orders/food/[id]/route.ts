import { NextResponse } from "next/server";
import { getFoodOrderById } from "@/lib/repositories/food-orders";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const order = await getFoodOrderById(id);
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({
      id: order.id,
      status: order.status,
      paymentProvider: order.paymentProvider,
      totalKes: order.totalKes,
      receiptKey: order.receiptKey,
      guestName: order.guestName,
      roomNumber: order.roomNumber,
      lastError: order.lastError,
      mpesa: order.mpesa,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
