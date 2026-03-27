import type { BookingRecord, FoodOrder, OrderLine, PaymentProvider, PaymentStatus } from "@/lib/hotel-types";

export type FoodOrderRow = {
  id: string;
  status: string;
  lines: OrderLine[] | null;
  total_kes: number;
  room_number: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  receipt_key: string;
  payment_provider: string | null;
  mpesa: FoodOrder["mpesa"] | null;
  paystack: FoodOrder["paystack"] | null;
  last_error: string | null;
  created_at: string;
  paid_at: string | null;
};

export function rowToFoodOrder(r: FoodOrderRow): FoodOrder {
  return {
    id: r.id,
    type: "food",
    status: r.status as PaymentStatus,
    lines: (r.lines ?? []) as OrderLine[],
    totalKes: r.total_kes,
    roomNumber: r.room_number,
    guestName: r.guest_name,
    guestEmail: r.guest_email,
    guestPhone: r.guest_phone,
    receiptKey: r.receipt_key,
    createdAt: r.created_at,
    paidAt: r.paid_at ?? undefined,
    paymentProvider: (r.payment_provider as PaymentProvider) ?? undefined,
    mpesa: r.mpesa ?? undefined,
    paystack: r.paystack ?? undefined,
    lastError: r.last_error ?? undefined,
  };
}

export type BookingRow = {
  id: string;
  status: string;
  room_id: string;
  room_name: string;
  price_per_night: number;
  nights: number;
  total_kes: number;
  check_in: string;
  check_out: string;
  guests: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  special_requests: string;
  receipt_key: string;
  payment_provider: string | null;
  mpesa: BookingRecord["mpesa"] | null;
  paystack: BookingRecord["paystack"] | null;
  last_error: string | null;
  created_at: string;
  paid_at: string | null;
};

export function rowToBooking(r: BookingRow): BookingRecord {
  return {
    id: r.id,
    type: "booking",
    status: r.status as PaymentStatus,
    roomId: r.room_id,
    roomName: r.room_name,
    pricePerNight: r.price_per_night,
    nights: r.nights,
    totalKes: r.total_kes,
    checkIn: r.check_in,
    checkOut: r.check_out,
    guests: r.guests,
    firstName: r.first_name,
    lastName: r.last_name,
    email: r.email,
    phone: r.phone,
    specialRequests: r.special_requests ?? "",
    receiptKey: r.receipt_key,
    createdAt: r.created_at,
    paidAt: r.paid_at ?? undefined,
    paymentProvider: (r.payment_provider as PaymentProvider) ?? undefined,
    mpesa: r.mpesa ?? undefined,
    paystack: r.paystack ?? undefined,
    lastError: r.last_error ?? undefined,
  };
}
