import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase/service";

export const runtime = "nodejs";

/** Single snippet by slug, for public pages (e.g. ?slug=tagline_home) */
export async function GET(req: Request) {
  const slug = new URL(req.url).searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "slug query required" }, { status: 400 });
  }

  try {
    const sb = getServiceSupabase();
    const { data, error } = await sb
      .from("site_content")
      .select("slug, title, body, updated_at")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      if (error.message.includes("does not exist") || error.code === "42P01") {
        return NextResponse.json({ error: "Content table not migrated" }, { status: 503 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(data);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Unavailable" }, { status: 503 });
  }
}
