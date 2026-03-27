"use client";

import { useEffect } from "react";
import { Printer } from "lucide-react";

type Props = {
  /** Shown in the browser tab and as the suggested print job title where supported */
  documentTitle?: string;
};

export default function ReceiptPrintBar({ documentTitle = "Receipt — Lemach Hotel" }: Props) {
  useEffect(() => {
    const prev = document.title;
    document.title = documentTitle;
    return () => {
      document.title = prev;
    };
  }, [documentTitle]);

  return (
    <div className="max-w-md mx-auto px-6 py-10 flex flex-col sm:flex-row gap-3 print:hidden">
      <button
        type="button"
        onClick={() => window.print()}
        className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-white py-3 px-4 font-semibold hover:opacity-95 shadow-sm"
      >
        <Printer className="w-5 h-5" aria-hidden />
        Print receipt
      </button>
    </div>
  );
}
