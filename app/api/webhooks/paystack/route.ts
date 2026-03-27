import { NextResponse } from "next/server";
import { verifyPaystackSignature } from "@/lib/paystack";
import { fulfillPaystackReference } from "@/lib/paystack-fulfill";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const raw = await req.text();
  const sig = req.headers.get("x-paystack-signature");
  if (!verifyPaystackSignature(raw, sig)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: { event?: string; data?: { reference?: string } };
  try {
    event = JSON.parse(raw) as { event?: string; data?: { reference?: string } };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (event.event === "charge.success" && event.data?.reference) {
    try {
      await fulfillPaystackReference(event.data.reference);
    } catch (e) {
      console.error("paystack webhook fulfill", e);
    }
  }

  return NextResponse.json({ received: true });
}
