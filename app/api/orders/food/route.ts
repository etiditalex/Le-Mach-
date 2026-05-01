import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { newReceiptKey } from "@/lib/store-keys";
import { fetchMenuItemsByIds } from "@/lib/repositories/menu";
import { insertFoodOrder } from "@/lib/repositories/food-orders";
import type { OrderLine } from "@/lib/hotel-types";

export const runtime = "nodejs";

type Body = {
  items: { id: string; quantity: number }[];
  roomNumber?: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { items, roomNumber, guestName, guestEmail, guestPhone } = body;
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "items required" }, { status: 400 });
  }
  if (!guestName?.trim() || !guestEmail?.trim() || !guestPhone?.trim()) {
    return NextResponse.json({ error: "Guest details are required" }, { status: 400 });
  }

  try {
    const ids = [...new Set(items.map((i) => i.id))];
    const menuMap = await fetchMenuItemsByIds(ids);
    const lines: OrderLine[] = [];
    let totalKes = 0;
    for (const row of items) {
      const menu = menuMap.get(row.id);
      if (!menu) throw new Error(`Unknown menu item: ${row.id}`);
      const qty = Math.max(1, Math.min(99, Math.floor(Number(row.quantity) || 1)));
      lines.push({
        id: menu.id,
        name: menu.name,
        price: menu.price,
        quantity: qty,
      });
      totalKes += menu.price * qty;
    }
    if (totalKes <= 0) throw new Error("Invalid amounts");

    const id = randomUUID();
    const order = {
      id,
      type: "food" as const,
      status: "awaiting_payment" as const,
      lines,
      totalKes,
      roomNumber: roomNumber?.trim() ? roomNumber.trim() : null,
      guestName: guestName.trim(),
      guestEmail: guestEmail.trim(),
      guestPhone: guestPhone.trim(),
      receiptKey: newReceiptKey(),
      createdAt: new Date().toISOString(),
    };

    await insertFoodOrder(order);
    return NextResponse.json({ orderId: id });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to create order";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
