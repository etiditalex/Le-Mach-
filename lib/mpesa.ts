const SANDBOX = "https://sandbox.safaricom.co.ke";
const PRODUCTION = "https://api.safaricom.co.ke";

export function mpesaBaseUrl(): string {
  const fromEnv = process.env.MPESA_BASE_URL?.trim().replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  const env = process.env.MPESA_ENV || "sandbox";
  return env === "production" ? PRODUCTION : SANDBOX;
}

function mpesaOAuthUrl(): string {
  const fromEnv = process.env.MPESA_OAUTH_URL?.trim();
  if (fromEnv) return fromEnv;
  return `${mpesaBaseUrl()}/oauth/v1/generate?grant_type=client_credentials`;
}

function mpesaStkPushUrl(): string {
  const fromEnv = process.env.MPESA_STK_PUSH_URL?.trim();
  if (fromEnv) return fromEnv;
  return `${mpesaBaseUrl()}/mpesa/stkpush/v1/processrequest`;
}

function mpesaStkQueryUrl(): string {
  const fromEnv = process.env.MPESA_STK_QUERY_URL?.trim();
  if (fromEnv) return fromEnv;
  return `${mpesaBaseUrl()}/mpesa/stkpushquery/v1/query`;
}

export function normalizeMsisdnKenya(raw: string): string | null {
  const d = raw.replace(/\D/g, "");
  if (d.startsWith("254") && d.length === 12) return d;
  if (d.startsWith("0") && d.length === 10) return `254${d.slice(1)}`;
  if (d.length === 9 && d.startsWith("7")) return `254${d}`;
  return null;
}

function timestamp(): string {
  const x = new Date();
  const p = (n: number) => n.toString().padStart(2, "0");
  return `${x.getFullYear()}${p(x.getMonth() + 1)}${p(x.getDate())}${p(x.getHours())}${p(x.getMinutes())}${p(x.getSeconds())}`;
}

function password(shortcode: string, passkey: string, ts: string): string {
  return Buffer.from(`${shortcode}${passkey}${ts}`, "utf-8").toString("base64");
}

export async function mpesaGetAccessToken(): Promise<string> {
  const key = process.env.MPESA_CONSUMER_KEY;
  const secret = process.env.MPESA_CONSUMER_SECRET;
  if (!key || !secret) throw new Error("MPESA_CONSUMER_KEY and MPESA_CONSUMER_SECRET are required");

  const auth = Buffer.from(`${key}:${secret}`, "utf-8").toString("base64");
  const url = mpesaOAuthUrl();
  const res = await fetch(url, {
    headers: { Authorization: `Basic ${auth}` },
    cache: "no-store",
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Daraja OAuth failed: ${res.status} ${t}`);
  }
  const data = (await res.json()) as { access_token?: string };
  if (!data.access_token) throw new Error("Daraja OAuth: missing access_token");
  return data.access_token;
}

export type StkPushParams = {
  amountKes: number;
  phone254: string;
  accountReference: string;
  transactionDesc: string;
};

export type StkPushResult =
  | {
      ok: true;
      merchantRequestId: string;
      checkoutRequestId: string;
      customerMessage: string;
    }
  | { ok: false; error: string; raw?: string };

export type StkQueryResult =
  | { ok: true; status: "success" | "pending" | "failed"; resultCode?: number; resultDesc?: string; raw?: string }
  | { ok: false; error: string; raw?: string };

export async function mpesaStkPush(params: StkPushParams): Promise<StkPushResult> {
  const shortcode = process.env.MPESA_SHORTCODE;
  const passkey = process.env.MPESA_PASSKEY;
  const callbackUrl = process.env.MPESA_CALLBACK_URL;
  if (!shortcode || !passkey || !callbackUrl) {
    return {
      ok: false,
      error: "MPESA_SHORTCODE, MPESA_PASSKEY, and MPESA_CALLBACK_URL must be set",
    };
  }

  const ts = timestamp();
  const token = await mpesaGetAccessToken();
  const body = {
    BusinessShortCode: shortcode,
    Password: password(shortcode, passkey, ts),
    Timestamp: ts,
    TransactionType: "CustomerPayBillOnline",
    Amount: Math.round(params.amountKes),
    PartyA: params.phone254,
    PartyB: shortcode,
    PhoneNumber: params.phone254,
    CallBackURL: callbackUrl,
    AccountReference: params.accountReference.slice(0, 12),
    TransactionDesc: params.transactionDesc.slice(0, 18),
  };

  const res = await fetch(mpesaStkPushUrl(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    return { ok: false, error: "Invalid JSON from Daraja", raw: text };
  }

  const root = json as {
    MerchantRequestID?: string;
    CheckoutRequestID?: string;
    ResponseCode?: string;
    ResponseDescription?: string;
    CustomerMessage?: string;
    errorCode?: string;
    errorMessage?: string;
  };

  if (root.ResponseCode === "0" && root.CheckoutRequestID && root.MerchantRequestID) {
    return {
      ok: true,
      merchantRequestId: root.MerchantRequestID,
      checkoutRequestId: root.CheckoutRequestID,
      customerMessage: root.CustomerMessage || "STK push sent",
    };
  }

  return {
    ok: false,
    error: root.errorMessage || root.ResponseDescription || root.ResponseCode || "STK request failed",
    raw: text,
  };
}

export async function mpesaStkQuery(checkoutRequestId: string): Promise<StkQueryResult> {
  const shortcode = process.env.MPESA_SHORTCODE;
  const passkey = process.env.MPESA_PASSKEY;
  if (!shortcode || !passkey) {
    return {
      ok: false,
      error: "MPESA_SHORTCODE and MPESA_PASSKEY must be set",
    };
  }

  const ts = timestamp();
  const token = await mpesaGetAccessToken();
  const body = {
    BusinessShortCode: shortcode,
    Password: password(shortcode, passkey, ts),
    Timestamp: ts,
    CheckoutRequestID: checkoutRequestId,
  };

  const res = await fetch(mpesaStkQueryUrl(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const text = await res.text();
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    return { ok: false, error: "Invalid JSON from Daraja", raw: text };
  }

  const root = json as {
    ResponseCode?: string;
    ResponseDescription?: string;
    ResultCode?: string | number;
    ResultDesc?: string;
    errorCode?: string;
    errorMessage?: string;
  };

  if (!res.ok || root.errorCode) {
    return {
      ok: false,
      error: root.errorMessage || root.ResponseDescription || `STK query failed (${res.status})`,
      raw: text,
    };
  }

  const resultCode =
    root.ResultCode !== undefined && root.ResultCode !== null ? Number(root.ResultCode) : undefined;

  if (resultCode === undefined || Number.isNaN(resultCode)) {
    return {
      ok: true,
      status: "pending",
      resultDesc: root.ResponseDescription || root.ResultDesc || "Transaction status pending",
      raw: text,
    };
  }

  if (resultCode === 0) {
    return {
      ok: true,
      status: "success",
      resultCode,
      resultDesc: root.ResultDesc || root.ResponseDescription,
      raw: text,
    };
  }

  return {
    ok: true,
    status: "failed",
    resultCode,
    resultDesc: root.ResultDesc || root.ResponseDescription || "M-Pesa transaction failed",
    raw: text,
  };
}
