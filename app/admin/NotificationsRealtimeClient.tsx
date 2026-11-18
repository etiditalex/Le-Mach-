"use client";

import { useEffect, useMemo, useState } from "react";
import { adminDescription, adminLabel, adminName } from "@/components/admin/admin-styles";

type NotificationRow = {
  id: string;
  kind: string;
  title: string;
  body: string;
  read: boolean;
  created_at: string;
};

type Snapshot = {
  unread: number;
  notifications: NotificationRow[];
  serverTime: string;
};

export default function NotificationsRealtimeClient(props: { initial: NotificationRow[]; children?: never }) {
  const [rows, setRows] = useState<NotificationRow[]>(props.initial);
  const [unread, setUnread] = useState<number>(() => props.initial.filter((r) => !r.read).length);
  const [streamErr, setStreamErr] = useState<string | null>(null);
  const [serverTime, setServerTime] = useState<string | null>(null);

  useEffect(() => {
    const es = new EventSource("/api/admin/notifications/stream");

    const onSnapshot = (ev: MessageEvent<string>) => {
      try {
        const snap = JSON.parse(ev.data) as Snapshot;
        setRows(Array.isArray(snap.notifications) ? snap.notifications : []);
        setUnread(typeof snap.unread === "number" ? snap.unread : 0);
        setServerTime(typeof snap.serverTime === "string" ? snap.serverTime : null);
        setStreamErr(null);
      } catch {
        // ignore
      }
    };

    es.addEventListener("snapshot", onSnapshot as EventListener);
    es.addEventListener(
      "error",
      ((ev: MessageEvent<string>) => {
        try {
          const data = JSON.parse(ev.data) as { error?: string };
          if (data?.error) setStreamErr(data.error);
        } catch {
          // ignore
        }
      }) as EventListener
    );
    es.onerror = () => setStreamErr((p) => p || "Realtime connection lost. Retrying…");

    return () => {
      try {
        es.close();
      } catch {
        // ignore
      }
    };
  }, []);

  const lastUpdatedLabel = useMemo(() => {
    if (!serverTime) return null;
    const d = new Date(serverTime);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleTimeString();
  }, [serverTime]);

  return (
    <div className="space-y-3">
      {streamErr && (
        <div className={`rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900 ${adminDescription}`}>
          {streamErr}
        </div>
      )}
      <p className={`text-gray-500 ${adminLabel}`}>
        Live · Unread: <span className={`text-gray-900 ${adminName}`}>{unread}</span>
        {lastUpdatedLabel ? ` · Updated ${lastUpdatedLabel}` : ""}
      </p>

      <ul className="space-y-3">
        {rows.length === 0 ? (
          <li className={`rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500 ${adminDescription}`}>
            No notifications yet.
          </li>
        ) : (
          rows.map((n) => (
            <li
              key={n.id}
              className={`rounded-xl border p-4 shadow-sm ${
                n.read ? "bg-white border-gray-200" : "bg-amber-50/50 border-amber-100"
              }`}
            >
              <div className="flex justify-between gap-2 items-start">
                <p className={`text-gray-900 ${adminName}`}>{n.title}</p>
                <span className={`whitespace-nowrap text-gray-500 ${adminLabel}`}>{new Date(n.created_at).toLocaleString()}</span>
              </div>
              <p className={`mt-1 text-gray-600 ${adminDescription}`}>{n.body}</p>
              <p className={`mt-2 text-gray-400 ${adminLabel}`}>
                {n.kind}
                {!n.read && " · unread"}
              </p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

