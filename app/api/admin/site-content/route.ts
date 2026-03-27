import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { getServiceSupabase } from "@/lib/supabase/service";

export const runtime = "nodejs";

export async function GET() {
  const auth = await requireAdminApi();
  if (auth instanceof NextResponse) return auth;

  const sb = getServiceSupabase();
  const { data, error } = await sb
    .from("site_content")
    .select("id, slug, title, body, updated_at")
    .order("slug");
  if (error) {
    if (error.message.includes("does not exist") || error.code === "42P01") {
      return NextResponse.json(
        { error: "Run the site_content migration in Supabase SQL Editor.", items: [] },
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

  let body: { slug?: string; title?: string; body?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const slug = body.slug?.trim().replace(/\s+/g, "_").replace(/[^a-z0-9_-]/gi, "_");
  const title = body.title?.trim();
  if (!slug || !title) return NextResponse.json({ error: "slug and title required" }, { status: 400 });

  const text = (body.body ?? "").trim();
  const sb = getServiceSupabase();
  const { data, error } = await sb
    .from("site_content")
    .insert({ slug, title, body: text })
    .select("id")
    .maybeSingle();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
    if (error.message.includes("does not exist") || error.code === "42P01") {
      return NextResponse.json({ error: "Run the site_content migration in Supabase first." }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ id: data?.id });
}
