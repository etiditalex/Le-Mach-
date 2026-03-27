"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

function SuccessInner() {
  const sp = useSearchParams();
  const reference = sp.get("reference") || sp.get("trxref");
  const [status, setStatus] = useState<"loading" | "ok" | "err">("loading");
  const [detail, setDetail] = useState<{
    target?: string;
    entityId?: string;
    receiptKey?: string;
    error?: string;
  }>({});

  useEffect(() => {
    if (!reference) {
      setStatus("err");
      setDetail({ error: "Missing payment reference." });
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch(
          `/api/payments/paystack/complete?reference=${encodeURIComponent(reference)}`,
          { cache: "no-store" }
        );
        const data = (await res.json()) as {
          ok?: boolean;
          error?: string;
          target?: string;
          entityId?: string;
          receiptKey?: string;
        };
        if (cancelled) return;
        if (!res.ok || !data.ok) {
          setStatus("err");
          setDetail({ error: data.error || "Could not confirm payment." });
          return;
        }
        setStatus("ok");
        setDetail({
          target: data.target,
          entityId: data.entityId,
          receiptKey: data.receiptKey,
        });
      } catch {
        if (!cancelled) {
          setStatus("err");
          setDetail({ error: "Network error." });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [reference]);

  return (
    <div className="pt-28 pb-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 max-w-lg">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          {status === "loading" && (
            <>
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Confirming your Paystack payment…</p>
            </>
          )}
          {status === "ok" && (
            <>
              <h1 className="text-2xl font-bold text-primary mb-2">Payment received</h1>
              <p className="text-gray-600 mb-6">Thank you. Your booking or order is confirmed.</p>
              {detail.target === "food" && detail.entityId && detail.receiptKey && (
                <p className="mb-4">
                  <Link
                    href={`/receipt/food/${detail.entityId}?key=${encodeURIComponent(detail.receiptKey)}`}
                    className="inline-flex justify-center rounded-lg bg-primary text-white px-5 py-2.5 font-semibold hover:opacity-95"
                  >
                    Open receipt &amp; print
                  </Link>
                </p>
              )}
              {detail.target === "booking" && detail.entityId && detail.receiptKey && (
                <p className="mb-4">
                  <Link
                    href={`/receipt/booking/${detail.entityId}?key=${encodeURIComponent(detail.receiptKey)}`}
                    className="inline-flex justify-center rounded-lg bg-primary text-white px-5 py-2.5 font-semibold hover:opacity-95"
                  >
                    Open receipt &amp; print
                  </Link>
                </p>
              )}
              <Link href="/" className="inline-block mt-2 text-gray-700 hover:text-primary">
                ← Back to home
              </Link>
            </>
          )}
          {status === "err" && (
            <>
              <h1 className="text-2xl font-bold text-red-700 mb-2">Could not confirm</h1>
              <p className="text-gray-600">{detail.error}</p>
              <Link href="/contact" className="inline-block mt-6 text-primary font-medium">
                Contact support
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <main>
      <Header />
      <Suspense
        fallback={
          <div className="pt-28 pb-16 min-h-screen flex justify-center bg-gray-50">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mt-20" />
          </div>
        }
      >
        <SuccessInner />
      </Suspense>
      <Footer />
    </main>
  );
}
