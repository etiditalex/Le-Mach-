import Link from "next/link";
import { BedDouble, ChevronRight, UtensilsCrossed, Wallet } from "lucide-react";
import { requireAdminUser } from "@/lib/admin-auth";
import { adminGreetingName, formatCount, formatKsh, percentChange } from "@/lib/admin-display";
import { blankAdminOverview, fetchAdminOverview } from "@/lib/repositories/admin-overview";
import { HOTEL_WHATSAPP_DISPLAY, isHotelWhatsAppConfigured } from "@/lib/whatsapp";
import {
  adminCardClass,
  adminCardTitle,
  adminDescription,
  adminGreeting,
  adminLabel,
  adminMainTotal,
  adminMicro,
  adminName,
  adminTable,
  adminTableHead,
} from "@/components/admin/admin-styles";
import MetricCard, { Sparkline } from "@/components/admin/MetricCard";
import RevenueChart from "@/components/admin/RevenueChart";
import StatusBadge from "@/components/admin/StatusBadge";
import NotificationsWidgetClient, { NotificationsListClient } from "@/app/admin/NotificationsWidgetClient";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const user = await requireAdminUser();
  let overview = blankAdminOverview();
  let err: string | null = null;
  try {
    overview = await fetchAdminOverview();
  } catch (e) {
    err = e instanceof Error ? e.message : "Could not load data";
  }

  const paidTotal = overview.paidFoodKes + overview.paidBookingsKes;
  const splitTotal = paidTotal;
  const foodShare = splitTotal > 0 ? (overview.paidFoodKes / splitTotal) * 100 : 0;
  const bookingShare = splitTotal > 0 ? 100 - foodShare : 0;
  const change = percentChange(overview.weekPaidKes, overview.previousWeekPaidKes);

  const records = [
    ...overview.recentFood.map((order) => ({
      id: `food-${order.id}`,
      guest: order.guest_name,
      type: "Food order",
      detail: order.room_number ? `Room ${order.room_number}` : "No room",
      status: order.status,
      total: order.total_kes,
      created_at: order.created_at,
    })),
    ...overview.recentBookings.map((booking) => ({
      id: `booking-${booking.id}`,
      guest: `${booking.first_name} ${booking.last_name}`.trim(),
      type: "Booking",
      detail: booking.room_name,
      status: booking.status,
      total: booking.total_kes,
      created_at: booking.created_at,
    })),
  ]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 8);

  return (
    <div className="space-y-5">
      {!isHotelWhatsAppConfigured() && (
        <div className={`rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900 ${adminDescription}`}>
          WhatsApp delivery to {HOTEL_WHATSAPP_DISPLAY} is not switched on yet. Add{" "}
          <code className="rounded bg-amber-100 px-1">CALLMEBOT_APIKEY</code> (or the WhatsApp Cloud API keys) in the
          server environment, then restart the app. Orders still appear here.
        </div>
      )}

      {err && (
        <div className={`rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900 ${adminDescription}`}>
          <strong>Data error:</strong> {err}. Confirm{" "}
          <code className="rounded bg-amber-100 px-1">SUPABASE_SERVICE_ROLE_KEY</code> in{" "}
          <code className="rounded bg-amber-100 px-1">.env.local</code> and that SQL migrations ran.
        </div>
      )}

      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-12">
        <div className="min-w-0 space-y-5 xl:col-span-5">
          <div>
            <p className={`text-gray-900 ${adminGreeting}`}>Hi, {adminGreetingName(user)}!</p>
            <p className={`mt-1 max-w-md text-gray-500 ${adminDescription}`}>
              Overview of guest orders, bookings, and alerts. New orders and bookings are also sent to WhatsApp{" "}
              {HOTEL_WHATSAPP_DISPLAY}.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <MetricCard
              href="/admin/orders"
              label="Food orders"
              value={formatCount(overview.foodOrdersTotal)}
              icon={<UtensilsCrossed className="h-[18px] w-[18px]" aria-hidden />}
              iconClassName="bg-[#FDE8EC] text-primary"
              spark={
                <Sparkline
                  values={overview.days.map((day) => day.foodOrders)}
                  color="#E31837"
                  label="Food orders created each day for the last 7 days"
                />
              }
            />
            <MetricCard
              href="/admin/orders"
              label="Bookings"
              value={formatCount(overview.bookingsTotal)}
              icon={<BedDouble className="h-[18px] w-[18px]" aria-hidden />}
              iconClassName="bg-[#FFF4CC] text-primary-dark"
              spark={
                <Sparkline
                  values={overview.days.map((day) => day.bookings)}
                  color="#E6B400"
                  label="Bookings created each day for the last 7 days"
                />
              }
            />
            <NotificationsWidgetClient initialUnread={overview.unreadNotifications} />
            <MetricCard
              href="/admin/reports"
              label="All-time paid (KSh)"
              value={paidTotal.toLocaleString("en-KE")}
              icon={<Wallet className="h-[18px] w-[18px]" aria-hidden />}
              iconClassName="bg-[#FDE8EC] text-primary-dark"
              spark={
                <Sparkline
                  values={overview.days.map((day) => day.paidKes)}
                  color="#A51229"
                  label="Paid revenue each day for the last 7 days"
                />
              }
            />
          </div>

          <section className={`${adminCardClass} p-5`}>
            <div className="flex items-center justify-between gap-3">
              <h2 className={`text-gray-900 ${adminCardTitle}`}>Recent activity</h2>
              <Link
                href="/admin/notifications"
                className={`inline-flex items-center gap-0.5 text-gray-500 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${adminMicro}`}
              >
                View all
                <ChevronRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
            <div className="mt-2">
              <NotificationsListClient
                initialNotifications={overview.recentNotifications}
                limit={5}
                variant="activity"
              />
            </div>
          </section>
        </div>

        <div className="min-w-0 space-y-5 xl:col-span-7">
          <RevenueChart points={overview.days} totalKes={overview.weekPaidKes} change={change} />

          <section className={`${adminCardClass} p-5 sm:p-6`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className={`text-gray-900 ${adminCardTitle}`}>Paid breakdown</h2>
                <p className={`mt-1 text-gray-900 tabular-nums ${adminMainTotal}`}>{formatKsh(paidTotal)}</p>
                <p className={`text-gray-500 ${adminDescription}`}>combined paid total</p>
              </div>
            </div>

            {splitTotal <= 0 ? (
              <p className={`mt-6 rounded-xl bg-gray-50 px-4 py-8 text-center text-gray-500 ${adminDescription}`}>
                No paid room service or room bookings yet.
              </p>
            ) : (
              <>
                <div
                  className="mt-5 flex h-10 overflow-hidden rounded-lg"
                  role="img"
                  aria-label={`Room service ${formatKsh(overview.paidFoodKes)}, room bookings ${formatKsh(overview.paidBookingsKes)}`}
                >
                  {foodShare > 0 && <div className="h-full bg-primary" style={{ width: `${foodShare}%` }} />}
                  {bookingShare > 0 && <div className="h-full bg-secondary" style={{ width: `${bookingShare}%` }} />}
                </div>
                <div className="mt-3 flex items-start justify-between gap-4">
                  <div>
                    <p className={`text-gray-900 ${adminLabel}`}>Room service</p>
                    <p className={`mt-0.5 tabular-nums text-gray-500 ${adminLabel}`}>{formatKsh(overview.paidFoodKes)}</p>
                    <p className={`text-gray-400 ${adminLabel}`}>{formatCount(overview.paidFoodCount)} paid</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-gray-900 ${adminLabel}`}>Room bookings</p>
                    <p className={`mt-0.5 tabular-nums text-gray-500 ${adminLabel}`}>{formatKsh(overview.paidBookingsKes)}</p>
                    <p className={`text-gray-400 ${adminLabel}`}>{formatCount(overview.paidBookingCount)} paid</p>
                  </div>
                </div>
              </>
            )}

            <Link
              href="/admin/reports"
              className={`mt-5 flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-3 text-gray-600 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${adminDescription}`}
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-primary shadow-sm">
                <ChevronRight className="h-4 w-4" aria-hidden />
              </span>
              Open the summary report for category and room totals
            </Link>
          </section>
        </div>
      </div>

      <section className={`${adminCardClass} overflow-hidden`}>
        <div className="flex items-center justify-between gap-3 px-5 py-4">
          <h2 className={`text-gray-900 ${adminCardTitle}`}>Recent records</h2>
          <Link
            href="/admin/orders"
            className={`inline-flex items-center gap-0.5 text-gray-500 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${adminMicro}`}
          >
            View all
            <ChevronRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className={`min-w-[720px] w-full ${adminTable}`}>
            <thead>
              <tr className={`border-y border-gray-100 text-left text-gray-500 ${adminTableHead}`}>
                <th className="px-5 py-3 font-medium">Guest</th>
                <th className="px-3 py-3 font-medium">Type</th>
                <th className="px-3 py-3 font-medium">Detail</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-3 py-3 font-medium text-right">Amount</th>
                <th className="px-5 py-3 font-medium text-right">When</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {records.length === 0 ? (
                <tr>
                  <td colSpan={6} className={`px-5 py-10 text-center text-gray-500 ${adminDescription}`}>
                    No orders or bookings yet.
                  </td>
                </tr>
              ) : (
                records.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50/80">
                    <td className={`px-5 py-3.5 text-gray-900 ${adminName}`}>{row.guest}</td>
                    <td className="px-3 py-3.5 text-gray-600">{row.type}</td>
                    <td className="px-3 py-3.5 text-gray-600">{row.detail}</td>
                    <td className="px-3 py-3.5">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className={`px-3 py-3.5 text-right tabular-nums text-gray-900 ${adminName}`}>{formatKsh(row.total)}</td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-right text-gray-500">
                      {new Date(row.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
