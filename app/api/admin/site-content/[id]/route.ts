import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { getServiceSupabase } from "@/lib/supabase/service";

export const runtime = "nodejs";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdminApi();
  if (auth instanceof NextResponse) return auth;

  let body: Partial<{ slug: string; title: string; body: string }>;
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const row: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (body.slug !== undefined) {
    row.slug = body.slug.trim().replace(/\s+/g, "_").replace(/[^a-z0-9_-]/gi, "_");
  }
  if (body.title !== undefined) row.title = body.title.trim();
  if (body.body !== undefined) row.body = body.body.trim();

  if (Object.keys(row).length <= 1) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const sb = getServiceSupabase();
  const { error } = await sb.from("site_content").update(row).eq("id", params.id);
  if (error) {
    if (error.code === "23505") return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdminApi();
  if (auth instanceof NextResponse) return auth;

  const sb = getServiceSupabase();
  const { error } = await sb.from("site_content").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}
