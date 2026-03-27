import { NextResponse } from "next/server";
import { fetchAllMenuItems } from "@/lib/repositories/menu";

export const runtime = "nodejs";

export async function GET() {
  try {
    const items = await fetchAllMenuItems();
    return NextResponse.json({ items });
  } catch (e) {
    console.error("public menu", e);
    return NextResponse.json({ error: "Menu unavailable. Check Supabase env and migrations." }, { status: 503 });
  }
}
