export type ParsedStkCallback = {
  checkoutRequestId: string;
  merchantRequestId: string;
  resultCode: number;
  resultDesc: string;
  amount?: number;
  receipt?: string;
  phone?: string;
};

export function parseMpesaStkCallback(body: unknown): ParsedStkCallback | null {
  const root = body as {
    Body?: { stkCallback?: Record<string, unknown> };
  };
  const cb = root?.Body?.stkCallback;
  if (!cb || typeof cb !== "object") return null;

  const checkoutRequestId = cb.CheckoutRequestID as string | undefined;
  const merchantRequestId = cb.MerchantRequestID as string | undefined;
  const resultCode = Number(cb.ResultCode);
  const resultDesc = String(cb.ResultDesc ?? "");

  if (!checkoutRequestId || !merchantRequestId || Number.isNaN(resultCode)) return null;

  const meta = cb.CallbackMetadata as { Item?: { Name?: unknown; Value?: unknown }[] } | undefined;
  const items = meta?.Item ?? [];
  const map: Record<string, string | number | undefined> = {};
  for (const it of items) {
    if (!it || typeof it !== "object") continue;
    const name = typeof it.Name === "string" ? it.Name : null;
    if (!name) continue;
    const value = it.Value;
    if (typeof value === "string" || typeof value === "number") {
      map[name] = value;
    }
  }

  const amountRaw = map.Amount !== undefined ? Number(map.Amount) : undefined;
  const amount = amountRaw !== undefined && Number.isFinite(amountRaw) ? amountRaw : undefined;
  const receipt = map.MpesaReceiptNumber !== undefined ? String(map.MpesaReceiptNumber) : undefined;
  const phone = map.PhoneNumber !== undefined ? String(map.PhoneNumber) : undefined;

  return {
    checkoutRequestId,
    merchantRequestId,
    resultCode,
    resultDesc,
    amount,
    receipt,
    phone,
  };
}
