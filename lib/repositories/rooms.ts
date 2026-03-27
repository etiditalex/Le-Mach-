import { getServiceSupabase } from "@/lib/supabase/service";
import type { RoomRecord } from "@/lib/hotel-types";

type RoomRow = {
  id: string;
  name: string;
  price_per_night: number;
  image: string;
  description: string;
};

export async function fetchAllRooms(): Promise<RoomRecord[]> {
  const sb = getServiceSupabase();
  const { data, error } = await sb.from("rooms").select("*").order("id");
  if (error) throw error;
  return (data ?? []).map((raw) => {
    const r = raw as RoomRow;
    return {
      id: r.id,
      name: r.name,
      pricePerNight: r.price_per_night,
      image: r.image,
      description: r.description || undefined,
    };
  });
}

export async function fetchRoomById(id: string): Promise<RoomRecord | null> {
  const sb = getServiceSupabase();
  const { data, error } = await sb.from("rooms").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const r = data as RoomRow;
  return {
    id: r.id,
    name: r.name,
    pricePerNight: r.price_per_night,
    image: r.image,
    description: r.description || undefined,
  };
}
