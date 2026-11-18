import { adminMicro } from "@/components/admin/admin-styles";
import { paymentStatusLabel } from "@/lib/admin-display";

const TONE: Record<string, string> = {
  paid: "bg-emerald-50 text-emerald-800",
  awaiting_payment: "bg-amber-50 text-amber-800",
  processing_mpesa: "bg-sky-50 text-sky-800",
  failed: "bg-red-50 text-red-700",
  cancelled: "bg-gray-100 text-gray-600",
};

export default function StatusBadge({ status }: { status: string }) {
  const tone = TONE[status] ?? "bg-gray-100 text-gray-700";
  const label = paymentStatusLabel(status);
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 capitalize ${adminMicro} ${tone}`}>
      {label}
    </span>
  );
}
