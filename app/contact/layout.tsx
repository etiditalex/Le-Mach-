import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact Lemach Hotel & Accommodations in Kilifi County, Kenya. Get in touch for reservations, enquiries, and directions.",
  openGraph: {
    title: "Contact Us | Lemach Hotel & Accommodations",
    description:
      "Contact Lemach Hotel in Kilifi County, Kenya. Reservations, enquiries, and directions.",
    url: "https://lemach.co.ke/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
