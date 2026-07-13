export const ROOMS_BUCKET = "rooms";

/** Extract object path from Supabase Storage public URL for this bucket. */
export function roomPathFromPublicUrl(publicUrl: string): string | null {
  const marker = `/object/public/${ROOMS_BUCKET}/`;
  const i = publicUrl.indexOf(marker);
  if (i === -1) return null;
  try {
    return decodeURIComponent(publicUrl.slice(i + marker.length));
  } catch {
    return null;
  }
}
