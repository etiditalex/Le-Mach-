import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Digital Signage",
  description: "Lemach Hotel — live menu, drinks, and rooms display.",
  appleWebApp: {
    capable: true,
    title: "Le Mach Signage",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function SignageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
