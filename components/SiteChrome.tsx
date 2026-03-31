"use client";

import { usePathname } from "next/navigation";
import CookieBanner from "@/components/CookieBanner";
import StickyBanner from "@/components/StickyBanner";

/** Paths that should render without marketing chrome (kiosk / digital signage). */
const MINIMAL_CHROME_PREFIXES = ["/signage"];

function isMinimalChromePath(pathname: string | null): boolean {
  if (!pathname) return false;
  return MINIMAL_CHROME_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const minimal = isMinimalChromePath(pathname);

  if (minimal) {
    return <>{children}</>;
  }

  return (
    <>
      <StickyBanner />
      {children}
      <CookieBanner />
    </>
  );
}
