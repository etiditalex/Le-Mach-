export const BAR_BRANDS_BUCKET = "bar-brands";

/** Extract object path from Supabase Storage public URL for this bucket. */
export function barBrandPathFromPublicUrl(publicUrl: string): string | null {
  const marker = `/object/public/${BAR_BRANDS_BUCKET}/`;
  const i = publicUrl.indexOf(marker);
  if (i === -1) return null;
  try {
    return decodeURIComponent(publicUrl.slice(i + marker.length));
  } catch {
    return null;
  }
}
