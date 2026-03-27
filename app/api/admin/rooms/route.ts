import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { getServiceSupabase } from "@/lib/supabase/service";
import { slugify } from "@/lib/slug";

export const runtime = "nodejs";

export async function GET() {
  const auth = await requireAdminApi();
  if (auth instanceof NextResponse) return auth;

  const sb = getServiceSupabase();
  const { data, error } = await sb.from("rooms").select("*").order("id");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ rooms: data ?? [] });
}

export async function POST(req: Request) {
  const auth = await requireAdminApi();
  if (auth instanceof NextResponse) return auth;

  let body: {
    id?: string;
    name?: string;
    description?: string;
    price_per_night?: number;
    image?: string;
  };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = body.name?.trim();
  if (!name) return NextResponse.json({ error: "name required" }, { status: 400 });

  let id = body.id?.trim().replace(/\s+/g, "");
  if (!id) id = slugify(name);

  const price = Math.max(0, Math.floor(Number(body.price_per_night) || 0));
  const description = (body.description ?? "").trim();
  const image =
    (body.image ?? "").trim() ||
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&h=800&fit=crop";

  const sb = getServiceSupabase();
  const { error } = await sb.from("rooms").insert({
    id,
    name,
    description,
    price_per_night: price,
    image,
  });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "A room with this id already exists." }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ id });
}
