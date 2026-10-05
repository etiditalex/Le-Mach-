import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import SiteChrome from "@/components/SiteChrome";
import DrinksQrBanner from "@/components/DrinksQrBanner";
import { getSiteUrl, SITE_LOGO_ICON_URL, SITE_OG_IMAGE_URL } from "@/lib/site";
import HotelJsonLd from "@/components/HotelJsonLd";

const siteUrl = getSiteUrl();

export const viewport: Viewport = {
  themeColor: "#E31837",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Lemach Hotel & Accommodations - Kilifi County, Kenya",
    template: "%s | Lemach Hotel",
  },
  description:
    "Lemach Hotel in Kilifi, Kenya. Stay just off the B69 Highway in Kilifi County for rooms, dining, meetings, gardens, and a pool.",
  keywords: [
    "Lemach Hotel",
    "Lemach Hotel Kilifi",
    "hotel in Kilifi",
    "Kilifi hotel",
    "accommodation in Kilifi",
    "Kilifi County hotel",
    "Le Mach Hotel",
    "hotel off B69 Kilifi",
    "where to stay in Kilifi",
  ],
  category: "hotel",
  other: {
    "geo.region": "KE-14",
    "geo.placename": "Kilifi",
  },
  authors: [{ name: "Lemach Hotel & Accommodations" }],
  creator: "Lemach Hotel & Accommodations",
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: siteUrl,
    siteName: "Lemach Hotel Kilifi",
    title: "Lemach Hotel Kilifi | Hotel in Kilifi County, Kenya",
    description:
      "Lemach Hotel in Kilifi, Kenya. Stay just off the B69 Highway in Kilifi County for rooms, dining, meetings, gardens, and a pool.",
    images: [
      {
        url: SITE_OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: "Lemach Hotel & Accommodations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lemach Hotel Kilifi | Hotel in Kilifi County, Kenya",
    description:
      "Lemach Hotel in Kilifi, Kenya. Stay just off the B69 Highway in Kilifi County for rooms, dining, meetings, gardens, and a pool.",
    images: [SITE_OG_IMAGE_URL],
  },
  icons: {
    icon: [
      { url: SITE_LOGO_ICON_URL, type: "image/png", sizes: "192x192" },
      { url: SITE_LOGO_ICON_URL, type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: SITE_LOGO_ICON_URL, sizes: "180x180" }],
    shortcut: SITE_LOGO_ICON_URL,
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
        <HotelJsonLd />
        <CartProvider>
          <SiteChrome>{children}</SiteChrome>
          <DrinksQrBanner />
        </CartProvider>
      </body>
    </html>
  );
}
