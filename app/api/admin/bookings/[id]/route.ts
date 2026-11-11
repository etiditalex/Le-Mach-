import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { deleteBooking } from "@/lib/repositories/bookings";

export const runtime = "nodejs";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdminApi();
  if (auth instanceof NextResponse) return auth;

  const id = params.id?.trim();
  if (!id || !UUID_RE.test(id)) {
    return NextResponse.json({ error: "Invalid booking id" }, { status: 400 });
  }

  try {
    const deleted = await deleteBooking(id);
    if (!deleted) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Could not delete booking";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
