import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { getServiceSupabase } from "@/lib/supabase/service";

export const runtime = "nodejs";

const CATEGORIES = new Set(["breakfast", "lunch", "dinner", "desserts", "beverages", "alcohol", "juice"]);

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdminApi();
  if (auth instanceof NextResponse) return auth;

  const { id } = params;
  let body: Partial<{
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
  }>;
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const row: Record<string, unknown> = {};
  if (body.name !== undefined) row.name = body.name.trim();
  if (body.description !== undefined) row.description = body.description.trim();
  if (body.price !== undefined) row.price = Math.max(0, Math.floor(Number(body.price)));
  if (body.image !== undefined) row.image = body.image.trim();
  if (body.category !== undefined) {
    const c = body.category.trim().toLowerCase();
    if (!CATEGORIES.has(c)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }
    row.category = c;
  }

  if (Object.keys(row).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const sb = getServiceSupabase();
  const { error } = await sb.from("menu_items").update(row).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdminApi();
  if (auth instanceof NextResponse) return auth;

  const sb = getServiceSupabase();
  const { error } = await sb.from("menu_items").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}
