import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { getServiceSupabase } from "@/lib/supabase/service";

export const runtime = "nodejs";

type Snapshot = {
  unread: number;
  notifications: unknown[];
  serverTime: string;
};

async function fetchSnapshot(): Promise<Snapshot> {
  const sb = getServiceSupabase();
  const [unreadRes, listRes] = await Promise.all([
    sb.from("admin_notifications").select("id", { count: "exact", head: true }).eq("read", false),
    sb
      .from("admin_notifications")
      .select("id, kind, title, body, read, created_at")
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  if (unreadRes.error) throw new Error(unreadRes.error.message);
  if (listRes.error) throw new Error(listRes.error.message);

  return {
    unread: unreadRes.count ?? 0,
    notifications: listRes.data ?? [],
    serverTime: new Date().toISOString(),
  };
}

export async function GET(req: Request) {
  const auth = await requireAdminApi();
  if (auth instanceof NextResponse) return auth;

  const encoder = new TextEncoder();
  let lastJson = "";
  let closed = false;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(payload));
      };

      try {
        const snap = await fetchSnapshot();
        lastJson = JSON.stringify(snap);
        send("snapshot", snap);
      } catch (e) {
        send("error", { error: e instanceof Error ? e.message : "Failed to load notifications" });
      }

      const intervalMs = 1500;
      const t = setInterval(async () => {
        if (closed) return;
        try {
          const snap = await fetchSnapshot();
          const json = JSON.stringify(snap);
          if (json !== lastJson) {
            lastJson = json;
            send("snapshot", snap);
          } else {
            controller.enqueue(encoder.encode(`: ping\n\n`));
          }
        } catch (e) {
          send("error", { error: e instanceof Error ? e.message : "Stream error" });
        }
      }, intervalMs);

      req.signal.addEventListener("abort", () => {
        closed = true;
        clearInterval(t);
        try {
          controller.close();
        } catch {
          // ignore
        }
      });

      setTimeout(() => {
        clearInterval(t);
        if (!closed) controller.close();
      }, 10 * 60 * 1000);
    },
    cancel() {
      closed = true;
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

