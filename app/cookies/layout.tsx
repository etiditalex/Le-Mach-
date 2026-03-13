import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Cookie policy for Lemach Hotel & Accommodations website. How we use cookies and your choices.",
  openGraph: {
    title: "Cookie Policy | Lemach Hotel & Accommodations",
    description: "Cookie policy for Lemach Hotel website.",
    url: "https://lemach.co.ke/cookies",
  },
};

export default function CookiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
