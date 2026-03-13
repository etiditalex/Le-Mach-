import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "View the food and beverage menu at Lemach Hotel & Accommodations, Kilifi County, Kenya. Order online or dine in.",
  openGraph: {
    title: "Menu | Lemach Hotel & Accommodations",
    description:
      "Food and beverage menu at Lemach Hotel in Kilifi County, Kenya.",
    url: "https://lemach.co.ke/menu",
  },
};

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
