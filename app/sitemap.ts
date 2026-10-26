import type { MetadataRoute } from "next";
import { fetchAllBarBrands } from "@/lib/repositories/bar-brands";
import { fetchAllRooms } from "@/lib/repositories/rooms";
import { getSiteUrl } from "@/lib/site";

export const revalidate = 3600;

type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;

const staticPages: { path: string; priority: number; changeFrequency: ChangeFrequency }[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/rooms", priority: 0.9, changeFrequency: "weekly" },
  { path: "/booking", priority: 0.9, changeFrequency: "weekly" },
  { path: "/meetings-events", priority: 0.8, changeFrequency: "monthly" },
  { path: "/deals", priority: 0.7, changeFrequency: "weekly" },
  { path: "/menu", priority: 0.7, changeFrequency: "weekly" },
  { path: "/bar-restaurant", priority: 0.7, changeFrequency: "weekly" },
  { path: "/contact", priority: 0.6, changeFrequency: "monthly" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/gallery", priority: 0.5, changeFrequency: "monthly" },
  { path: "/cookies", priority: 0.2, changeFrequency: "yearly" },
];

const fallbackRoomIds = ["standard", "deluxe", "family"];

function isPublicSlug(id: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(id);
}

async function extraPaths(): Promise<{ path: string; priority: number; changeFrequency: ChangeFrequency }[]> {
  const paths: { path: string; priority: number; changeFrequency: ChangeFrequency }[] = [];

  try {
    const rooms = await fetchAllRooms();
    const ids = new Set(fallbackRoomIds);
    for (const room of rooms) {
      if (isPublicSlug(room.id)) ids.add(room.id);
    }
    for (const id of ids) {
      paths.push({ path: `/rooms/${id}`, priority: 0.8, changeFrequency: "weekly" });
    }
  } catch {
    for (const id of fallbackRoomIds) {
      paths.push({ path: `/rooms/${id}`, priority: 0.8, changeFrequency: "weekly" });
    }
  }

  try {
    const brands = await fetchAllBarBrands();
    for (const brand of brands) {
      if (!isPublicSlug(brand.id)) continue;
      paths.push({
        path: `/bar-restaurant/brands/${encodeURIComponent(brand.id)}`,
        priority: 0.4,
        changeFrequency: "monthly",
      });
    }
  } catch {
    // Brand pages stay off the sitemap until the catalog is available.
  }

  return paths;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const pages = [...staticPages, ...(await extraPaths())];

  return pages.map(({ path, priority, changeFrequency }) => ({
    url: `${siteUrl}${path}`,
    changeFrequency,
    priority,
  }));
}
