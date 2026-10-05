import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const lastModified = new Date();

  const pages: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/rooms", priority: 0.9, changeFrequency: "weekly" },
    { path: "/rooms/standard", priority: 0.8, changeFrequency: "weekly" },
    { path: "/rooms/deluxe", priority: 0.8, changeFrequency: "weekly" },
    { path: "/rooms/family", priority: 0.8, changeFrequency: "weekly" },
    { path: "/booking", priority: 0.9, changeFrequency: "weekly" },
    { path: "/deals", priority: 0.7, changeFrequency: "weekly" },
    { path: "/about", priority: 0.6, changeFrequency: "monthly" },
    { path: "/gallery", priority: 0.6, changeFrequency: "monthly" },
    { path: "/menu", priority: 0.6, changeFrequency: "weekly" },
    { path: "/bar-restaurant", priority: 0.6, changeFrequency: "weekly" },
    { path: "/meetings-events", priority: 0.6, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
    { path: "/cookies", priority: 0.2, changeFrequency: "yearly" },
  ];

  return pages.map(({ path, priority, changeFrequency }) => ({
    url: `${siteUrl}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
