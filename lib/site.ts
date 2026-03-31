/**
 * Public site URL for metadata (Open Graph, canonical) and env-aware links.
 * On Vercel set NEXT_PUBLIC_APP_URL to your production domain (e.g. https://lemach.co.ke).
 */
const CLOUD = "https://res.cloudinary.com/dyfnobo9r/image/upload";
/** Official Le Mach Hotel & Conferences wordmark (PNG). */
const SITE_LOGO_PATH = "v1774878083/Le_mach_hotel_and_apartment-logo_stscc5.png";

export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  const vercel = process.env.VERCEL_URL?.replace(/^https?:\/\//, "").trim();
  if (vercel) return `https://${vercel}`;
  return "https://lemach.co.ke";
}

/** Full wordmark — header, marketing, anywhere the horizontal logo is shown */
export const SITE_LOGO_URL = `${CLOUD}/f_auto,q_auto/${SITE_LOGO_PATH}`;

/** Square favicon / app icon — crop favors left (icon + sun mark) */
export const SITE_LOGO_ICON_URL = `${CLOUD}/c_fill,w_192,h_192,g_west,f_auto,q_auto/${SITE_LOGO_PATH}`;

/** Open Graph & social preview — logo padded on white */
export const SITE_OG_IMAGE_URL = `${CLOUD}/c_pad,w_1200,h_630,b_rgb:ffffff,f_auto,q_auto/${SITE_LOGO_PATH}`;

/**
 * Default featured YouTube on /signage when no ?youtube= / ?v= and no NEXT_PUBLIC_SIGNAGE_YOUTUBE.
 * @see https://youtu.be/vus8_xcZ2Ok
 */
export const DEFAULT_SIGNAGE_YOUTUBE = "https://youtu.be/vus8_xcZ2Ok";
