import { NextResponse } from "next/server";
import { parseMpesaStkCallback } from "@/lib/mpesa-callback";
import { finalizeDarajaStkFromItems } from "@/lib/daraja-finalize-stk-from-items";

export const runtime = "nodejs";

function callbackUrlFromEnv(): string {
  const explicit = process.env.MPESA_CALLBACK_URL?.trim();
  if (explicit) return explicit;

  const appUrl = (process.env.NEXT_PUBLIC_SITE_URL?.trim() || process.env.NEXT_PUBLIC_APP_URL?.trim() || "").replace(
    /\/$/,
    ""
  );
  if (appUrl) return `${appUrl}/api/daraja/callback`;

  const vercel = process.env.VERCEL_URL?.trim().replace(/^https?:\/\//, "").replace(/\/$/, "");
  if (vercel) return `https://${vercel}/api/daraja/callback`;

  return "/api/daraja/callback";
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "mpesa-webhook",
    callbackUrl: callbackUrlFromEnv(),
    message: "Use POST for Daraja STK callbacks.",
  });
}

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ResultCode: 1, ResultDesc: "Invalid JSON" }, { status: 400 });
  }

  const parsed = parseMpesaStkCallback(json);
  if (!parsed) {
    return NextResponse.json({ ResultCode: 1, ResultDesc: "Invalid callback" }, { status: 400 });
  }

  try {
    await finalizeDarajaStkFromItems({
      checkoutRequestId: parsed.checkoutRequestId,
      merchantRequestId: parsed.merchantRequestId,
      resultCode: parsed.resultCode,
      resultDesc: parsed.resultDesc,
      amount: parsed.amount,
      receipt: parsed.receipt,
      phone: parsed.phone,
      source: "callback",
    });
  } catch (e) {
    console.error("mpesa webhook", e);
  }

  return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
}
