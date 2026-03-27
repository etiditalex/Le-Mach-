import { notFound } from "next/navigation";
import { getBookingById } from "@/lib/repositories/bookings";
import ReceiptPrintBar from "@/components/ReceiptPrintBar";

export const dynamic = "force-dynamic";

type Props = { params: { id: string }; searchParams: { key?: string } };

export default async function BookingReceiptPage({ params, searchParams }: Props) {
  const booking = await getBookingById(params.id);
  if (!booking || booking.status !== "paid") notFound();
  if (!searchParams.key || searchParams.key !== booking.receiptKey) notFound();

  const shortId = booking.id.slice(0, 8);

  return (
    <main className="receipt-print min-h-screen bg-white text-gray-900 print:p-8">
      <div className="max-w-md mx-auto px-6 py-10 border-b print:border-0">
        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Lemach Hotel</p>
        <h1 className="text-2xl font-bold text-primary mt-1">Booking receipt</h1>
        <p className="text-sm text-gray-500 mt-2 font-mono">Booking {booking.id}</p>
        {booking.paidAt && (
          <p className="text-sm text-gray-600 mt-1">Paid {new Date(booking.paidAt).toLocaleString()}</p>
        )}
      </div>

      <div className="max-w-md mx-auto px-6 py-6 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Guest</span>
          <span className="font-medium">
            {booking.firstName} {booking.lastName}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Room</span>
          <span className="font-medium">{booking.roomName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Check-in</span>
          <span className="font-medium">{new Date(booking.checkIn).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Check-out</span>
          <span className="font-medium">{new Date(booking.checkOut).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Nights</span>
          <span className="font-medium">{booking.nights}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Guests</span>
          <span className="font-medium">{booking.guests}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Payment</span>
          <span className="font-medium capitalize">{booking.paymentProvider || "—"}</span>
        </div>
        {booking.mpesa?.receiptNumber && (
          <div className="flex justify-between">
            <span className="text-gray-600">M-Pesa receipt</span>
            <span className="font-mono">{booking.mpesa.receiptNumber}</span>
          </div>
        )}
      </div>

      <div className="max-w-md mx-auto px-6 py-4">
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span className="text-primary">KSh {booking.totalKes.toLocaleString()}</span>
        </div>
      </div>

      <ReceiptPrintBar documentTitle={`Booking receipt ${shortId} — Lemach Hotel`} />
    </main>
  );
}
