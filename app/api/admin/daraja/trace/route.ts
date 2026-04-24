import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { getBookingById } from "@/lib/repositories/bookings";
import { getFoodOrderById } from "@/lib/repositories/food-orders";
import { mpesaStkQuery } from "@/lib/mpesa";

export const runtime = "nodejs";

type TracePayload = {
  target?: "food" | "booking";
  id?: string;
  includeLiveQuery?: boolean;
};

async function buildTrace(target: "food" | "booking", id: string, includeLiveQuery: boolean) {
  if (target === "food") {
    const order = await getFoodOrderById(id);
    if (!order) return { error: "Order not found", status: 404 as const };
    const checkoutRequestId = order.mpesa?.checkoutRequestId;
    const liveQuery = includeLiveQuery && checkoutRequestId ? await mpesaStkQuery(checkoutRequestId) : null;
    return {
      status: 200 as const,
      data: {
        ok: true,
        target,
        id: order.id,
        paymentStatus: order.status,
        paymentProvider: order.paymentProvider || null,
        totalKes: order.totalKes,
        paidAt: order.paidAt || null,
        lastError: order.lastError || null,
        mpesa: order.mpesa || null,
        liveQuery,
      },
    };
  }

  const booking = await getBookingById(id);
  if (!booking) return { error: "Booking not found", status: 404 as const };
  const checkoutRequestId = booking.mpesa?.checkoutRequestId;
  const liveQuery = includeLiveQuery && checkoutRequestId ? await mpesaStkQuery(checkoutRequestId) : null;
  return {
    status: 200 as const,
    data: {
      ok: true,
      target,
      id: booking.id,
      paymentStatus: booking.status,
      paymentProvider: booking.paymentProvider || null,
      totalKes: booking.totalKes,
      paidAt: booking.paidAt || null,
      lastError: booking.lastError || null,
      mpesa: booking.mpesa || null,
      liveQuery,
    },
  };
}

export async function GET(req: Request) {
  const auth = await requireAdminApi();
  if (auth instanceof NextResponse) return auth;

  const url = new URL(req.url);
  const target = url.searchParams.get("target");
  const id = url.searchParams.get("id");
  const includeLiveQuery = url.searchParams.get("live") !== "0";
  if (!target || !id || (target !== "food" && target !== "booking")) {
    return NextResponse.json(
      { error: "Provide target=food|booking and id query params. Optional: live=0 to skip Daraja query." },
      { status: 400 }
    );
  }
  const result = await buildTrace(target, id, includeLiveQuery);
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json(result.data, { status: result.status });
}

export async function POST(req: Request) {
  const auth = await requireAdminApi();
  if (auth instanceof NextResponse) return auth;

  let body: TracePayload;
  try {
    body = (await req.json()) as TracePayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const target = body.target;
  const id = body.id;
  const includeLiveQuery = body.includeLiveQuery !== false;
  if (!target || !id || (target !== "food" && target !== "booking")) {
    return NextResponse.json(
      { error: "Provide target=food|booking and id. Optional: includeLiveQuery=false." },
      { status: 400 }
    );
  }

  const result = await buildTrace(target, id, includeLiveQuery);
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json(result.data, { status: result.status });
}
