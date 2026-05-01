import Link from "next/link";
import { fetchAdminOverview } from "@/lib/repositories/admin-overview";
import NotificationsWidgetClient from "@/app/admin/NotificationsWidgetClient";
import { NotificationsListClient } from "@/app/admin/NotificationsWidgetClient";

export const dynamic = "force-dynamic";

function formatKsh(n: number) {
  return `KSh ${n.toLocaleString()}`;
}

export default async function AdminDashboardPage() {
  let overview;
  let err: string | null = null;
  try {
    overview = await fetchAdminOverview();
  } catch (e) {
    err = e instanceof Error ? e.message : "Could not load data";
    overview = {
      unreadNotifications: 0,
      foodOrdersTotal: 0,
      bookingsTotal: 0,
      recentFood: [],
      recentBookings: [],
      recentNotifications: [],
    };
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of guest orders, bookings, and alerts.</p>
      </div>

      {err && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 text-amber-900 px-4 py-3 text-sm">
          <strong>Data error:</strong> {err}. Confirm{" "}
          <code className="bg-amber-100 px-1 rounded">SUPABASE_SERVICE_ROLE_KEY</code> in{" "}
          <code className="bg-amber-100 px-1 rounded">.env.local</code> and that SQL migrations ran.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl bg-white border border-gray-200 p-5 shadow-sm sm:col-span-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-gray-900">Paid revenue summary</p>
            <p className="text-sm text-gray-500 mt-0.5">Food &amp; drinks by category and totals per room / booking.</p>
          </div>
          <Link
            href="/admin/reports"
            className="inline-flex justify-center rounded-lg bg-primary text-white px-4 py-2 text-sm font-medium hover:opacity-95"
          >
            Open summary report
          </Link>
        </div>
        <NotificationsWidgetClient
          initialUnread={overview.unreadNotifications}
          initialNotifications={overview.recentNotifications as never}
        />
        <div className="rounded-xl bg-white border border-gray-200 p-5 shadow-sm">
          <p className="text-sm text-gray-500">Food orders (total)</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{overview.foodOrdersTotal}</p>
        </div>
        <div className="rounded-xl bg-white border border-gray-200 p-5 shadow-sm">
          <p className="text-sm text-gray-500">Bookings (total)</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{overview.bookingsTotal}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-semibold text-gray-900">Recent food orders</h2>
            <Link href="/admin/orders" className="text-sm text-primary hover:underline">
              All orders
            </Link>
          </div>
          <ul className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
            {overview.recentFood.length === 0 ? (
              <li className="px-5 py-8 text-center text-gray-500 text-sm">No orders yet.</li>
            ) : (
              overview.recentFood.map((o) => (
                <li key={o.id} className="px-5 py-3 text-sm">
                  <div className="flex justify-between gap-2">
                    <span className="font-medium text-gray-900">{o.guest_name}</span>
                    <span className="text-primary font-medium tabular-nums">{formatKsh(o.total_kes)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 text-xs mt-1">
                    <span>
                      {o.room_number ? `Room ${o.room_number}` : "No room"} · {o.status}
                    </span>
                    <span>{new Date(o.created_at).toLocaleString()}</span>
                  </div>
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-semibold text-gray-900">Recent bookings</h2>
            <Link href="/admin/orders" className="text-sm text-primary hover:underline">
              All bookings
            </Link>
          </div>
          <ul className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
            {overview.recentBookings.length === 0 ? (
              <li className="px-5 py-8 text-center text-gray-500 text-sm">No bookings yet.</li>
            ) : (
              overview.recentBookings.map((b) => (
                <li key={b.id} className="px-5 py-3 text-sm">
                  <div className="flex justify-between gap-2">
                    <span className="font-medium text-gray-900">
                      {b.first_name} {b.last_name}
                    </span>
                    <span className="text-primary font-medium tabular-nums">{formatKsh(b.total_kes)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 text-xs mt-1">
                    <span>
                      {b.room_name} · {b.status}
                    </span>
                    <span>{new Date(b.created_at).toLocaleString()}</span>
                  </div>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>

      <section className="rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-semibold text-gray-900">Recent notifications</h2>
          <Link href="/admin/notifications" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="p-5">
          <NotificationsListClient initialNotifications={overview.recentNotifications as never} limit={10} />
        </div>
      </section>
    </div>
  );
}
