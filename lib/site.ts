/**
 * Public site URL for metadata, sitemap, and canonical links.
 * Prefer an explicit https domain. Ignore localhost and one-off Vercel
 * deployment hosts so Google always sees https://lemach.co.ke.
 */
const CANONICAL_SITE_URL = "https://lemach.co.ke";
const CLOUD = "https://res.cloudinary.com/dyfnobo9r/image/upload";
/** Official Le Mach Hotel & Conferences wordmark (PNG). */
const SITE_LOGO_PATH = "v1774878083/Le_mach_hotel_and_apartment-logo_stscc5.png";

function publicSiteUrl(raw: string | undefined): string | null {
  const value = raw?.trim().replace(/\/$/, "");
  if (!value) return null;

  let url: URL;
  try {
    url = new URL(value.includes("://") ? value : `https://${value}`);
  } catch {
    return null;
  }

  const host = url.hostname.toLowerCase();
  if (host === "localhost" || host === "127.0.0.1" || host.endsWith(".local")) return null;
  // Per-deployment hosts such as le-mach-abc-team-projects.vercel.app are not the public site.
  if (host.endsWith(".vercel.app") && host.includes("-projects")) return null;
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;

  return `https://${host}`;
}

export function getSiteUrl(): string {
  return (
    publicSiteUrl(process.env.NEXT_PUBLIC_SITE_URL) ||
    publicSiteUrl(process.env.NEXT_PUBLIC_APP_URL) ||
    CANONICAL_SITE_URL
  );
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
