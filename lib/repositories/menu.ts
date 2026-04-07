import type { MenuItemRecord } from "@/lib/hotel-types";
import { getServiceSupabase } from "@/lib/supabase/service";

type MenuRow = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
};

export async function fetchAllMenuItems(): Promise<MenuItemRecord[]> {
  const sb = getServiceSupabase();
  const { data, error } = await sb.from("menu_items").select("*").order("category").order("id");
  if (error) throw error;
  return (data ?? []).map((r) => {
    const row = r as MenuRow;
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      price: row.price,
      image: row.image,
      category: row.category,
    };
  });
}

export async function fetchMenuItemsByIds(ids: string[]): Promise<Map<string, MenuItemRecord>> {
  const sb = getServiceSupabase();
  const map = new Map<string, MenuItemRecord>();

  const { data: menuData, error: menuError } = await sb.from("menu_items").select("*").in("id", ids);
  if (menuError) throw menuError;
  for (const r of menuData ?? []) {
    const row = r as MenuRow;
    map.set(row.id, {
      id: row.id,
      name: row.name,
      description: row.description,
      price: row.price,
      image: row.image,
      category: row.category,
    });
  }

  const { data: barData, error: barError } = await sb
    .from("bar_brands")
    .select("id, name, description, price, image_url, category")
    .in("id", ids);
  if (barError && barError.code !== "42P01") throw barError;
  for (const r of barData ?? []) {
    const row = r as {
      id: string;
      name: string;
      description: string;
      price: number;
      image_url: string;
      category: string | null;
    };
    map.set(row.id, {
      id: row.id,
      name: row.name,
      description: row.description ?? "",
      price: row.price,
      image: row.image_url,
      category: row.category ?? "wines",
    });
  }

  return map;
}
