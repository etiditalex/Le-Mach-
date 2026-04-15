"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CreditCard, Smartphone } from "lucide-react";

type Target = "food" | "booking";

type Props = {
  target: Target;
  entityId: string;
  onPaid: () => void;
};

export default function PaymentPanel({ target, entityId, onPaid }: Props) {
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState<"mpesa" | "paystack" | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const lastMpesaQueryAtRef = useRef(0);
  const pollUrl =
    target === "food" ? `/api/orders/food/${entityId}` : `/api/bookings/${entityId}`;

  const poll = useCallback(async () => {
    const res = await fetch(pollUrl, { cache: "no-store" });
    if (!res.ok) return;
    const data = (await res.json()) as { status?: string; paymentProvider?: string };
    if (data.status === "paid") onPaid();
    if (data.status === "processing_mpesa" && data.paymentProvider === "mpesa") {
      const now = Date.now();
      // Rate limit STK query requests while waiting for callback.
      if (now - lastMpesaQueryAtRef.current < 15_000) return;
      lastMpesaQueryAtRef.current = now;
      await fetch("/api/payments/mpesa/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target, id: entityId }),
      });
    }
  }, [entityId, onPaid, pollUrl, target]);

  useEffect(() => {
    const t = setInterval(() => {
      void poll();
    }, 3500);
    return () => clearInterval(t);
  }, [poll]);

  const payMpesa = async () => {
    setErr(null);
    setMsg(null);
    setBusy("mpesa");
    try {
      const res = await fetch("/api/payments/mpesa/stk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target, id: entityId, phone }),
      });
      const data = (await (async () => {
        const txt = await res.text();
        if (!txt) return {} as { error?: string; message?: string };
        try {
          return JSON.parse(txt) as { error?: string; message?: string };
        } catch {
          return { error: txt.slice(0, 200) };
        }
      })()) as { error?: string; message?: string };
      if (!res.ok) throw new Error(data.error || "M-Pesa request failed");
      setMsg(data.message || "Check your phone and enter your M-Pesa PIN.");
      void poll();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "M-Pesa failed");
    } finally {
      setBusy(null);
    }
  };

  const payPaystack = async () => {
    setErr(null);
    setMsg(null);
    setBusy("paystack");
    try {
      const res = await fetch("/api/payments/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target, id: entityId }),
      });
      const data = (await res.json()) as { authorizationUrl?: string; error?: string };
      if (!res.ok || !data.authorizationUrl) {
        throw new Error(data.error || "Could not start card payment");
      }
      window.location.href = data.authorizationUrl;
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Paystack failed");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50/80 p-5 space-y-4">
      <p className="text-sm font-semibold text-gray-800">Pay with M-Pesa or card (Paystack)</p>

      <div>
        <label htmlFor="mpesa-phone" className="block text-xs font-medium text-gray-600 mb-1">
          M-Pesa phone number
        </label>
        <input
          id="mpesa-phone"
          type="tel"
          autoComplete="tel"
          placeholder="07XX XXX XXX"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => void payMpesa()}
          disabled={!!busy || !phone.trim()}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#33a852] text-white py-3 font-semibold hover:bg-[#2d9248] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Smartphone className="w-5 h-5" />
          {busy === "mpesa" ? "Sending…" : "Pay with M-Pesa"}
        </button>
        <button
          type="button"
          onClick={() => void payPaystack()}
          disabled={!!busy}
          className="flex items-center justify-center gap-2 rounded-lg bg-primary text-white py-3 font-semibold hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CreditCard className="w-5 h-5" />
          {busy === "paystack" ? "Redirecting…" : "Pay with card"}
        </button>
      </div>

      {msg && <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">{msg}</p>}
      {err && <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{err}</p>}

      <p className="text-xs text-gray-500 leading-relaxed">
        M-Pesa uses Safaricom Daraja (STK Push). Card payments go through Paystack in Kenyan Shillings (KES). You can
        configure both in your environment variables.
      </p>
    </div>
  );
}
