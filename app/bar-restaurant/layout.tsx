import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bar & Restaurant",
  description:
    "Dine at Lemach Hotel's bar and restaurant in Kilifi County, Kenya. Local and international cuisine, premium beverages, and live music.",
  openGraph: {
    title: "Bar & Restaurant | Lemach Hotel & Accommodations",
    description:
      "Dine at Lemach Hotel's restaurant in Kilifi County, Kenya. Exquisite cuisine and premium beverages.",
    url: "https://lemach.co.ke/bar-restaurant",
  },
};

export default function BarRestaurantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
