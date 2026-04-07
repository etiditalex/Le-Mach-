import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const sb = getServiceSupabase();
  const { data, error } = await sb
    .from("bar_brands")
    .select("id, name, description, category, price, image_url, sort_order")
    .eq("id", params.id)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      {
        status: 400,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }
  if (!data) {
    return NextResponse.json(
      { error: "Brand not found" },
      {
        status: 404,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }

  const row = data as {
    id: string;
    name: string;
    description: string;
    category: string | null;
    price: number;
    image_url: string;
    sort_order: number;
  };

  return NextResponse.json(
    {
      brand: {
        id: row.id,
        name: row.name,
        description: row.description ?? "",
        category: row.category ?? "wines",
        price: row.price,
        imageUrl: row.image_url,
        sortOrder: row.sort_order,
      },
    },
    {
      headers: { "Cache-Control": "no-store" },
    }
  );
}
