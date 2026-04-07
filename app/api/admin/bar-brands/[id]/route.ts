import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { getServiceSupabase } from "@/lib/supabase/service";
import { BAR_BRANDS_BUCKET, barBrandPathFromPublicUrl } from "@/lib/storage/bar-brands-bucket";

export const runtime = "nodejs";
const ALLOWED_CATEGORIES = new Set(["wines", "cans", "beers", "whiskey", "vodka"]);

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdminApi();
  if (auth instanceof NextResponse) return auth;

  const { id } = params;
  let body: Partial<{
    name: string;
    description: string;
    category: string;
    price: number;
    image_url: string;
    sort_order: number;
  }>;
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const sb = getServiceSupabase();
  let previousUrl: string | null = null;
  if (body.image_url !== undefined) {
    const { data: existing } = await sb.from("bar_brands").select("image_url").eq("id", id).maybeSingle();
    previousUrl = (existing as { image_url?: string } | null)?.image_url ?? null;
  }

  const row: Record<string, unknown> = {};
  if (body.name !== undefined) row.name = body.name.trim();
  if (body.description !== undefined) row.description = body.description.trim();
  if (body.category !== undefined) {
    const category = body.category.trim().toLowerCase();
    if (!ALLOWED_CATEGORIES.has(category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }
    row.category = category;
  }
  if (body.price !== undefined) row.price = Math.max(0, Math.floor(Number(body.price)));
  if (body.image_url !== undefined) row.image_url = body.image_url.trim();
  if (body.sort_order !== undefined) row.sort_order = Math.floor(Number(body.sort_order));

  if (Object.keys(row).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const { error } = await sb.from("bar_brands").update(row).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  if (
    body.image_url !== undefined &&
    previousUrl &&
    previousUrl !== body.image_url.trim()
  ) {
    const oldPath = barBrandPathFromPublicUrl(previousUrl);
    if (oldPath) {
      await sb.storage.from(BAR_BRANDS_BUCKET).remove([oldPath]);
    }
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdminApi();
  if (auth instanceof NextResponse) return auth;

  const sb = getServiceSupabase();
  const { data: row } = await sb.from("bar_brands").select("image_url").eq("id", params.id).maybeSingle();
  const imageUrl = (row as { image_url?: string } | null)?.image_url;

  const { error } = await sb.from("bar_brands").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  if (imageUrl) {
    const path = barBrandPathFromPublicUrl(imageUrl);
    if (path) await sb.storage.from(BAR_BRANDS_BUCKET).remove([path]);
  }

  return NextResponse.json({ ok: true });
}
