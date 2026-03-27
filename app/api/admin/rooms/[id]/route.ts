import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { getServiceSupabase } from "@/lib/supabase/service";

export const runtime = "nodejs";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdminApi();
  if (auth instanceof NextResponse) return auth;

  let body: Partial<{
    name: string;
    description: string;
    price_per_night: number;
    image: string;
  }>;
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const row: Record<string, unknown> = {};
  if (body.name !== undefined) row.name = body.name.trim();
  if (body.description !== undefined) row.description = body.description.trim();
  if (body.price_per_night !== undefined) row.price_per_night = Math.max(0, Math.floor(Number(body.price_per_night)));
  if (body.image !== undefined) row.image = body.image.trim();

  if (Object.keys(row).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const sb = getServiceSupabase();
  const { error } = await sb.from("rooms").update(row).eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdminApi();
  if (auth instanceof NextResponse) return auth;

  const sb = getServiceSupabase();
  const { error } = await sb.from("rooms").delete().eq("id", params.id);

  if (error) {
    if (error.code === "23503" || error.message.includes("foreign key")) {
      return NextResponse.json(
        { error: "Cannot delete: bookings exist for this room. Archive by editing instead." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
