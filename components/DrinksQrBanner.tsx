"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getSiteUrl } from "@/lib/site";

const DISMISS_KEY = "lemach_drinks_qr_banner_dismissed_until";
const DISMISS_MS = 12 * 60 * 60 * 1000; // 12 hours

export default function DrinksQrBanner() {
  const [hidden, setHidden] = useState(false);

  const drinksUrl = useMemo(() => `${getSiteUrl()}/bar-restaurant`, []);
  const qrSrc = useMemo(() => {
    const q = encodeURIComponent(drinksUrl);
    return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${q}`;
  }, [drinksUrl]);

  useEffect(() => {
    try {
      const until = Number(localStorage.getItem(DISMISS_KEY) ?? "0");
      if (until > Date.now()) setHidden(true);
    } catch {
      /* ignore storage issues */
    }
  }, []);

  if (hidden) return null;

  return (
    <aside
      className="fixed bottom-4 right-4 z-[140] w-[min(22rem,calc(100vw-1.5rem))] rounded-2xl border border-gray-200 bg-white/95 p-3 shadow-2xl backdrop-blur"
      aria-label="Drinks menu QR code"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#fe0000]">Quick scan</p>
          <h3 className="mt-0.5 text-sm font-bold text-gray-900">Drinks Menu on Your Phone</h3>
          <p className="mt-1 text-xs text-gray-600">Scan this QR code to open the drinks menu.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setHidden(true);
            try {
              localStorage.setItem(DISMISS_KEY, String(Date.now() + DISMISS_MS));
            } catch {
              /* ignore */
            }
          }}
          className="rounded-md px-2 py-1 text-xs font-semibold text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          aria-label="Close drinks QR banner"
        >
          Close
        </button>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <img
          src={qrSrc}
          alt="QR code to open Lemach drinks menu"
          width={96}
          height={96}
          className="h-24 w-24 rounded-lg border border-gray-200 bg-white p-1"
          loading="lazy"
        />
        <div className="min-w-0">
          <p className="text-xs text-gray-500">Prefer tapping?</p>
          <Link
            href="/bar-restaurant"
            className="mt-1 inline-block rounded-lg bg-[#fe0000] px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
          >
            Open drinks menu
          </Link>
        </div>
      </div>
    </aside>
  );
}
