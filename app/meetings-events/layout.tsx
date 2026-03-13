import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meetings & Events",
  description:
    "Host meetings, conferences, and events at Lemach Hotel & Accommodations, Kilifi County, Kenya. Professional venues and catering.",
  openGraph: {
    title: "Meetings & Events | Lemach Hotel & Accommodations",
    description:
      "Host meetings and events at Lemach Hotel in Kilifi County, Kenya. Professional facilities and catering.",
    url: "https://lemach.co.ke/meetings-events",
  },
};

export default function MeetingsEventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
