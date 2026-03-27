import { NextResponse } from "next/server";
import { fetchAllRooms } from "@/lib/repositories/rooms";

export const runtime = "nodejs";

export async function GET() {
  try {
    const rooms = await fetchAllRooms();
    return NextResponse.json({ rooms });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Rooms unavailable" }, { status: 503 });
  }
}
