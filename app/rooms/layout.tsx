import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rooms & Accommodation",
  description:
    "Explore rooms and suites at Lemach Hotel & Accommodations, Kilifi County, Kenya. Luxury accommodation with modern amenities.",
  openGraph: {
    title: "Rooms & Accommodation | Lemach Hotel & Accommodations",
    description:
      "Luxury rooms and suites at Lemach Hotel in Kilifi County, Kenya.",
    url: "https://lemach.co.ke/rooms",
  },
};

export default function RoomsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
