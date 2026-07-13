export const MENU_ITEMS_BUCKET = "menu-items";

/** Extract object path from Supabase Storage public URL for this bucket. */
export function menuItemPathFromPublicUrl(publicUrl: string): string | null {
  const marker = `/object/public/${MENU_ITEMS_BUCKET}/`;
  const i = publicUrl.indexOf(marker);
  if (i === -1) return null;
  try {
    return decodeURIComponent(publicUrl.slice(i + marker.length));
  } catch {
    return null;
  }
}
