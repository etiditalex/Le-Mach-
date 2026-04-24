import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { requireAdminApi } from "@/lib/admin-auth";

export const runtime = "nodejs";

function resolveSiteUrl(req: Request): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim() || process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_URL?.trim().replace(/^https?:\/\//, "").replace(/\/$/, "");
  if (vercel) return `https://${vercel}`;
  return new URL(req.url).origin.replace(/\/$/, "");
}

export async function GET(req: Request) {
  const auth = await requireAdminApi();
  if (auth instanceof NextResponse) return auth;

  const siteUrl = resolveSiteUrl(req);
  const menuUrl = `${siteUrl}/bar-restaurant`;
  const png = await QRCode.toBuffer(menuUrl, {
    type: "png",
    width: 900,
    margin: 2,
    errorCorrectionLevel: "M",
  });

  return new NextResponse(png, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": 'attachment; filename="lemach-menu-qr.png"',
      "Cache-Control": "private, no-store",
    },
  });
}
