import Link from "next/link";
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
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Summary report</h1>
        </div>
        <Link href="/admin" className="text-sm text-zinc-400 hover:text-primary shrink-0">
          ← Dashboard
        </Link>
      </div>

      <form
        method="get"
        action="/admin/reports"
        className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm flex flex-wrap items-end gap-3"
      >
        <div>
          <label htmlFor="from" className="block text-xs font-medium text-gray-600 mb-1">
            Paid from
          </label>
          <input
            id="from"
            name="from"
            type="date"
            defaultValue={fromDefault}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="to" className="block text-xs font-medium text-gray-600 mb-1">
            Paid through
          </label>
          <input
            id="to"
            name="to"
            type="date"
            defaultValue={toDefault}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-primary text-white px-4 py-2 text-sm font-medium h-[42px]"
        >
          Apply range
        </button>
        <Link
          href="/admin/reports"
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm h-[42px] inline-flex items-center text-gray-700 hover:bg-gray-50"
        >
          All time
        </Link>
      </form>

      {err && (
        <div className="rounded-xl border border-red-200 bg-red-50 text-red-800 px-4 py-3 text-sm">{err}</div>
      )}

      {report && (
        <>
          <p className="text-sm text-zinc-400">
            <span className="font-medium text-zinc-300">Period:</span> {report.period.description}
          </p>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Combined paid total</h2>
            <p className="text-3xl font-bold text-primary tabular-nums">{ksh(report.combinedPaidKes)}</p>
            <p className="text-sm text-gray-500 mt-2">
              Room service orders + room bookings (both paid) in this period.
            </p>
          </div>

          <section className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Room service — food &amp; drinks</h2>
              <p className="text-sm text-gray-500 mt-1">
                {report.foodOrders.orderCount} paid orders · order totals {ksh(report.foodOrders.sumOrderTotalsKes)}
              </p>
            </div>
            <div className="p-5 space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Food</p>
                  <p className="text-lg font-bold text-gray-900 tabular-nums mt-1">
                    {ksh(report.foodOrders.buckets.foodKes)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Breakfast, lunch, dinner, desserts</p>
                </div>
                <div className="rounded-lg bg-amber-50/80 p-4">
                  <p className="text-xs text-gray-600 uppercase tracking-wide">Alcohol</p>
                  <p className="text-lg font-bold text-amber-900 tabular-nums mt-1">
                    {ksh(report.foodOrders.buckets.alcoholKes)}
                  </p>
                </div>
                <div className="rounded-lg bg-lime-50/80 p-4">
                  <p className="text-xs text-gray-600 uppercase tracking-wide">Juice</p>
                  <p className="text-lg font-bold text-lime-900 tabular-nums mt-1">
                    {ksh(report.foodOrders.buckets.juiceKes)}
                  </p>
                </div>
                <div className="rounded-lg bg-sky-50/80 p-4">
                  <p className="text-xs text-gray-600 uppercase tracking-wide">Other drinks</p>
                  <p className="text-lg font-bold text-sky-900 tabular-nums mt-1">
                    {ksh(report.foodOrders.buckets.otherDrinksKes)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Beverages category</p>
                </div>
                <div className="rounded-lg bg-gray-100 p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Uncategorized</p>
                  <p className="text-lg font-bold text-gray-800 tabular-nums mt-1">
                    {ksh(report.foodOrders.buckets.unknownKes)}
                  </p>
                </div>
              </div>
              {report.foodOrders.buckets.sumLineKes !== report.foodOrders.sumOrderTotalsKes && (
                <p className="text-xs text-amber-800 bg-amber-50 rounded-lg px-3 py-2">
                  Line breakdown ({ksh(report.foodOrders.buckets.sumLineKes)}) differs from order totals (
                  {ksh(report.foodOrders.sumOrderTotalsKes)}) — often because menu prices or categories changed after
                  orders were placed.
                </p>
              )}

              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-2">By guest room number (room service)</h3>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600 text-left">
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
                            <td className="px-3 py-2 font-medium text-gray-900">{r.roomNumber}</td>
                            <td className="px-3 py-2 text-right tabular-nums">{ksh(r.foodKes)}</td>
                            <td className="px-3 py-2 text-right tabular-nums">{ksh(r.alcoholKes)}</td>
                            <td className="px-3 py-2 text-right tabular-nums">{ksh(r.juiceKes)}</td>
                            <td className="px-3 py-2 text-right tabular-nums">{ksh(r.otherDrinksKes)}</td>
                            <td className="px-3 py-2 text-right tabular-nums text-gray-600">{ksh(r.unknownKes)}</td>
                            <td className="px-3 py-2 text-right tabular-nums">{r.orderCount}</td>
                            <td className="px-3 py-2 text-right font-medium tabular-nums">{ksh(r.totalKes)}</td>
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
              <h2 className="text-lg font-semibold text-gray-900">Room bookings</h2>
              <p className="text-sm text-gray-500 mt-1">
                {report.bookings.bookingCount} paid bookings · {ksh(report.bookings.sumTotalsKes)} total
              </p>
            </div>
            <div className="p-5">
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600 text-left">
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
                          <td className="px-3 py-2 font-medium text-gray-900">{r.roomName}</td>
                          <td className="px-3 py-2 text-right tabular-nums">{r.bookingCount}</td>
                          <td className="px-3 py-2 text-right font-medium tabular-nums">{ksh(r.totalKes)}</td>
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
