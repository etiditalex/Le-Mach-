"use client";

import { useEffect, useMemo, useState } from "react";
import { Bell } from "lucide-react";
import { adminDescription, adminLabel, adminName } from "@/components/admin/admin-styles";
import { formatCount, relativeTime } from "@/lib/admin-display";
import MetricCard from "@/components/admin/MetricCard";

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

const AVATAR_TONES = [
  "bg-[#FDE8EC] text-primary",
  "bg-[#FFF4CC] text-primary-dark",
  "bg-amber-50 text-amber-800",
  "bg-red-50 text-primary-dark",
];

function avatarTone(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) hash = (hash + id.charCodeAt(i)) % AVATAR_TONES.length;
  return AVATAR_TONES[hash] ?? AVATAR_TONES[0];
}

export function NotificationsListClient(props: {
  initialNotifications: NotificationRow[];
  limit?: number;
  variant?: "cards" | "activity";
}) {
  const [rows, setRows] = useState<NotificationRow[]>(props.initialNotifications);
  const [streamErr, setStreamErr] = useState<string | null>(null);
  const variant = props.variant ?? "cards";

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

  if (variant === "activity") {
    return (
      <div>
        {streamErr && (
          <div className={`mb-3 rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-amber-900 ${adminDescription}`}>{streamErr}</div>
        )}
        {limited.length === 0 ? (
          <p className={`py-8 text-center text-gray-500 ${adminDescription}`}>No notifications yet.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {limited.map((n) => {
              const initial = (n.title.trim().charAt(0) || "•").toUpperCase();
              return (
                <li key={n.id} className="flex items-start gap-3 py-3">
                  <span
                    className={`relative mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${adminName} ${avatarTone(n.id)}`}
                  >
                    {initial}
                    {!n.read && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-primary" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={`truncate text-gray-900 ${adminName}`}>{n.title}</p>
                    <p className={`truncate text-gray-500 ${adminLabel}`}>{n.body}</p>
                  </div>
                  <time
                    dateTime={n.created_at}
                    title={new Date(n.created_at).toLocaleString()}
                    className={`shrink-0 whitespace-nowrap pt-0.5 text-gray-400 ${adminLabel}`}
                  >
                    {relativeTime(n.created_at)}
                    {!n.read && <span className="sr-only">, unread</span>}
                  </time>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {streamErr && (
        <div className={`rounded-lg border border-amber-100 bg-amber-50 px-4 py-3 text-amber-900 ${adminDescription}`}>{streamErr}</div>
      )}
      {limited.length === 0 ? (
        <p className={`text-gray-500 ${adminDescription}`}>No notifications yet.</p>
      ) : (
        <ul className="space-y-3">
          {limited.map((n) => (
            <li
              key={n.id}
              className={`rounded-[20px] border p-4 shadow-sm ${
                n.read ? "border-black/[0.04] bg-white" : "border-amber-100 bg-amber-50/50"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className={`text-gray-900 ${adminName}`}>{n.title}</p>
                <span className={`whitespace-nowrap text-gray-500 ${adminLabel}`}>{new Date(n.created_at).toLocaleString()}</span>
              </div>
              <p className={`mt-1 text-gray-600 ${adminDescription}`}>{n.body}</p>
              <p className={`mt-2 text-gray-400 ${adminLabel}`}>
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

export default function NotificationsWidgetClient(props: { initialUnread: number }) {
  const [unread, setUnread] = useState<number>(props.initialUnread);

  useEffect(() => {
    const es = new EventSource("/api/admin/notifications/stream");
    const onSnapshot = (ev: MessageEvent<string>) => {
      try {
        const snap = JSON.parse(ev.data) as Snapshot;
        setUnread(typeof snap.unread === "number" ? snap.unread : 0);
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

  return (
    <MetricCard
      href="/admin/notifications"
      label="Unread notifications"
      value={formatCount(unread)}
      live
      icon={<Bell className="h-[18px] w-[18px]" aria-hidden />}
      iconClassName="bg-amber-50 text-amber-700"
    />
  );
}
