import { NextResponse } from "next/server";

export const runtime = "nodejs";

function authorized(req: Request): boolean {
  const expected = process.env.MPESA_DIAGNOSTICS_TOKEN?.trim();
  if (!expected) return false;
  const got = req.headers.get("x-mpesa-diagnostics-token")?.trim();
  return Boolean(got && got === expected);
}

function mask(value: string | undefined): string | null {
  const v = value?.trim() || "";
  if (!v) return null;
  if (v.length <= 8) return `${"*".repeat(v.length)}`;
  return `${v.slice(0, 4)}${"*".repeat(v.length - 8)}${v.slice(-4)}`;
}

export async function GET(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json(
      {
        ok: false,
        error: "Unauthorized. Send x-mpesa-diagnostics-token header.",
      },
      { status: 401 }
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "";
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || "";

  return NextResponse.json(
    {
      ok: Boolean(supabaseUrl && serviceRole),
      env: {
        NEXT_PUBLIC_SUPABASE_URL: {
          present: Boolean(supabaseUrl),
          length: supabaseUrl.length,
          masked: mask(supabaseUrl),
        },
        SUPABASE_SERVICE_ROLE_KEY: {
          present: Boolean(serviceRole),
          length: serviceRole.length,
          masked: mask(serviceRole),
        },
      },
      notes: [
        "If present=false or length=0 on production, the variable is not available to this deployment.",
        "After updating Vercel env vars, trigger a fresh deployment.",
      ],
    },
    { status: 200 }
  );
}

