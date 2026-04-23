import { NextResponse } from "next/server";
import { mpesaB2cPayout } from "@/lib/mpesa-b2c";

export const runtime = "nodejs";

type Body = {
  phone: string;
  amountKes: number;
  remarks?: string;
  occasion?: string;
  commandId?: "BusinessPayment" | "SalaryPayment" | "PromotionPayment";
};

function authorized(req: Request): boolean {
  const expected = process.env.MPESA_B2C_API_TOKEN?.trim();
  if (!expected) return false;
  const got = req.headers.get("x-mpesa-b2c-token")?.trim();
  return Boolean(got && got === expected);
}

export async function POST(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json(
      {
        ok: false,
        error: "Unauthorized. Set MPESA_B2C_API_TOKEN and send x-mpesa-b2c-token header.",
      },
      { status: 401 }
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const result = await mpesaB2cPayout({
    phone: body.phone,
    amountKes: body.amountKes,
    remarks: body.remarks,
    occasion: body.occasion,
    commandId: body.commandId,
  });

  return NextResponse.json(result, { status: result.ok ? 200 : 422 });
}
