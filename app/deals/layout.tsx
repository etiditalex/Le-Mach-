import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Deals & Packages",
  description:
    "Special deals and packages at Lemach Hotel & Accommodations, Kilifi County, Kenya. Family, business, and romantic getaways.",
  openGraph: {
    title: "Deals & Packages | Lemach Hotel & Accommodations",
    description:
      "Special offers and packages at Lemach Hotel in Kilifi County, Kenya.",
    url: "https://lemach.co.ke/deals",
  },
};

export default function DealsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
