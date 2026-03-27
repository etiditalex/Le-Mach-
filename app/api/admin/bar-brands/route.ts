import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { getServiceSupabase } from "@/lib/supabase/service";

export const runtime = "nodejs";

export async function GET() {
  const auth = await requireAdminApi();
  if (auth instanceof NextResponse) return auth;

  const sb = getServiceSupabase();
  const { data, error } = await sb
    .from("bar_brands")
    .select("id, name, description, price, image_url, sort_order, created_at")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    if (error.message.includes("does not exist") || error.code === "42P01") {
      return NextResponse.json(
        { error: "Run the bar_brands migration in Supabase.", items: [] },
        { status: 200 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ items: data ?? [] });
}

export async function POST(req: Request) {
  const auth = await requireAdminApi();
  if (auth instanceof NextResponse) return auth;

  let body: { name?: string; description?: string; price?: number; image_url?: string; sort_order?: number };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = body.name?.trim();
  if (!name) return NextResponse.json({ error: "name required" }, { status: 400 });

  const image_url = body.image_url?.trim();
  if (!image_url) return NextResponse.json({ error: "image required — upload a file first" }, { status: 400 });

  const description = (body.description ?? "").trim();
  const price = Math.max(0, Math.floor(Number(body.price) || 0));
  const sort_order = Math.floor(Number(body.sort_order) || 0);

  const sb = getServiceSupabase();
  const { data, error } = await sb
    .from("bar_brands")
    .insert({ name, description, price, image_url, sort_order })
    .select("id")
    .maybeSingle();

  if (error) {
    if (error.message.includes("does not exist") || error.code === "42P01") {
      return NextResponse.json({ error: "Run the bar_brands migration in Supabase first." }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ id: data?.id });
}
