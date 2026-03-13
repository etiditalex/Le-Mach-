import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import CookieBanner from "@/components/CookieBanner";
import StickyBanner from "@/components/StickyBanner";

const SITE_URL = "https://lemach.co.ke";
const DEFAULT_OG_IMAGE = "https://res.cloudinary.com/dyfnobo9r/image/upload/v1766037561/Le_mach_Logo_g7q4n4.jpg";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Lemach Hotel & Accommodations - Kilifi County, Kenya",
    template: "%s | Lemach Hotel",
  },
  description:
    "Luxury hotel and accommodations in Kilifi County, Kenya. Experience world-class hospitality, dining, and events.",
  keywords: ["Lemach Hotel", "Kilifi County", "Kenya hotel", "accommodation", "luxury hotel", "Lemach"],
  authors: [{ name: "Lemach Hotel & Accommodations" }],
  creator: "Lemach Hotel & Accommodations",
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: SITE_URL,
    siteName: "Lemach Hotel & Accommodations",
    title: "Lemach Hotel & Accommodations - Kilifi County, Kenya",
    description:
      "Luxury hotel and accommodations in Kilifi County, Kenya. Experience world-class hospitality, dining, and events.",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Lemach Hotel & Accommodations - Kilifi County, Kenya",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lemach Hotel & Accommodations - Kilifi County, Kenya",
    description:
      "Luxury hotel and accommodations in Kilifi County, Kenya. Experience world-class hospitality, dining, and events.",
    images: [DEFAULT_OG_IMAGE],
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased overflow-x-hidden">
        <CartProvider>
          <StickyBanner />
          {children}
          <CookieBanner />
        </CartProvider>
      </body>
    </html>
  );
}

