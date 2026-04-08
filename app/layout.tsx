import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import SiteChrome from "@/components/SiteChrome";
import DrinksQrBanner from "@/components/DrinksQrBanner";
import { getSiteUrl, SITE_LOGO_ICON_URL, SITE_OG_IMAGE_URL } from "@/lib/site";

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
    "Luxury hotel and accommodations in Kilifi County, Kenya. Experience world-class hospitality, dining, and events.",
  keywords: ["Lemach Hotel", "Kilifi County", "Kenya hotel", "accommodation", "luxury hotel", "Lemach"],
  authors: [{ name: "Lemach Hotel & Accommodations" }],
  creator: "Lemach Hotel & Accommodations",
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: siteUrl,
    siteName: "Lemach Hotel & Accommodations",
    title: "Lemach Hotel & Accommodations - Kilifi County, Kenya",
    description:
      "Luxury hotel and accommodations in Kilifi County, Kenya. Experience world-class hospitality, dining, and events.",
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
    title: "Lemach Hotel & Accommodations - Kilifi County, Kenya",
    description:
      "Luxury hotel and accommodations in Kilifi County, Kenya. Experience world-class hospitality, dining, and events.",
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
        <CartProvider>
          <SiteChrome>{children}</SiteChrome>
          <DrinksQrBanner />
        </CartProvider>
      </body>
    </html>
  );
}
