import Link from "next/link";
import { Printer } from "lucide-react";
import { getServiceSupabase } from "@/lib/supabase/service";

export const dynamic = "force-dynamic";

function formatKsh(n: number) {
  return `KSh ${n.toLocaleString()}`;
}

export default async function AdminOrdersPage() {
  const sb = getServiceSupabase();
  const [foodRes, bookRes] = await Promise.all([
    sb
      .from("food_orders")
      .select("id, status, total_kes, guest_name, room_number, guest_email, created_at, paid_at, receipt_key")
      .order("created_at", { ascending: false })
      .limit(100),
    sb
      .from("bookings")
      .select(
        "id, status, total_kes, room_name, first_name, last_name, email, check_in, check_out, created_at, paid_at, receipt_key"
      )
      .order("created_at", { ascending: false })
      .limit(100),
  ]);

  const food = foodRes.data ?? [];
  const bookings = bookRes.data ?? [];

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Orders & bookings</h1>
        <p className="text-zinc-400 mt-1">Latest room service orders and room reservations.</p>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-zinc-200 mb-3">Food orders</h2>
        <div className="rounded-xl border border-gray-200 bg-white overflow-x-auto shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-600">
              <tr>
                <th className="px-4 py-3 font-medium">Guest</th>
                <th className="px-4 py-3 font-medium">Room</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium w-40">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {food.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    No food orders.
                  </td>
                </tr>
              ) : (
                food.map((row: Record<string, unknown>) => {
                  const id = String(row.id);
                  const status = String(row.status);
                  const key = row.receipt_key != null ? String(row.receipt_key) : "";
                  const canPrint = status === "paid" && key.length > 0;
                  return (
                    <tr key={id} className="hover:bg-gray-50/80">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{String(row.guest_name)}</div>
                        <div className="text-xs text-gray-500">{String(row.guest_email)}</div>
                      </td>
                      <td className="px-4 py-3">{String(row.room_number)}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">{status}</span>
                      </td>
                      <td className="px-4 py-3 tabular-nums font-medium">{formatKsh(Number(row.total_kes))}</td>
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                        {new Date(String(row.created_at)).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        {canPrint ? (
                          <Link
                            href={`/receipt/food/${id}?key=${encodeURIComponent(key)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                          >
                            <Printer className="w-4 h-4 shrink-0" aria-hidden />
                            Print
                          </Link>
                        ) : (
                          <span className="text-xs text-gray-400">After payment</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-zinc-200 mb-3">Bookings</h2>
        <div className="rounded-xl border border-gray-200 bg-white overflow-x-auto shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-600">
              <tr>
                <th className="px-4 py-3 font-medium">Guest</th>
                <th className="px-4 py-3 font-medium">Room</th>
                <th className="px-4 py-3 font-medium">Stay</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium w-40">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    No bookings.
                  </td>
                </tr>
              ) : (
                bookings.map((row: Record<string, unknown>) => {
                  const id = String(row.id);
                  const status = String(row.status);
                  const key = row.receipt_key != null ? String(row.receipt_key) : "";
                  const canPrint = status === "paid" && key.length > 0;
                  return (
                    <tr key={id} className="hover:bg-gray-50/80">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">
                          {String(row.first_name)} {String(row.last_name)}
                        </div>
                        <div className="text-xs text-gray-500">{String(row.email)}</div>
                      </td>
                      <td className="px-4 py-3">{String(row.room_name)}</td>
                      <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">
                        {String(row.check_in)} → {String(row.check_out)}
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">{status}</span>
                      </td>
                      <td className="px-4 py-3 tabular-nums font-medium">{formatKsh(Number(row.total_kes))}</td>
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                        {new Date(String(row.created_at)).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        {canPrint ? (
                          <Link
                            href={`/receipt/booking/${id}?key=${encodeURIComponent(key)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                          >
                            <Printer className="w-4 h-4 shrink-0" aria-hidden />
                            Print
                          </Link>
                        ) : (
                          <span className="text-xs text-gray-400">After payment</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
