import { getServiceSupabase } from "@/lib/supabase/service";
import type { BarBrandRecord } from "@/lib/hotel-types";

type Row = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string | null;
  image_url: string;
  sort_order: number;
};

export async function fetchAllBarBrands(): Promise<BarBrandRecord[]> {
  const sb = getServiceSupabase();
  const { data, error } = await sb
    .from("bar_brands")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((raw) => {
    const r = raw as Row;
    return {
      id: r.id,
      name: r.name,
      description: r.description,
      price: r.price,
      category: (r.category ?? "wines").trim() || "wines",
      imageUrl: r.image_url,
      sortOrder: r.sort_order,
    };
  });
}
