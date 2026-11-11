import type { BookingRecord, FoodOrder } from "@/lib/hotel-types";

/** Test handset. Switch back to 0790 998880 (254790998880) after the test. */
export const HOTEL_WHATSAPP_DISPLAY = "0780 460617";
const HOTEL_WHATSAPP_DIGITS = "254780460617";

function toIntlDigits(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("0")) digits = `254${digits.slice(1)}`;
  else if (digits.length === 9) digits = `254${digits}`;
  return digits;
}

export function hotelWhatsAppDigits(): string {
  const configured = process.env.WHATSAPP_NOTIFY_PHONE?.trim();
  return toIntlDigits(configured || HOTEL_WHATSAPP_DIGITS);
}

export function isHotelWhatsAppConfigured(): boolean {
  if (process.env.CALLMEBOT_APIKEY?.trim()) return true;
  return Boolean(process.env.WHATSAPP_TOKEN?.trim() && process.env.WHATSAPP_PHONE_NUMBER_ID?.trim());
}

function ksh(n: number): string {
  return `KSh ${n.toLocaleString("en-KE")}`;
}

function receiptLine(mpesa?: { receiptNumber?: string } | null): string | null {
  const receipt = mpesa?.receiptNumber?.trim();
  return receipt ? `M-Pesa receipt: ${receipt}` : null;
}

export function foodOrderWhatsAppText(order: FoodOrder, event: "new" | "paid"): string {
  const lines = order.lines.map((line) => `- ${line.name} x${line.quantity} — ${ksh(line.price * line.quantity)}`);
  const title = event === "paid" ? "Food order paid" : "New food order";
  return [
    `*${title} — Le Mach*`,
    `Guest: ${order.guestName}`,
    `Phone: ${order.guestPhone}`,
    order.roomNumber ? `Room: ${order.roomNumber}` : "Room: not given",
    order.guestEmail ? `Email: ${order.guestEmail}` : null,
    "Items:",
    ...lines,
    `Total: ${ksh(order.totalKes)}`,
    event === "paid" ? "Status: Paid" : "Status: Awaiting M-Pesa",
    receiptLine(order.mpesa),
  ]
    .filter(Boolean)
    .join("\n");
}

export function bookingWhatsAppText(booking: BookingRecord, event: "new" | "paid"): string {
  const title = event === "paid" ? "Room booking paid" : "New room booking";
  return [
    `*${title} — Le Mach*`,
    `Guest: ${booking.firstName} ${booking.lastName}`,
    `Phone: ${booking.phone}`,
    `Email: ${booking.email}`,
    `Room: ${booking.roomName}`,
    `Stay: ${booking.checkIn} to ${booking.checkOut} (${booking.nights} night${booking.nights === 1 ? "" : "s"}, ${booking.guests} guest${booking.guests === 1 ? "" : "s"})`,
    booking.specialRequests ? `Notes: ${booking.specialRequests}` : null,
    `Total: ${ksh(booking.totalKes)}`,
    event === "paid" ? "Status: Paid" : "Status: Awaiting M-Pesa",
    receiptLine(booking.mpesa),
  ]
    .filter(Boolean)
    .join("\n");
}

async function sendCallMeBot(phone: string, text: string, apiKey: string, signal: AbortSignal): Promise<void> {
  const url = new URL("https://api.callmebot.com/whatsapp.php");
  url.searchParams.set("phone", `+${phone}`);
  url.searchParams.set("text", text);
  url.searchParams.set("apikey", apiKey);
  const res = await fetch(url, { cache: "no-store", signal });
  const body = await res.text().catch(() => "");
  if (!res.ok || !/queued/i.test(body)) {
    throw new Error(`CallMeBot WhatsApp failed (${res.status}) ${body.slice(0, 180)}`);
  }
}

async function sendCloudApi(
  phone: string,
  text: string,
  token: string,
  phoneNumberId: string,
  signal: AbortSignal
): Promise<void> {
  const res = await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, {
    method: "POST",
    signal,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: phone,
      type: "text",
      text: { preview_url: false, body: text },
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`WhatsApp Cloud API failed (${res.status}) ${body.slice(0, 180)}`);
  }
}

export type WhatsAppSendResult = { ok: true; phone: string } | { ok: false; phone: string; reason: string };

/** Send an order or booking alert to the hotel WhatsApp. Never throws; a failed alert must not block the order. */
export async function notifyHotelWhatsApp(text: string): Promise<WhatsAppSendResult> {
  const phone = hotelWhatsAppDigits();
  const callmebotKey = process.env.CALLMEBOT_APIKEY?.trim();
  const cloudToken = process.env.WHATSAPP_TOKEN?.trim();
  const cloudPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID?.trim();
  if (!callmebotKey && !(cloudToken && cloudPhoneId)) {
    const reason = `WhatsApp alert skipped. Set CALLMEBOT_APIKEY, or WHATSAPP_TOKEN and WHATSAPP_PHONE_NUMBER_ID, so orders can reach ${HOTEL_WHATSAPP_DISPLAY}.`;
    console.warn(reason);
    return { ok: false, phone, reason };
  }

  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), 8000);
  try {
    if (cloudToken && cloudPhoneId) {
      await sendCloudApi(phone, text, cloudToken, cloudPhoneId, ac.signal);
    } else {
      await sendCallMeBot(phone, text, callmebotKey!, ac.signal);
    }
    return { ok: true, phone };
  } catch (e) {
    const reason = e instanceof Error ? e.message : "WhatsApp alert failed";
    console.error(reason);
    return { ok: false, phone, reason };
  } finally {
    clearTimeout(timer);
  }
}
