const SANDBOX = "https://sandbox.safaricom.co.ke";
const PRODUCTION = "https://api.safaricom.co.ke";

function readEnv(name: string): string {
  return process.env[name]?.trim() || "";
}

function resolveMpesaCallbackUrl(): string {
  const explicit = readEnv("MPESA_CALLBACK_URL");
  if (explicit) return explicit;
  const appUrl = readEnv("NEXT_PUBLIC_APP_URL").replace(/\/$/, "");
  if (appUrl) return `${appUrl}/api/webhooks/mpesa`;
  const vercel = readEnv("VERCEL_URL").replace(/^https?:\/\//, "").replace(/\/$/, "");
  if (vercel) return `https://${vercel}/api/webhooks/mpesa`;
  return "";
}

export function mpesaBaseUrl(): string {
  const fromEnv = process.env.MPESA_BASE_URL?.trim().replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  const env = process.env.MPESA_ENV || "sandbox";
  return env === "production" ? PRODUCTION : SANDBOX;
}

function mpesaOAuthUrl(): string {
  const fromEnv = process.env.MPESA_OAUTH_URL?.trim();
  if (fromEnv) {
    try {
      const url = new URL(fromEnv);
      if (!url.searchParams.get("grant_type")) {
        url.searchParams.set("grant_type", "client_credentials");
      }
      return url.toString();
    } catch {
      const joiner = fromEnv.includes("?") ? "&" : "?";
      return fromEnv.includes("grant_type=")
        ? fromEnv
        : `${fromEnv}${joiner}grant_type=client_credentials`;
    }
  }
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

function explainOAuthFailure(status: number, raw: string): string {
  const lower = raw.toLowerCase();
  if (
    status === 401 ||
    lower.includes("invalid consumer") ||
    lower.includes("invalid key") ||
    lower.includes("invalid credentials") ||
    lower.includes("consumer key") ||
    lower.includes("consumer secret")
  ) {
    return "Daraja OAuth failed: MPESA_CONSUMER_KEY or MPESA_CONSUMER_SECRET is invalid for the selected MPESA_ENV.";
  }
  if (status === 403 || lower.includes("forbidden")) {
    return "Daraja OAuth failed: app is not authorized for this environment. Confirm sandbox/production app settings in Safaricom Daraja.";
  }
  return `Daraja OAuth failed (${status}). ${raw || "No details returned by Daraja."}`;
}

function validateShortcode(shortcode: string): string | null {
  if (!/^\d{5,7}$/.test(shortcode)) {
    return "MPESA_SHORTCODE must be 5-7 digits (no spaces).";
  }
  return null;
}

function explainStkFailure(rawError: string): string {
  const lower = rawError.toLowerCase();
  if (lower.includes("shortcode") || lower.includes("businessshortcode")) {
    return `${rawError}. Check MPESA_SHORTCODE and MPESA_TRANSACTION_TYPE (paybill vs till).`;
  }
  if (lower.includes("password") || lower.includes("passkey")) {
    return `${rawError}. Check MPESA_PASSKEY for the same shortcode and environment.`;
  }
  if (lower.includes("callback")) {
    return `${rawError}. Check MPESA_CALLBACK_URL is public https and reachable.`;
  }
  if (lower.includes("credential") || lower.includes("token") || lower.includes("authorization")) {
    return `${rawError}. Check MPESA_CONSUMER_KEY/MPESA_CONSUMER_SECRET and MPESA_ENV.`;
  }
  return rawError;
}

function maskValue(raw: string): string | null {
  const v = raw.trim();
  if (!v) return null;
  if (v.length <= 6) return `${"*".repeat(v.length)}`;
  return `${v.slice(0, 3)}${"*".repeat(Math.max(0, v.length - 6))}${v.slice(-3)}`;
}

export async function mpesaGetAccessToken(): Promise<string> {
  const key = readEnv("MPESA_CONSUMER_KEY");
  const secret = readEnv("MPESA_CONSUMER_SECRET");
  if (!key || !secret) {
    const missing: string[] = [];
    if (!key) missing.push("MPESA_CONSUMER_KEY");
    if (!secret) missing.push("MPESA_CONSUMER_SECRET");
    throw new Error(`${missing.join(", ")} must be set`);
  }

  const auth = Buffer.from(`${key}:${secret}`, "utf-8").toString("base64");
  const url = mpesaOAuthUrl();
  const res = await fetch(url, {
    headers: { Authorization: `Basic ${auth}` },
    cache: "no-store",
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(explainOAuthFailure(res.status, t));
  }
  const data = (await res.json()) as { access_token?: string };
  if (!data.access_token) throw new Error("Daraja OAuth: missing access_token");
  return data.access_token;
}

export type MpesaDiagnosticResult = {
  ok: boolean;
  summary: string;
  env: {
    mpesaEnv: string;
    transactionType: "CustomerPayBillOnline" | "CustomerBuyGoodsOnline";
    callbackUrl: string;
    callbackUrlHttps: boolean;
    configured: {
      consumerKey: boolean;
      consumerSecret: boolean;
      shortcode: boolean;
      passkey: boolean;
    };
    masked: {
      shortcode: string | null;
      consumerKey: string | null;
      consumerSecret: string | null;
      passkey: string | null;
    };
    checks: string[];
  };
  oauth: {
    ok: boolean;
    message: string;
  };
};

export async function diagnoseMpesaConfig(): Promise<MpesaDiagnosticResult> {
  const mpesaEnv = readEnv("MPESA_ENV") || "sandbox";
  const consumerKey = readEnv("MPESA_CONSUMER_KEY");
  const consumerSecret = readEnv("MPESA_CONSUMER_SECRET");
  const shortcode = readEnv("MPESA_SHORTCODE");
  const passkey = readEnv("MPESA_PASSKEY");
  const callbackUrl = resolveMpesaCallbackUrl();
  const txType = mpesaTransactionType();

  const checks: string[] = [];
  if (!consumerKey) checks.push("MPESA_CONSUMER_KEY is missing");
  if (!consumerSecret) checks.push("MPESA_CONSUMER_SECRET is missing");
  if (!shortcode) checks.push("MPESA_SHORTCODE is missing");
  if (!passkey) checks.push("MPESA_PASSKEY is missing");
  if (!callbackUrl) checks.push("MPESA_CALLBACK_URL (or NEXT_PUBLIC_APP_URL / VERCEL_URL fallback) is missing");
  if (callbackUrl && !/^https:\/\//i.test(callbackUrl)) checks.push("Callback URL should be https in production");
  const shortcodeError = shortcode ? validateShortcode(shortcode) : null;
  if (shortcodeError) checks.push(shortcodeError);

  let oauthOk = false;
  let oauthMessage = "Skipped OAuth probe because required credentials are missing.";
  if (consumerKey && consumerSecret) {
    try {
      await mpesaGetAccessToken();
      oauthOk = true;
      oauthMessage = "OAuth success. Consumer key/secret and MPESA_ENV are valid.";
    } catch (e) {
      oauthMessage = e instanceof Error ? e.message : "OAuth probe failed.";
    }
  }

  const ok = checks.length === 0 && oauthOk;
  const summary = ok
    ? "M-Pesa configuration looks valid. If STK still fails, likely shortcode/passkey/transaction-type mismatch at STK stage."
    : "M-Pesa configuration has issues. Review checks and OAuth message.";

  return {
    ok,
    summary,
    env: {
      mpesaEnv,
      transactionType: txType,
      callbackUrl,
      callbackUrlHttps: /^https:\/\//i.test(callbackUrl),
      configured: {
        consumerKey: Boolean(consumerKey),
        consumerSecret: Boolean(consumerSecret),
        shortcode: Boolean(shortcode),
        passkey: Boolean(passkey),
      },
      masked: {
        shortcode: maskValue(shortcode),
        consumerKey: maskValue(consumerKey),
        consumerSecret: maskValue(consumerSecret),
        passkey: maskValue(passkey),
      },
      checks,
    },
    oauth: {
      ok: oauthOk,
      message: oauthMessage,
    },
  };
}

export type StkPushParams = {
  amountKes: number;
  phone254: string;
  accountReference: string;
  transactionDesc: string;
};

function mpesaTransactionType(): "CustomerPayBillOnline" | "CustomerBuyGoodsOnline" {
  const tx = readEnv("MPESA_TRANSACTION_TYPE");
  return tx === "CustomerBuyGoodsOnline" ? "CustomerBuyGoodsOnline" : "CustomerPayBillOnline";
}

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

const MPESA_RESULT_CODE_HINTS: Record<number, string> = {
  1: "Rejected by M-Pesa. Common causes: invalid shortcode/passkey, unsupported transaction type, or unresolved payer account state.",
  4999: "Transaction is still processing in M-Pesa. Wait briefly and query again.",
  1001: "Subscriber is locked or cannot transact. Ask customer to contact Safaricom/M-Pesa support.",
  1019: "Transaction expired before completion (timeout).",
  1025: "Push request failed to complete. Retry after a short delay.",
  1032: "Customer cancelled the STK prompt.",
  1037: "STK prompt not reached or phone unreachable/offline.",
  2001: "Invalid initiator information or security credentials.",
  2006: "Insufficient balance or payer account restrictions.",
};

function explainMpesaResult(resultCode: number | undefined, resultDesc: string | undefined): string {
  const base = (resultDesc || "M-Pesa transaction failed").trim();
  if (resultCode === undefined || Number.isNaN(resultCode)) return base;
  const hint = MPESA_RESULT_CODE_HINTS[resultCode];
  return hint ? `M-Pesa ${resultCode}: ${base}. ${hint}` : `M-Pesa ${resultCode}: ${base}`;
}

export async function mpesaStkPush(params: StkPushParams): Promise<StkPushResult> {
  const shortcode = readEnv("MPESA_SHORTCODE");
  const passkey = readEnv("MPESA_PASSKEY");
  const callbackUrl = resolveMpesaCallbackUrl();
  if (!shortcode || !passkey || !callbackUrl) {
    const missing: string[] = [];
    if (!shortcode) missing.push("MPESA_SHORTCODE");
    if (!passkey) missing.push("MPESA_PASSKEY");
    if (!callbackUrl) missing.push("MPESA_CALLBACK_URL (or NEXT_PUBLIC_APP_URL / VERCEL_URL)");
    return {
      ok: false,
      error: `${missing.join(", ")} must be set`,
    };
  }
  const shortcodeError = validateShortcode(shortcode);
  if (shortcodeError) return { ok: false, error: shortcodeError };

  const ts = timestamp();
  const token = await mpesaGetAccessToken();
  const body = {
    BusinessShortCode: shortcode,
    Password: password(shortcode, passkey, ts),
    Timestamp: ts,
    TransactionType: mpesaTransactionType(),
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
    error: explainStkFailure(root.errorMessage || root.ResponseDescription || root.ResponseCode || "STK request failed"),
    raw: text,
  };
}

export async function mpesaStkQuery(checkoutRequestId: string): Promise<StkQueryResult> {
  const shortcode = readEnv("MPESA_SHORTCODE");
  const passkey = readEnv("MPESA_PASSKEY");
  if (!shortcode || !passkey) {
    const missing: string[] = [];
    if (!shortcode) missing.push("MPESA_SHORTCODE");
    if (!passkey) missing.push("MPESA_PASSKEY");
    return {
      ok: false,
      error: `${missing.join(", ")} must be set`,
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

  if (resultCode === 4999) {
    return {
      ok: true,
      status: "pending",
      resultCode,
      resultDesc: explainMpesaResult(resultCode, root.ResultDesc || root.ResponseDescription),
      raw: text,
    };
  }

  return {
    ok: true,
    status: "failed",
    resultCode,
    resultDesc: explainMpesaResult(resultCode, root.ResultDesc || root.ResponseDescription),
    raw: text,
  };
}
