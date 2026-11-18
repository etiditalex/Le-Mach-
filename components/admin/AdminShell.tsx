"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BedDouble,
  Bell,
  ChevronDown,
  ExternalLink,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  UtensilsCrossed,
  Wine,
  ChefHat,
  X,
} from "lucide-react";
import { adminHeaderTitle, adminLabel, adminMicro, adminNav } from "@/components/admin/admin-styles";
import { SITE_LOGO_URL } from "@/lib/site";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/reports", label: "Summary report", icon: BarChart3 },
  { href: "/admin/menu", label: "Menu items", icon: ChefHat },
  { href: "/admin/rooms", label: "Rooms", icon: BedDouble },
  { href: "/admin/content", label: "Site content", icon: FileText },
  { href: "/admin/bar-brands", label: "Bar brands", icon: Wine },
  { href: "/admin/orders", label: "Orders & bookings", icon: UtensilsCrossed },
  { href: "/admin/notifications", label: "Notifications", icon: Bell },
] as const;

function pageTitle(pathname: string) {
  const match = NAV.find((item) => (item.href === "/admin" ? pathname === "/admin" : pathname === item.href || pathname.startsWith(`${item.href}/`)));
  return match?.label ?? "Admin";
}

function isActive(pathname: string, href: string, exact = false) {
  if (exact || href === "/admin") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NotificationsBell() {
  const [unread, setUnread] = useState<number | null>(null);

  useEffect(() => {
    const es = new EventSource("/api/admin/notifications/stream");
    const onSnapshot = (ev: MessageEvent<string>) => {
      try {
        const snap = JSON.parse(ev.data) as { unread?: number };
        setUnread(typeof snap.unread === "number" ? snap.unread : 0);
      } catch {
        // ignore malformed events
      }
    };
    es.addEventListener("snapshot", onSnapshot as EventListener);
    return () => {
      try {
        es.close();
      } catch {
        // ignore
      }
    };
  }, []);

  const label = unread && unread > 0 ? `Notifications, ${unread} unread` : "Notifications";

  return (
    <Link
      href="/admin/notifications"
      aria-label={label}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
    >
      <Bell className="h-[18px] w-[18px]" aria-hidden />
      {unread != null && unread > 0 && (
        <span className={`absolute -right-1 -top-1 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-white ${adminMicro}`}>
          {unread > 9 ? "9+" : unread}
        </span>
      )}
    </Link>
  );
}

function AccountMenu({ name, email }: { name: string; email: string }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initial = (name || email || "A").trim().charAt(0).toUpperCase();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const signOut = async () => {
    setBusy(true);
    setError(null);
    try {
      const supabase = createBrowserSupabaseClient();
      const { error: signError } = await supabase.auth.signOut();
      if (signError) {
        setError(signError.message);
        setBusy(false);
        return;
      }
      window.location.assign("/admin-login");
    } catch {
      setError("Could not sign out. Try again.");
      setBusy(false);
    }
  };

  return (
    <div className="relative border-t border-gray-100 p-3">
      <button
        type="button"
        className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
      >
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white ${adminNav}`}>
          {initial}
        </span>
        <span className="min-w-0 flex-1">
          <span className={`block truncate text-gray-900 ${adminNav}`}>{name}</span>
          <span className={`block truncate text-gray-500 ${adminLabel}`}>{email || "Admin"}</span>
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>
      {open && (
        <div role="menu" className="absolute bottom-[calc(100%-4px)] left-3 right-3 z-20 rounded-xl border border-gray-100 bg-white p-1 shadow-lg">
          <button
            type="button"
            role="menuitem"
            disabled={busy}
            onClick={() => void signOut()}
            className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:opacity-60 ${adminMicro}`}
          >
            <LogOut className="h-4 w-4" aria-hidden />
            {busy ? "Signing out..." : "Sign out"}
          </button>
          {error && <p className={`px-3 py-1 text-red-600 ${adminLabel}`}>{error}</p>}
        </div>
      )}
    </div>
  );
}

function Sidebar({
  pathname,
  name,
  email,
  onNavigate,
  showClose,
  onClose,
  id,
}: {
  pathname: string;
  name: string;
  email: string;
  onNavigate?: () => void;
  showClose?: boolean;
  onClose?: () => void;
  id?: string;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col bg-white">
      <div className="flex items-center gap-2 px-5 pb-2 pt-5">
        <Link href="/admin" className="min-w-0 flex-1" onClick={onNavigate}>
          <Image
            src={SITE_LOGO_URL}
            alt="Lemach"
            width={200}
            height={48}
            className="h-11 w-auto max-w-full object-contain object-left"
            priority
          />
        </Link>
        {showClose && (
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      <nav id={id} aria-label="Admin" className="flex-1 space-y-1 overflow-y-auto px-3 py-3">
        {NAV.map((item) => {
          const active = isActive(pathname, item.href, "exact" in item && item.exact);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${adminNav} ${
                active ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden />
              {item.label}
            </Link>
          );
        })}
        <Link
          href="/"
          onClick={onNavigate}
          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-gray-500 hover:bg-gray-50 hover:text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${adminNav}`}
        >
          <Home className="h-[18px] w-[18px] shrink-0" aria-hidden />
          Public site
          <ExternalLink className="ml-auto h-3.5 w-3.5 opacity-60" aria-hidden />
        </Link>
      </nav>
      <AccountMenu name={name} email={email} />
    </div>
  );
}

export default function AdminShell({
  children,
  name,
  email,
}: {
  children: React.ReactNode;
  name: string;
  email: string;
}) {
  const pathname = usePathname() || "/admin";
  const [open, setOpen] = useState(false);
  const title = pageTitle(pathname);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      className="min-h-screen overflow-x-hidden bg-[#F4F5F8] text-gray-900 md:grid md:grid-cols-[232px_minmax(0,1fr)] xl:grid-cols-[248px_minmax(0,1fr)]"
      style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
    >
      <aside className="sticky top-0 hidden h-screen border-r border-gray-200/80 bg-white md:block">
        <Sidebar pathname={pathname} name={name} email={email} />
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button type="button" className="absolute inset-0 bg-gray-900/40" aria-label="Close navigation" onClick={() => setOpen(false)} />
          <aside className="relative flex h-full w-[min(248px,88vw)] flex-col bg-white shadow-xl">
            <Sidebar
              pathname={pathname}
              name={name}
              email={email}
              showClose
              onClose={() => setOpen(false)}
              onNavigate={() => setOpen(false)}
              id="admin-nav-drawer"
            />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-gray-200/80 bg-white px-4 sm:px-6">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 md:hidden"
            aria-label="Open navigation"
            aria-expanded={open}
            aria-controls="admin-nav-drawer"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className={`truncate text-gray-900 ${adminHeaderTitle}`}>{title}</h1>
          <div className="ml-auto flex items-center gap-2">
            <NotificationsBell />
          </div>
        </header>
        <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-7 lg:py-6">{children}</main>
      </div>
    </div>
  );
}
