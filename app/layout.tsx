import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import CookieBanner from "@/components/CookieBanner";
import StickyBanner from "@/components/StickyBanner";

export const metadata: Metadata = {
  title: "Lemach Hotel & Accommodations - Kilifi County",
  description: "Luxury hotel and accommodations in Kilifi County, Kenya. Experience world-class hospitality, dining, and events.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <CartProvider>
          <StickyBanner />
          {children}
          <CookieBanner />
        </CartProvider>
      </body>
    </html>
  );
}

