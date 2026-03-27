/**
 * Public site URL for metadata (Open Graph, canonical) and env-aware links.
 * On Vercel set NEXT_PUBLIC_APP_URL to your production domain (e.g. https://lemach.co.ke).
 */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  const vercel = process.env.VERCEL_URL?.replace(/^https?:\/\//, "").trim();
  if (vercel) return `https://${vercel}`;
  return "https://lemach.co.ke";
}

/** Square logo — favicons / apple touch */
export const SITE_LOGO_ICON_URL =
  "https://res.cloudinary.com/dyfnobo9r/image/upload/c_fill,w_192,h_192,g_center,f_auto,q_auto/v1766037561/Le_mach_Logo_g7q4n4.jpg";

/** Social preview (WhatsApp, Facebook, X, LinkedIn) */
export const SITE_OG_IMAGE_URL =
  "https://res.cloudinary.com/dyfnobo9r/image/upload/c_fill,w_1200,h_630,g_center,f_auto,q_auto/v1766037561/Le_mach_Logo_g7q4n4.jpg";
