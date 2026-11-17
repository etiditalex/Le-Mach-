"use client";

import { usePathname } from "next/navigation";
import CookieBanner from "@/components/CookieBanner";
import StickyBanner from "@/components/StickyBanner";

/** Paths that should render without marketing chrome (kiosk, digital signage, admin). */
function isMinimalChromePath(pathname: string | null): boolean {
  if (!pathname) return false;
  return (
    pathname === "/signage" ||
    pathname.startsWith("/signage/") ||
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/admin-login" ||
    pathname.startsWith("/admin-login/")
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
