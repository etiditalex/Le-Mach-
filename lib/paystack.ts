import { createHmac, timingSafeEqual } from "crypto";

const PAYSTACK_API = "https://api.paystack.co";

export function paystackSecret(): string | null {
  return process.env.PAYSTACK_SECRET_KEY || null;
}

export function paystackPublicKey(): string | null {
  return process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || null;
}

/** Paystack expects amount in the smallest currency unit (KES: multiply by 100). */
export function kesToPaystackAmount(kes: number): number {
  return Math.round(kes * 100);
}

export async function paystackInitialize(params: {
  email: string;
  amountKes: number;
  reference: string;
  callbackUrl: string;
  metadata: Record<string, string>;
}): Promise<{ ok: true; authorizationUrl: string; accessCode: string } | { ok: false; error: string }> {
  const secret = paystackSecret();
  if (!secret) return { ok: false, error: "PAYSTACK_SECRET_KEY is not set" };

  const res = await fetch(`${PAYSTACK_API}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: params.email,
      amount: kesToPaystackAmount(params.amountKes),
      currency: "KES",
      reference: params.reference,
      callback_url: params.callbackUrl,
      metadata: params.metadata,
    }),
  });
  const json = (await res.json()) as {
    status?: boolean;
    message?: string;
    data?: { authorization_url?: string; access_code?: string };
  };
  if (!res.ok || !json.status || !json.data?.authorization_url) {
    return { ok: false, error: json.message || `Paystack initialize failed (${res.status})` };
  }
  return {
    ok: true,
    authorizationUrl: json.data.authorization_url,
    accessCode: json.data.access_code || "",
  };
}

export async function paystackVerify(reference: string): Promise<
  | {
      ok: true;
      paid: boolean;
      amountKes?: number;
      metadata?: Record<string, string>;
    }
  | { ok: false; error: string }
> {
  const secret = paystackSecret();
  if (!secret) return { ok: false, error: "PAYSTACK_SECRET_KEY is not set" };

  const res = await fetch(`${PAYSTACK_API}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${secret}` },
    cache: "no-store",
  });
  const json = (await res.json()) as {
    status?: boolean;
    message?: string;
    data?: {
      status?: string;
      amount?: number;
      currency?: string;
      metadata?: Record<string, string>;
    };
  };
  if (!res.ok || !json.status || !json.data) {
    return { ok: false, error: json.message || `Verify failed (${res.status})` };
  }
  const paid = json.data.status === "success";
  const amountKes =
    json.data.currency === "KES" && typeof json.data.amount === "number"
      ? Math.round(json.data.amount / 100)
      : undefined;
  const metadata = json.data.metadata;
  return { ok: true, paid, amountKes, metadata };
}

export function verifyPaystackSignature(rawBody: string, signatureHeader: string | null): boolean {
  const secret = paystackSecret();
  if (!secret || !signatureHeader) return false;
  const hash = createHmac("sha512", secret).update(rawBody).digest("hex");
  try {
    const a = Buffer.from(hash, "hex");
    const b = Buffer.from(signatureHeader, "hex");
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
