import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { getServiceSupabase } from "@/lib/supabase/service";
import { slugify } from "@/lib/slug";

export const runtime = "nodejs";

const CATEGORIES = ["breakfast", "lunch", "dinner", "desserts", "beverages", "alcohol", "juice"] as const;

export async function GET() {
  const auth = await requireAdminApi();
  if (auth instanceof NextResponse) return auth;

  const sb = getServiceSupabase();
  const { data, error } = await sb.from("menu_items").select("*").order("category").order("id");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data ?? [] });
}

export async function POST(req: Request) {
  const auth = await requireAdminApi();
  if (auth instanceof NextResponse) return auth;

  let body: {
    id?: string;
    name?: string;
    description?: string;
    price?: number;
    image?: string;
    category?: string;
  };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = body.name?.trim();
  if (!name) return NextResponse.json({ error: "name required" }, { status: 400 });

  const category = body.category?.trim().toLowerCase();
  if (!category || !CATEGORIES.includes(category as (typeof CATEGORIES)[number])) {
    return NextResponse.json({ error: `category must be one of: ${CATEGORIES.join(", ")}` }, { status: 400 });
  }

  const price = Math.max(0, Math.floor(Number(body.price) || 0));
  const description = (body.description ?? "").trim();
  const image = (body.image ?? "").trim() || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop";

  let id = body.id?.trim().replace(/\s+/g, "");
  if (!id) {
    id = `${slugify(name)}-${Date.now().toString(36)}`;
  }

  const sb = getServiceSupabase();
  const { error } = await sb.from("menu_items").insert({
    id,
    name,
    description,
    price,
    image,
    category,
  });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "An item with this id already exists. Choose another id." }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ id });
}
