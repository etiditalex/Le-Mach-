import Link from "next/link";
import {
  adminCardTitle,
  adminDescription,
  adminLabel,
  adminMainTotal,
  adminMetric,
  adminName,
  adminTable,
  adminTableHead,
} from "@/components/admin/admin-styles";
import { fetchRevenueReport } from "@/lib/repositories/revenue-report";

export const dynamic = "force-dynamic";

function ksh(n: number) {
  return `KSh ${n.toLocaleString()}`;
}

type SearchParams = { from?: string; to?: string };

export default async function AdminReportsPage({ searchParams }: { searchParams: SearchParams }) {
  let report;
  let err: string | null = null;
  try {
    report = await fetchRevenueReport({ from: searchParams.from, to: searchParams.to });
  } catch (e) {
    err = e instanceof Error ? e.message : "Could not load report";
    report = null;
  }

  const fromDefault = searchParams.from ?? "";
  const toDefault = searchParams.to ?? "";

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <Link href="/admin" className={`text-primary hover:underline ${adminLabel}`}>
          ← Dashboard
        </Link>
      </div>

      <form
        method="get"
        action="/admin/reports"
        className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm flex flex-wrap items-end gap-3"
      >
        <div>
          <label htmlFor="from" className={`mb-1 block text-gray-600 ${adminLabel}`}>
            Paid from
          </label>
          <input
            id="from"
            name="from"
            type="date"
            defaultValue={fromDefault}
            className="rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="to" className={`mb-1 block text-gray-600 ${adminLabel}`}>
            Paid through
          </label>
          <input
            id="to"
            name="to"
            type="date"
            defaultValue={toDefault}
            className="rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>
        <button
          type="submit"
          className="h-[42px] rounded-lg bg-primary px-4 py-2 text-white"
        >
          Apply range
        </button>
        <Link
          href="/admin/reports"
          className="inline-flex h-[42px] items-center rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
        >
          All time
        </Link>
      </form>

      {err && (
        <div className={`rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-800 ${adminDescription}`}>{err}</div>
      )}

      {report && (
        <>
          <p className={`text-gray-500 ${adminDescription}`}>
            <span className={`text-gray-700 ${adminName}`}>Period:</span> {report.period.description}
          </p>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className={`mb-4 text-gray-900 ${adminCardTitle}`}>Combined paid total</h2>
            <p className={`tabular-nums text-primary ${adminMainTotal}`}>{ksh(report.combinedPaidKes)}</p>
            <p className={`mt-2 text-gray-500 ${adminDescription}`}>
              Room service orders + room bookings (both paid) in this period.
            </p>
          </div>

          <section className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className={`text-gray-900 ${adminCardTitle}`}>Room service — food &amp; drinks</h2>
              <p className={`mt-1 text-gray-500 ${adminDescription}`}>
                {report.foodOrders.orderCount} paid orders · order totals {ksh(report.foodOrders.sumOrderTotalsKes)}
              </p>
            </div>
            <div className="p-5 space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className={`text-gray-500 ${adminLabel}`}>Food</p>
                  <p className={`mt-1 tabular-nums text-gray-900 ${adminMetric}`}>
                    {ksh(report.foodOrders.buckets.foodKes)}
                  </p>
                  <p className={`mt-1 text-gray-500 ${adminLabel}`}>Breakfast, lunch, dinner, desserts</p>
                </div>
                <div className="rounded-lg bg-amber-50/80 p-4">
                  <p className={`text-gray-600 ${adminLabel}`}>Alcohol</p>
                  <p className={`mt-1 tabular-nums text-amber-900 ${adminMetric}`}>
                    {ksh(report.foodOrders.buckets.alcoholKes)}
                  </p>
                </div>
                <div className="rounded-lg bg-lime-50/80 p-4">
                  <p className={`text-gray-600 ${adminLabel}`}>Juice</p>
                  <p className={`mt-1 tabular-nums text-lime-900 ${adminMetric}`}>
                    {ksh(report.foodOrders.buckets.juiceKes)}
                  </p>
                </div>
                <div className="rounded-lg bg-sky-50/80 p-4">
                  <p className={`text-gray-600 ${adminLabel}`}>Other drinks</p>
                  <p className={`mt-1 tabular-nums text-sky-900 ${adminMetric}`}>
                    {ksh(report.foodOrders.buckets.otherDrinksKes)}
                  </p>
                  <p className={`mt-1 text-gray-500 ${adminLabel}`}>Beverages category</p>
                </div>
                <div className="rounded-lg bg-gray-100 p-4">
                  <p className={`text-gray-500 ${adminLabel}`}>Uncategorized</p>
                  <p className={`mt-1 tabular-nums text-gray-800 ${adminMetric}`}>
                    {ksh(report.foodOrders.buckets.unknownKes)}
                  </p>
                </div>
              </div>
              {report.foodOrders.buckets.sumLineKes !== report.foodOrders.sumOrderTotalsKes && (
                <p className={`rounded-lg bg-amber-50 px-3 py-2 text-amber-800 ${adminLabel}`}>
                  Line breakdown ({ksh(report.foodOrders.buckets.sumLineKes)}) differs from order totals (
                  {ksh(report.foodOrders.sumOrderTotalsKes)}) — often because menu prices or categories changed after
                  orders were placed.
                </p>
              )}

              <div>
                <h3 className={`mb-2 text-gray-800 ${adminCardTitle}`}>By guest room number (room service)</h3>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className={`min-w-full ${adminTable}`}>
                    <thead className={`bg-gray-50 text-left text-gray-600 ${adminTableHead}`}>
                      <tr>
                        <th className="px-3 py-2 font-medium">Room</th>
                        <th className="px-3 py-2 font-medium text-right">Food</th>
                        <th className="px-3 py-2 font-medium text-right">Alcohol</th>
                        <th className="px-3 py-2 font-medium text-right">Juice</th>
                        <th className="px-3 py-2 font-medium text-right">Other bev.</th>
                        <th className="px-3 py-2 font-medium text-right">Other</th>
                        <th className="px-3 py-2 font-medium text-right">Orders</th>
                        <th className="px-3 py-2 font-medium text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {report.foodOrders.byRoom.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="px-3 py-8 text-center text-gray-500">
                            No paid room service in this period.
                          </td>
                        </tr>
                      ) : (
                        report.foodOrders.byRoom.map((r) => (
                          <tr key={r.roomNumber}>
                            <td className={`px-3 py-2 text-gray-900 ${adminName}`}>{r.roomNumber}</td>
                            <td className="px-3 py-2 text-right tabular-nums">{ksh(r.foodKes)}</td>
                            <td className="px-3 py-2 text-right tabular-nums">{ksh(r.alcoholKes)}</td>
                            <td className="px-3 py-2 text-right tabular-nums">{ksh(r.juiceKes)}</td>
                            <td className="px-3 py-2 text-right tabular-nums">{ksh(r.otherDrinksKes)}</td>
                            <td className="px-3 py-2 text-right tabular-nums text-gray-600">{ksh(r.unknownKes)}</td>
                            <td className="px-3 py-2 text-right tabular-nums">{r.orderCount}</td>
                            <td className={`px-3 py-2 text-right tabular-nums ${adminName}`}>{ksh(r.totalKes)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className={`text-gray-900 ${adminCardTitle}`}>Room bookings</h2>
              <p className={`mt-1 text-gray-500 ${adminDescription}`}>
                {report.bookings.bookingCount} paid bookings · {ksh(report.bookings.sumTotalsKes)} total
              </p>
            </div>
            <div className="p-5">
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className={`min-w-full ${adminTable}`}>
                  <thead className={`bg-gray-50 text-left text-gray-600 ${adminTableHead}`}>
                    <tr>
                      <th className="px-3 py-2 font-medium">Room</th>
                      <th className="px-3 py-2 font-medium text-right">Bookings</th>
                      <th className="px-3 py-2 font-medium text-right">Paid total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {report.bookings.byRoom.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-3 py-8 text-center text-gray-500">
                          No paid bookings in this period.
                        </td>
                      </tr>
                    ) : (
                      report.bookings.byRoom.map((r) => (
                        <tr key={r.roomId}>
                          <td className={`px-3 py-2 text-gray-900 ${adminName}`}>{r.roomName}</td>
                          <td className="px-3 py-2 text-right tabular-nums">{r.bookingCount}</td>
                          <td className={`px-3 py-2 text-right tabular-nums ${adminName}`}>{ksh(r.totalKes)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
