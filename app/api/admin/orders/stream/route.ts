import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { getServiceSupabase } from "@/lib/supabase/service";

export const runtime = "nodejs";

type Snapshot = {
  food: unknown[];
  bookings: unknown[];
  serverTime: string;
};

async function fetchSnapshot(): Promise<Snapshot> {
  const sb = getServiceSupabase();
  const [foodRes, bookRes] = await Promise.all([
    sb
      .from("food_orders")
      .select("id, status, total_kes, guest_name, room_number, guest_email, created_at, paid_at, receipt_key")
      .order("created_at", { ascending: false })
      .limit(100),
    sb
      .from("bookings")
      .select("id, status, total_kes, room_name, first_name, last_name, email, check_in, check_out, created_at, paid_at, receipt_key")
      .order("created_at", { ascending: false })
      .limit(100),
  ]);

  if (foodRes.error) throw new Error(foodRes.error.message);
  if (bookRes.error) throw new Error(bookRes.error.message);

  return {
    food: foodRes.data ?? [],
    bookings: bookRes.data ?? [],
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
      const safeEnqueue = (chunk: Uint8Array) => {
        if (closed) return;
        try {
          controller.enqueue(chunk);
        } catch {
          closed = true;
        }
      };

      const send = (event: string, data: unknown) => {
        if (closed) return;
        const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
        safeEnqueue(encoder.encode(payload));
      };

      // Initial payload.
      try {
        const snap = await fetchSnapshot();
        lastJson = JSON.stringify(snap);
        send("snapshot", snap);
      } catch (e) {
        send("error", { error: e instanceof Error ? e.message : "Failed to load orders" });
      }

      // Poll loop (SSE keeps connection open; dashboard updates in near real-time).
      const intervalMs = 1500;
      const t = setInterval(() => {
        void (async () => {
          if (closed) return;
          try {
            const snap = await fetchSnapshot();
            if (closed) return;
            const json = JSON.stringify(snap);
            if (json !== lastJson) {
              lastJson = json;
              send("snapshot", snap);
            } else {
              // keep-alive so proxies don't close the stream
              safeEnqueue(encoder.encode(`: ping\n\n`));
            }
          } catch (e) {
            if (closed) return;
            send("error", { error: e instanceof Error ? e.message : "Stream error" });
          }
        })();
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

      // Safety close after 10 minutes (client will reconnect automatically).
      setTimeout(() => {
        closed = true;
        clearInterval(t);
        try {
          controller.close();
        } catch {
          // ignore
        }
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

