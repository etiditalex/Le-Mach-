"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Bug, Download, Printer } from "lucide-react";

type FoodRow = {
  id: string;
  status: string;
  total_kes: number;
  guest_name: string;
  room_number: string | null;
  guest_email: string;
  created_at: string;
  paid_at: string | null;
  receipt_key: string | null;
};

type BookingRow = {
  id: string;
  status: string;
  total_kes: number;
  room_name: string;
  first_name: string;
  last_name: string;
  email: string;
  check_in: string;
  check_out: string;
  created_at: string;
  paid_at: string | null;
  receipt_key: string | null;
};

type Snapshot = {
  food: FoodRow[];
  bookings: BookingRow[];
  serverTime: string;
};

function formatKsh(n: number) {
  return `KSh ${n.toLocaleString()}`;
}

export default function OrdersRealtimeClient(props: { initialFood: FoodRow[]; initialBookings: BookingRow[] }) {
  const [food, setFood] = useState<FoodRow[]>(props.initialFood);
  const [bookings, setBookings] = useState<BookingRow[]>(props.initialBookings);
  const [streamErr, setStreamErr] = useState<string | null>(null);
  const [serverTime, setServerTime] = useState<string | null>(null);

  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const es = new EventSource("/api/admin/orders/stream");
    esRef.current = es;

    const onSnapshot = (ev: MessageEvent<string>) => {
      try {
        const snap = JSON.parse(ev.data) as Snapshot;
        setFood(Array.isArray(snap.food) ? snap.food : []);
        setBookings(Array.isArray(snap.bookings) ? snap.bookings : []);
        setServerTime(typeof snap.serverTime === "string" ? snap.serverTime : null);
        setStreamErr(null);
      } catch {
        // ignore invalid event
      }
    };

    const onError = () => {
      setStreamErr((prev) => prev || "Realtime connection lost. Retrying…");
    };

    es.addEventListener("snapshot", onSnapshot as EventListener);
    es.addEventListener("error", ((ev: MessageEvent<string>) => {
      try {
        const data = JSON.parse(ev.data) as { error?: string };
        if (data?.error) setStreamErr(data.error);
      } catch {
        // ignore
      }
    }) as EventListener);
    es.onerror = onError;

    return () => {
      try {
        es.close();
      } catch {
        // ignore
      }
      esRef.current = null;
    };
  }, []);

  const lastUpdatedLabel = useMemo(() => {
    if (!serverTime) return null;
    const d = new Date(serverTime);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleTimeString();
  }, [serverTime]);

  return (
    <div className="space-y-10">
      {streamErr && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {streamErr}
        </div>
      )}
      {lastUpdatedLabel && <p className="text-xs text-gray-500">Live · Updated {lastUpdatedLabel}</p>}

      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Food orders</h2>
        <div className="rounded-xl border border-gray-200 bg-white overflow-x-auto shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-600">
              <tr>
                <th className="px-4 py-3 font-medium">Guest</th>
                <th className="px-4 py-3 font-medium">Room</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium w-64">Receipt & tools</th>
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
                food.map((row) => {
                  const id = String(row.id);
                  const status = String(row.status);
                  const key = row.receipt_key != null ? String(row.receipt_key) : "";
                  const canPrint = status === "paid" && key.length > 0;
                  const traceHref = `/api/admin/daraja/trace?target=food&id=${encodeURIComponent(id)}`;
                  const qrHref = `/api/admin/receipts/qr?target=food&id=${encodeURIComponent(id)}`;
                  return (
                    <tr key={id} className="hover:bg-gray-50/80">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{row.guest_name}</div>
                        <div className="text-xs text-gray-500">{row.guest_email}</div>
                      </td>
                      <td className="px-4 py-3">{row.room_number || "—"}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">{status}</span>
                      </td>
                      <td className="px-4 py-3 tabular-nums font-medium">{formatKsh(Number(row.total_kes))}</td>
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                        {new Date(String(row.created_at)).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap items-center gap-3">
                          {canPrint ? (
                            <>
                              <Link
                                href={`/receipt/food/${id}?key=${encodeURIComponent(key)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                              >
                                <Printer className="w-4 h-4 shrink-0" aria-hidden />
                                Print
                              </Link>
                              <Link
                                href={qrHref}
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                              >
                                <Download className="w-4 h-4 shrink-0" aria-hidden />
                                QR
                              </Link>
                            </>
                          ) : (
                            <span className="text-xs text-gray-400">After payment</span>
                          )}
                          <Link
                            href={traceHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 hover:underline"
                          >
                            <Bug className="w-4 h-4 shrink-0" aria-hidden />
                            Trace
                          </Link>
                        </div>
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
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Bookings</h2>
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
                <th className="px-4 py-3 font-medium w-64">Receipt & tools</th>
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
                bookings.map((row) => {
                  const id = String(row.id);
                  const status = String(row.status);
                  const key = row.receipt_key != null ? String(row.receipt_key) : "";
                  const canPrint = status === "paid" && key.length > 0;
                  const traceHref = `/api/admin/daraja/trace?target=booking&id=${encodeURIComponent(id)}`;
                  const qrHref = `/api/admin/receipts/qr?target=booking&id=${encodeURIComponent(id)}`;
                  return (
                    <tr key={id} className="hover:bg-gray-50/80">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">
                          {row.first_name} {row.last_name}
                        </div>
                        <div className="text-xs text-gray-500">{row.email}</div>
                      </td>
                      <td className="px-4 py-3">{row.room_name}</td>
                      <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">
                        {row.check_in} → {row.check_out}
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">{status}</span>
                      </td>
                      <td className="px-4 py-3 tabular-nums font-medium">{formatKsh(Number(row.total_kes))}</td>
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                        {new Date(String(row.created_at)).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap items-center gap-3">
                          {canPrint ? (
                            <>
                              <Link
                                href={`/receipt/booking/${id}?key=${encodeURIComponent(key)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                              >
                                <Printer className="w-4 h-4 shrink-0" aria-hidden />
                                Print
                              </Link>
                              <Link
                                href={qrHref}
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                              >
                                <Download className="w-4 h-4 shrink-0" aria-hidden />
                                QR
                              </Link>
                            </>
                          ) : (
                            <span className="text-xs text-gray-400">After payment</span>
                          )}
                          <Link
                            href={traceHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 hover:underline"
                          >
                            <Bug className="w-4 h-4 shrink-0" aria-hidden />
                            Trace
                          </Link>
                        </div>
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

