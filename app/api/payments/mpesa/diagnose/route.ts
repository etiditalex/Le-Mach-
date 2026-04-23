import { NextResponse } from "next/server";
import { diagnoseMpesaConfig } from "@/lib/mpesa";

export const runtime = "nodejs";

function authorized(req: Request): boolean {
  const expected = process.env.MPESA_DIAGNOSTICS_TOKEN?.trim();
  if (!expected) return false;
  const got = req.headers.get("x-mpesa-diagnostics-token")?.trim();
  return Boolean(got && got === expected);
}

export async function GET(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json(
      {
        ok: false,
        error: "Unauthorized. Set MPESA_DIAGNOSTICS_TOKEN and send it in x-mpesa-diagnostics-token header.",
      },
      { status: 401 }
    );
  }

  const result = await diagnoseMpesaConfig();
  return NextResponse.json(result, { status: result.ok ? 200 : 422 });
}

