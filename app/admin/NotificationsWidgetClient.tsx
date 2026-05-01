"use client";

import Link from "next/link";
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

export function NotificationsListClient(props: { initialNotifications: NotificationRow[]; limit?: number }) {
  const [rows, setRows] = useState<NotificationRow[]>(props.initialNotifications);
  const [streamErr, setStreamErr] = useState<string | null>(null);

  useEffect(() => {
    const es = new EventSource("/api/admin/notifications/stream");

    const onSnapshot = (ev: MessageEvent<string>) => {
      try {
        const snap = JSON.parse(ev.data) as Snapshot;
        const next = Array.isArray(snap.notifications) ? snap.notifications : [];
        setRows(next);
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

  const limited = useMemo(() => {
    const limit = props.limit ?? rows.length;
    return rows.slice(0, limit);
  }, [props.limit, rows]);

  return (
    <div className="space-y-3">
      {streamErr && (
        <div className="rounded-lg bg-amber-50 border border-amber-100 text-amber-900 px-4 py-3 text-sm">
          {streamErr}
        </div>
      )}
      {limited.length === 0 ? (
        <p className="text-sm text-gray-500">No notifications yet.</p>
      ) : (
        <ul className="space-y-3">
          {limited.map((n) => (
            <li
              key={n.id}
              className={`rounded-xl border p-4 shadow-sm ${
                n.read ? "bg-white border-gray-200" : "bg-amber-50/50 border-amber-100"
              }`}
            >
              <div className="flex justify-between gap-2 items-start">
                <p className="font-semibold text-gray-900">{n.title}</p>
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {new Date(n.created_at).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{n.body}</p>
              <p className="text-xs text-gray-400 mt-2">
                {n.kind}
                {!n.read && " · unread"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function NotificationsWidgetClient(props: {
  initialUnread: number;
  initialNotifications: NotificationRow[];
}) {
  const [unread, setUnread] = useState<number>(props.initialUnread);
  const [serverTime, setServerTime] = useState<string | null>(null);

  useEffect(() => {
    const es = new EventSource("/api/admin/notifications/stream");
    const onSnapshot = (ev: MessageEvent<string>) => {
      try {
        const snap = JSON.parse(ev.data) as Snapshot;
        setUnread(typeof snap.unread === "number" ? snap.unread : 0);
        setServerTime(typeof snap.serverTime === "string" ? snap.serverTime : null);
      } catch {
        // ignore
      }
    };
    es.addEventListener("snapshot", onSnapshot as EventListener);
    return () => {
      try {
        es.close();
      } catch {
        // ignore
      }
    };
  }, []);

  const lastUpdated = useMemo(() => {
    if (!serverTime) return null;
    const d = new Date(serverTime);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleTimeString();
  }, [serverTime]);

  return (
    <div className="rounded-xl bg-white border border-gray-200 p-5 shadow-sm">
      <p className="text-sm text-gray-500">Unread notifications</p>
      <p className="text-3xl font-bold text-primary mt-1">{unread}</p>
      {lastUpdated && <p className="text-xs text-gray-400 mt-1">Live · Updated {lastUpdated}</p>}
      <Link href="/admin/notifications" className="text-sm text-primary mt-2 inline-block hover:underline">
        View all →
      </Link>
    </div>
  );
}

