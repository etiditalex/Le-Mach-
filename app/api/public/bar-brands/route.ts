import { NextResponse } from "next/server";
import { fetchAllBarBrands } from "@/lib/repositories/bar-brands";

export const runtime = "nodejs";

export async function GET() {
  try {
    const brands = await fetchAllBarBrands();
    return NextResponse.json({ brands });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Bar brands unavailable", brands: [] }, { status: 503 });
  }
}
