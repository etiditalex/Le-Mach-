"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Bug, Download, Printer, Trash2 } from "lucide-react";
import { adminCardTitle, adminDescription, adminLabel, adminMicro, adminName, adminTable, adminTableHead } from "@/components/admin/admin-styles";
import StatusBadge from "@/components/admin/StatusBadge";

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
  const [actionErr, setActionErr] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [serverTime, setServerTime] = useState<string | null>(null);

  const esRef = useRef<EventSource | null>(null);
  const deletedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const es = new EventSource("/api/admin/orders/stream");
    esRef.current = es;

    const onSnapshot = (ev: MessageEvent<string>) => {
      try {
        const snap = JSON.parse(ev.data) as Snapshot;
        const gone = deletedRef.current;
        setFood((Array.isArray(snap.food) ? snap.food : []).filter((row) => !gone.has(`food:${row.id}`)));
        setBookings(
          (Array.isArray(snap.bookings) ? snap.bookings : []).filter((row) => !gone.has(`booking:${row.id}`))
        );
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

  const removeRow = async (kind: "food" | "booking", id: string, label: string) => {
    const noun = kind === "food" ? "food order" : "booking";
    if (!confirm(`Delete this ${noun} for ${label}? It will be removed from the dashboard.`)) return;
    setActionErr(null);
    setDeletingId(`${kind}:${id}`);
    try {
      const path = kind === "food" ? "food-orders" : "bookings";
      const res = await fetch(`/api/admin/${path}/${encodeURIComponent(id)}`, { method: "DELETE" });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Delete failed");
      deletedRef.current.add(`${kind}:${id}`);
      if (kind === "food") setFood((rows) => rows.filter((row) => String(row.id) !== id));
      else setBookings((rows) => rows.filter((row) => String(row.id) !== id));
    } catch (e) {
      setActionErr(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const lastUpdatedLabel = useMemo(() => {
    if (!serverTime) return null;
    const d = new Date(serverTime);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleTimeString();
  }, [serverTime]);

  return (
    <div className="space-y-10">
      {streamErr && (
        <div className={`rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900 ${adminDescription}`}>
          {streamErr}
        </div>
      )}
      {actionErr && (
        <div className={`rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-800 ${adminDescription}`}>{actionErr}</div>
      )}
      {lastUpdatedLabel && <p className={`text-gray-500 ${adminLabel}`}>Live · Updated {lastUpdatedLabel}</p>}

      <section>
        <h2 className={`mb-3 text-gray-900 ${adminCardTitle}`}>Food orders</h2>
        <div className="overflow-x-auto rounded-[20px] border border-black/[0.04] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04),0_10px_28px_rgba(16,24,40,0.045)]">
          <table className={`min-w-full ${adminTable}`}>
            <thead className={`bg-gray-50 text-left text-gray-600 ${adminTableHead}`}>
              <tr>
                <th className="px-4 py-3 font-medium">Guest</th>
                <th className="px-4 py-3 font-medium">Room</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium w-64">Receipt & tools</th>
                <th className="px-4 py-3 font-medium w-24">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {food.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
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
                        <div className={`text-gray-900 ${adminName}`}>{row.guest_name}</div>
                        <div className={`text-gray-500 ${adminLabel}`}>{row.guest_email}</div>
                      </td>
                      <td className="px-4 py-3">{row.room_number || "—"}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={status} />
                      </td>
                      <td className={`px-4 py-3 tabular-nums ${adminName}`}>{formatKsh(Number(row.total_kes))}</td>
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
                                className={`inline-flex items-center gap-1.5 text-primary hover:underline ${adminMicro}`}
                              >
                                <Printer className="w-4 h-4 shrink-0" aria-hidden />
                                Print
                              </Link>
                              <Link
                                href={qrHref}
                                className={`inline-flex items-center gap-1.5 text-primary hover:underline ${adminMicro}`}
                              >
                                <Download className="w-4 h-4 shrink-0" aria-hidden />
                                QR
                              </Link>
                            </>
                          ) : (
                            <span className={`text-gray-400 ${adminLabel}`}>After payment</span>
                          )}
                          <Link
                            href={traceHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-1.5 text-gray-600 hover:text-gray-900 hover:underline ${adminMicro}`}
                          >
                            <Bug className="w-4 h-4 shrink-0" aria-hidden />
                            Trace
                          </Link>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          disabled={deletingId === `food:${id}`}
                          onClick={() => void removeRow("food", id, String(row.guest_name))}
                          className={`inline-flex items-center gap-1.5 text-red-600 hover:underline disabled:opacity-50 ${adminMicro}`}
                        >
                          <Trash2 className="w-4 h-4 shrink-0" aria-hidden />
                          Delete
                        </button>
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
        <h2 className={`mb-3 text-gray-900 ${adminCardTitle}`}>Bookings</h2>
        <div className="overflow-x-auto rounded-[20px] border border-black/[0.04] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04),0_10px_28px_rgba(16,24,40,0.045)]">
          <table className={`min-w-full ${adminTable}`}>
            <thead className={`bg-gray-50 text-left text-gray-600 ${adminTableHead}`}>
              <tr>
                <th className="px-4 py-3 font-medium">Guest</th>
                <th className="px-4 py-3 font-medium">Room</th>
                <th className="px-4 py-3 font-medium">Stay</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium w-64">Receipt & tools</th>
                <th className="px-4 py-3 font-medium w-24">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
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
                        <div className={`text-gray-900 ${adminName}`}>
                          {row.first_name} {row.last_name}
                        </div>
                        <div className={`text-gray-500 ${adminLabel}`}>{row.email}</div>
                      </td>
                      <td className="px-4 py-3">{row.room_name}</td>
                      <td className={`whitespace-nowrap px-4 py-3 text-gray-600 ${adminLabel}`}>
                        {row.check_in} → {row.check_out}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={status} />
                      </td>
                      <td className={`px-4 py-3 tabular-nums ${adminName}`}>{formatKsh(Number(row.total_kes))}</td>
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
                                className={`inline-flex items-center gap-1.5 text-primary hover:underline ${adminMicro}`}
                              >
                                <Printer className="w-4 h-4 shrink-0" aria-hidden />
                                Print
                              </Link>
                              <Link
                                href={qrHref}
                                className={`inline-flex items-center gap-1.5 text-primary hover:underline ${adminMicro}`}
                              >
                                <Download className="w-4 h-4 shrink-0" aria-hidden />
                                QR
                              </Link>
                            </>
                          ) : (
                            <span className={`text-gray-400 ${adminLabel}`}>After payment</span>
                          )}
                          <Link
                            href={traceHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-1.5 text-gray-600 hover:text-gray-900 hover:underline ${adminMicro}`}
                          >
                            <Bug className="w-4 h-4 shrink-0" aria-hidden />
                            Trace
                          </Link>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          disabled={deletingId === `booking:${id}`}
                          onClick={() => void removeRow("booking", id, `${row.first_name} ${row.last_name}`.trim())}
                          className={`inline-flex items-center gap-1.5 text-red-600 hover:underline disabled:opacity-50 ${adminMicro}`}
                        >
                          <Trash2 className="w-4 h-4 shrink-0" aria-hidden />
                          Delete
                        </button>
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

