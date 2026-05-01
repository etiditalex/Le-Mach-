import { notFound } from "next/navigation";
import { getFoodOrderById } from "@/lib/repositories/food-orders";
import ReceiptPrintBar from "@/components/ReceiptPrintBar";

export const dynamic = "force-dynamic";

type Props = { params: { id: string }; searchParams: { key?: string } };

export default async function FoodReceiptPage({ params, searchParams }: Props) {
  const order = await getFoodOrderById(params.id);
  if (!order || order.status !== "paid") notFound();
  if (!searchParams.key || searchParams.key !== order.receiptKey) notFound();

  const shortId = order.id.slice(0, 8);

  return (
    <main className="receipt-print min-h-screen bg-white text-gray-900 print:p-8">
      <div className="max-w-md mx-auto px-6 py-10 border-b print:border-0">
        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Lemach Hotel</p>
        <h1 className="text-2xl font-bold text-primary mt-1">Food receipt</h1>
        <p className="text-sm text-gray-500 mt-2 font-mono">Order {order.id}</p>
        {order.paidAt && (
          <p className="text-sm text-gray-600 mt-1">Paid {new Date(order.paidAt).toLocaleString()}</p>
        )}
      </div>

      <div className="max-w-md mx-auto px-6 py-6 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Guest</span>
          <span className="font-medium">{order.guestName}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Room</span>
          <span className="font-medium">{order.roomNumber || "—"}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Payment</span>
          <span className="font-medium capitalize">{order.paymentProvider || "—"}</span>
        </div>
        {order.mpesa?.receiptNumber && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">M-Pesa receipt</span>
            <span className="font-mono">{order.mpesa.receiptNumber}</span>
          </div>
        )}
      </div>

      <div className="max-w-md mx-auto px-6 py-2">
        <div className="border rounded-lg divide-y">
          {order.lines.map((l) => (
            <div key={`${l.id}-${l.name}`} className="flex justify-between px-3 py-2 text-sm">
              <span>
                {l.name} × {l.quantity}
              </span>
              <span className="tabular-nums">KSh {(l.price * l.quantity).toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between font-bold text-lg mt-4 px-1">
          <span>Total</span>
          <span className="text-primary">KSh {order.totalKes.toLocaleString()}</span>
        </div>
      </div>

      <ReceiptPrintBar documentTitle={`Food receipt ${shortId} — Lemach Hotel`} />
    </main>
  );
}
