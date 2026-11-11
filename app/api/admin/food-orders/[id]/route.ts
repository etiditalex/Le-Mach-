import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { deleteFoodOrder } from "@/lib/repositories/food-orders";

export const runtime = "nodejs";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdminApi();
  if (auth instanceof NextResponse) return auth;

  const id = params.id?.trim();
  if (!id || !UUID_RE.test(id)) {
    return NextResponse.json({ error: "Invalid order id" }, { status: 400 });
  }

  try {
    const deleted = await deleteFoodOrder(id);
    if (!deleted) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Could not delete order";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
