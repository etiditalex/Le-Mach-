import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Photo gallery of Lemach Hotel & Accommodations, Kilifi County, Kenya. Rooms, facilities, and surroundings.",
  openGraph: {
    title: "Gallery | Lemach Hotel & Accommodations",
    description:
      "Photos of Lemach Hotel in Kilifi County, Kenya. Rooms, pool, and gardens.",
    url: "https://lemach.co.ke/gallery",
  },
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
