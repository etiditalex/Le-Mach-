import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book Your Stay",
  description:
    "Book your stay at Lemach Hotel & Accommodations, Kilifi County, Kenya. Reserve rooms online with ease.",
  openGraph: {
    title: "Book Your Stay | Lemach Hotel & Accommodations",
    description:
      "Book your stay at Lemach Hotel in Kilifi County, Kenya. Reserve rooms online.",
    url: "https://lemach.co.ke/booking",
  },
};

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
