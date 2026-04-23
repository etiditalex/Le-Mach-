import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "mpesa-b2c-result-webhook",
    message: "Use POST for Daraja B2C result callbacks.",
  });
}

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ResultCode: 1, ResultDesc: "Invalid JSON" }, { status: 400 });
  }

  // Keep raw callback for operational debugging; do not fail callback ack.
  console.log("mpesa b2c result callback", JSON.stringify(json));

  return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
}
