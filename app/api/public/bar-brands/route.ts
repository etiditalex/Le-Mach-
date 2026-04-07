import { NextResponse } from "next/server";
import { fetchAllBarBrands } from "@/lib/repositories/bar-brands";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const brands = await fetchAllBarBrands();
    return NextResponse.json(
      { brands },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Bar brands unavailable", brands: [] },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  }
}
