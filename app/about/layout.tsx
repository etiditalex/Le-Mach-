import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Lemach Hotel & Accommodations in Kilifi County, Kenya. Our story, mission, team, and commitment to exceptional hospitality.",
  openGraph: {
    title: "About Us | Lemach Hotel & Accommodations",
    description:
      "Learn about Lemach Hotel & Accommodations in Kilifi County, Kenya. Our story, mission, and commitment to exceptional hospitality.",
    url: "https://lemach.co.ke/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
