import Link from "next/link";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import { requireAdminUser } from "@/lib/admin-auth";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Bell,
  Home,
  ExternalLink,
  ChefHat,
  BedDouble,
  FileText,
  Wine,
  BarChart3,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdminUser();

  return (
    <div className="min-h-screen flex">
      <aside className="w-56 shrink-0 border-r border-zinc-800 bg-zinc-900 hidden sm:flex flex-col">
        <div className="p-4 border-b border-zinc-800">
          <p className="text-xs uppercase tracking-wider text-zinc-500 font-medium">Lemach</p>
          <p className="text-lg font-bold text-primary">Admin</p>
        </div>
        <nav className="p-3 space-y-1 flex-1">
          <Link
            href="/admin"
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <Link
            href="/admin/reports"
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white"
          >
            <BarChart3 className="w-4 h-4" />
            Summary report
          </Link>
          <Link
            href="/admin/menu"
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white"
          >
            <ChefHat className="w-4 h-4" />
            Menu items
          </Link>
          <Link
            href="/admin/rooms"
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white"
          >
            <BedDouble className="w-4 h-4" />
            Rooms
          </Link>
          <Link
            href="/admin/content"
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white"
          >
            <FileText className="w-4 h-4" />
            Site content
          </Link>
          <Link
            href="/admin/bar-brands"
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white"
          >
            <Wine className="w-4 h-4" />
            Bar brands
          </Link>
          <Link
            href="/admin/orders"
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white"
          >
            <UtensilsCrossed className="w-4 h-4" />
            Orders & bookings
          </Link>
          <Link
            href="/admin/notifications"
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white"
          >
            <Bell className="w-4 h-4" />
            Notifications
          </Link>
        </nav>
        <div className="p-3 border-t border-zinc-800">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
          >
            <Home className="w-4 h-4" />
            Public site
            <ExternalLink className="w-3 h-3 opacity-50 ml-auto" />
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 bg-[#f8f6f3] text-gray-900">
        <header className="sm:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <span className="font-bold text-primary">Lemach Admin</span>
          <Link href="/" className="text-sm text-gray-600 hover:text-primary">
            Site
          </Link>
        </header>
        <main className="flex-1 p-4 sm:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
