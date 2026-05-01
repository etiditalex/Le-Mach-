"use client";

import { useEffect, useMemo, useState } from "react";

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
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {streamErr}
        </div>
      )}
      <p className="text-xs text-gray-500">
        Live · Unread: <span className="font-semibold text-gray-900">{unread}</span>
        {lastUpdatedLabel ? ` · Updated ${lastUpdatedLabel}` : ""}
      </p>

      <ul className="space-y-3">
        {rows.length === 0 ? (
          <li className="rounded-xl bg-white border border-gray-200 p-8 text-center text-gray-500 text-sm">
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
                <p className="font-semibold text-gray-900">{n.title}</p>
                <span className="text-xs text-gray-500 whitespace-nowrap">{new Date(n.created_at).toLocaleString()}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{n.body}</p>
              <p className="text-xs text-gray-400 mt-2">
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

