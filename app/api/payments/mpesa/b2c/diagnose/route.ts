import { NextResponse } from "next/server";
import { diagnoseMpesaB2cConfig } from "@/lib/mpesa-b2c";

export const runtime = "nodejs";

function authorized(req: Request): boolean {
  const expected = process.env.MPESA_B2C_API_TOKEN?.trim();
  if (!expected) return false;
  const got = req.headers.get("x-mpesa-b2c-token")?.trim();
  return Boolean(got && got === expected);
}

export async function GET(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json(
      {
        ok: false,
        error: "Unauthorized. Set MPESA_B2C_API_TOKEN and send x-mpesa-b2c-token header.",
      },
      { status: 401 }
    );
  }

  const result = await diagnoseMpesaB2cConfig();
  return NextResponse.json(result, { status: result.ok ? 200 : 422 });
}
