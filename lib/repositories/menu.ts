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
  const { data, error } = await sb.from("menu_items").select("*").in("id", ids);
  if (error) throw error;
  const map = new Map<string, MenuItemRecord>();
  for (const r of data ?? []) {
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
  return map;
}
