import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Testimonials/Reviews",
  description:
    "Guest reviews of Lemach Hotel in Kilifi, fetched from the hotel's Google Business Profile.",
  openGraph: {
    title: "Testimonials/Reviews | Lemach Hotel",
    description: "Read Google reviews from guests who stayed at Lemach Hotel in Kilifi.",
    url: "https://lemach.co.ke/reviews",
  },
};

export default function ReviewsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
