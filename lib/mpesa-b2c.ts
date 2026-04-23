import { mpesaBaseUrl, mpesaGetAccessToken, normalizeMsisdnKenya } from "@/lib/mpesa";

function readEnv(name: string): string {
  return process.env[name]?.trim() || "";
}

function resolvePublicBaseUrl(): string {
  const appUrl = readEnv("NEXT_PUBLIC_APP_URL").replace(/\/$/, "");
  if (appUrl) return appUrl;
  const vercel = readEnv("VERCEL_URL").replace(/^https?:\/\//, "").replace(/\/$/, "");
  if (vercel) return `https://${vercel}`;
  return "";
}

function resolveB2cResultUrl(): string {
  const explicit = readEnv("MPESA_B2C_RESULT_URL");
  if (explicit) return explicit;
  const base = resolvePublicBaseUrl();
  return base ? `${base}/api/webhooks/mpesa/b2c/result` : "";
}

function resolveB2cTimeoutUrl(): string {
  const explicit = readEnv("MPESA_B2C_TIMEOUT_URL");
  if (explicit) return explicit;
  const base = resolvePublicBaseUrl();
  return base ? `${base}/api/webhooks/mpesa/b2c/timeout` : "";
}

function b2cPaymentUrl(): string {
  const explicit = readEnv("MPESA_B2C_URL");
  if (explicit) return explicit;
  return `${mpesaBaseUrl()}/mpesa/b2c/v1/paymentrequest`;
}

function b2cStatusUrl(): string {
  const explicit = readEnv("MPESA_TRANSACTION_STATUS_URL");
  if (explicit) return explicit;
  return `${mpesaBaseUrl()}/mpesa/transactionstatus/v1/query`;
}

function b2cAccountBalanceUrl(): string {
  const explicit = readEnv("MPESA_ACCOUNT_BALANCE_URL");
  if (explicit) return explicit;
  return `${mpesaBaseUrl()}/mpesa/accountbalance/v1/query`;
}

function maskValue(raw: string): string | null {
  const v = raw.trim();
  if (!v) return null;
  if (v.length <= 6) return `${"*".repeat(v.length)}`;
  return `${v.slice(0, 3)}${"*".repeat(Math.max(0, v.length - 6))}${v.slice(-3)}`;
}

type B2cCommandId = "BusinessPayment" | "SalaryPayment" | "PromotionPayment";

function commandIdFromEnv(): B2cCommandId {
  const x = readEnv("MPESA_B2C_COMMAND_ID");
  if (x === "SalaryPayment" || x === "PromotionPayment") return x;
  return "BusinessPayment";
}

export type B2cPayoutParams = {
  phone: string;
  amountKes: number;
  remarks?: string;
  occasion?: string;
  commandId?: B2cCommandId;
};

export type B2cPayoutResult =
  | {
      ok: true;
      conversationId?: string;
      originatorConversationId?: string;
      responseCode?: string;
      responseDescription?: string;
      raw?: string;
    }
  | {
      ok: false;
      error: string;
      raw?: string;
    };

export async function mpesaB2cPayout(params: B2cPayoutParams): Promise<B2cPayoutResult> {
  const initiator = readEnv("MPESA_B2C_INITIATOR_NAME");
  const securityCredential = readEnv("MPESA_B2C_SECURITY_CREDENTIAL");
  const shortcode = readEnv("MPESA_SHORTCODE");
  const resultUrl = resolveB2cResultUrl();
  const timeoutUrl = resolveB2cTimeoutUrl();
  const msisdn = normalizeMsisdnKenya(params.phone);

  const missing: string[] = [];
  if (!initiator) missing.push("MPESA_B2C_INITIATOR_NAME");
  if (!securityCredential) missing.push("MPESA_B2C_SECURITY_CREDENTIAL");
  if (!shortcode) missing.push("MPESA_SHORTCODE");
  if (!resultUrl) missing.push("MPESA_B2C_RESULT_URL (or NEXT_PUBLIC_APP_URL / VERCEL_URL)");
  if (!timeoutUrl) missing.push("MPESA_B2C_TIMEOUT_URL (or NEXT_PUBLIC_APP_URL / VERCEL_URL)");
  if (!msisdn) missing.push("valid Kenya phone");
  if (!Number.isFinite(params.amountKes) || params.amountKes <= 0) missing.push("amountKes > 0");
  if (missing.length) return { ok: false, error: `${missing.join(", ")} required` };

  const token = await mpesaGetAccessToken();
  const body = {
    InitiatorName: initiator,
    SecurityCredential: securityCredential,
    CommandID: params.commandId || commandIdFromEnv(),
    Amount: Math.round(params.amountKes),
    PartyA: shortcode,
    PartyB: msisdn,
    Remarks: (params.remarks || "Lemach payout").slice(0, 100),
    QueueTimeOutURL: timeoutUrl,
    ResultURL: resultUrl,
    Occasion: (params.occasion || "B2C").slice(0, 100),
  };

  const res = await fetch(b2cPaymentUrl(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let root: {
    ConversationID?: string;
    OriginatorConversationID?: string;
    ResponseCode?: string;
    ResponseDescription?: string;
    errorCode?: string;
    errorMessage?: string;
  } = {};
  try {
    root = JSON.parse(text) as typeof root;
  } catch {
    return { ok: false, error: "Invalid JSON from Daraja B2C endpoint", raw: text };
  }

  if (!res.ok || root.errorCode || (root.ResponseCode && root.ResponseCode !== "0")) {
    return {
      ok: false,
      error: root.errorMessage || root.ResponseDescription || `B2C request failed (${res.status})`,
      raw: text,
    };
  }

  return {
    ok: true,
    conversationId: root.ConversationID,
    originatorConversationId: root.OriginatorConversationID,
    responseCode: root.ResponseCode,
    responseDescription: root.ResponseDescription,
    raw: text,
  };
}

export type B2cStatusQueryResult =
  | {
      ok: true;
      conversationId?: string;
      originatorConversationId?: string;
      responseCode?: string;
      responseDescription?: string;
      raw?: string;
    }
  | { ok: false; error: string; raw?: string };

export async function mpesaB2cTransactionStatus(transactionId: string): Promise<B2cStatusQueryResult> {
  const initiator = readEnv("MPESA_B2C_INITIATOR_NAME");
  const securityCredential = readEnv("MPESA_B2C_SECURITY_CREDENTIAL");
  const shortcode = readEnv("MPESA_SHORTCODE");
  const resultUrl = resolveB2cResultUrl();
  const timeoutUrl = resolveB2cTimeoutUrl();

  const missing: string[] = [];
  if (!transactionId?.trim()) missing.push("transactionId");
  if (!initiator) missing.push("MPESA_B2C_INITIATOR_NAME");
  if (!securityCredential) missing.push("MPESA_B2C_SECURITY_CREDENTIAL");
  if (!shortcode) missing.push("MPESA_SHORTCODE");
  if (!resultUrl) missing.push("MPESA_B2C_RESULT_URL (or NEXT_PUBLIC_APP_URL / VERCEL_URL)");
  if (!timeoutUrl) missing.push("MPESA_B2C_TIMEOUT_URL (or NEXT_PUBLIC_APP_URL / VERCEL_URL)");
  if (missing.length) return { ok: false, error: `${missing.join(", ")} required` };

  const token = await mpesaGetAccessToken();
  const body = {
    Initiator: initiator,
    SecurityCredential: securityCredential,
    CommandID: "TransactionStatusQuery",
    TransactionID: transactionId.trim(),
    PartyA: shortcode,
    IdentifierType: "4",
    ResultURL: resultUrl,
    QueueTimeOutURL: timeoutUrl,
    Remarks: "B2C status query",
    Occasion: "B2CStatus",
  };

  const res = await fetch(b2cStatusUrl(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let root: {
    ConversationID?: string;
    OriginatorConversationID?: string;
    ResponseCode?: string;
    ResponseDescription?: string;
    errorCode?: string;
    errorMessage?: string;
  } = {};
  try {
    root = JSON.parse(text) as typeof root;
  } catch {
    return { ok: false, error: "Invalid JSON from Daraja status endpoint", raw: text };
  }

  if (!res.ok || root.errorCode || (root.ResponseCode && root.ResponseCode !== "0")) {
    return {
      ok: false,
      error: root.errorMessage || root.ResponseDescription || `Transaction status query failed (${res.status})`,
      raw: text,
    };
  }

  return {
    ok: true,
    conversationId: root.ConversationID,
    originatorConversationId: root.OriginatorConversationID,
    responseCode: root.ResponseCode,
    responseDescription: root.ResponseDescription,
    raw: text,
  };
}

export type B2cAccountBalanceResult =
  | {
      ok: true;
      conversationId?: string;
      originatorConversationId?: string;
      responseCode?: string;
      responseDescription?: string;
      raw?: string;
    }
  | { ok: false; error: string; raw?: string };

export async function mpesaB2cAccountBalance(): Promise<B2cAccountBalanceResult> {
  const initiator = readEnv("MPESA_B2C_INITIATOR_NAME");
  const securityCredential = readEnv("MPESA_B2C_SECURITY_CREDENTIAL");
  const shortcode = readEnv("MPESA_SHORTCODE");
  const resultUrl = resolveB2cResultUrl();
  const timeoutUrl = resolveB2cTimeoutUrl();

  const missing: string[] = [];
  if (!initiator) missing.push("MPESA_B2C_INITIATOR_NAME");
  if (!securityCredential) missing.push("MPESA_B2C_SECURITY_CREDENTIAL");
  if (!shortcode) missing.push("MPESA_SHORTCODE");
  if (!resultUrl) missing.push("MPESA_B2C_RESULT_URL (or NEXT_PUBLIC_APP_URL / VERCEL_URL)");
  if (!timeoutUrl) missing.push("MPESA_B2C_TIMEOUT_URL (or NEXT_PUBLIC_APP_URL / VERCEL_URL)");
  if (missing.length) return { ok: false, error: `${missing.join(", ")} required` };

  const token = await mpesaGetAccessToken();
  const body = {
    Initiator: initiator,
    SecurityCredential: securityCredential,
    CommandID: "AccountBalance",
    PartyA: shortcode,
    IdentifierType: "4",
    Remarks: "Account balance query",
    QueueTimeOutURL: timeoutUrl,
    ResultURL: resultUrl,
  };

  const res = await fetch(b2cAccountBalanceUrl(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let root: {
    ConversationID?: string;
    OriginatorConversationID?: string;
    ResponseCode?: string;
    ResponseDescription?: string;
    errorCode?: string;
    errorMessage?: string;
  } = {};
  try {
    root = JSON.parse(text) as typeof root;
  } catch {
    return { ok: false, error: "Invalid JSON from Daraja account balance endpoint", raw: text };
  }

  if (!res.ok || root.errorCode || (root.ResponseCode && root.ResponseCode !== "0")) {
    return {
      ok: false,
      error: root.errorMessage || root.ResponseDescription || `Account balance query failed (${res.status})`,
      raw: text,
    };
  }

  return {
    ok: true,
    conversationId: root.ConversationID,
    originatorConversationId: root.OriginatorConversationID,
    responseCode: root.ResponseCode,
    responseDescription: root.ResponseDescription,
    raw: text,
  };
}

export type MpesaB2cDiagnosticResult = {
  ok: boolean;
  summary: string;
  env: {
    configured: {
      consumerKey: boolean;
      consumerSecret: boolean;
      shortcode: boolean;
      initiatorName: boolean;
      securityCredential: boolean;
      apiToken: boolean;
    };
    urls: {
      payout: string;
      transactionStatus: string;
      accountBalance: string;
      result: string;
      timeout: string;
    };
    checks: string[];
    masked: {
      shortcode: string | null;
      initiatorName: string | null;
      securityCredential: string | null;
      apiToken: string | null;
    };
    commandId: B2cCommandId;
  };
  oauth: {
    ok: boolean;
    message: string;
  };
};

export async function diagnoseMpesaB2cConfig(): Promise<MpesaB2cDiagnosticResult> {
  const consumerKey = readEnv("MPESA_CONSUMER_KEY");
  const consumerSecret = readEnv("MPESA_CONSUMER_SECRET");
  const shortcode = readEnv("MPESA_SHORTCODE");
  const initiatorName = readEnv("MPESA_B2C_INITIATOR_NAME");
  const securityCredential = readEnv("MPESA_B2C_SECURITY_CREDENTIAL");
  const apiToken = readEnv("MPESA_B2C_API_TOKEN");
  const resultUrl = resolveB2cResultUrl();
  const timeoutUrl = resolveB2cTimeoutUrl();
  const payout = b2cPaymentUrl();
  const status = b2cStatusUrl();
  const accountBalance = b2cAccountBalanceUrl();

  const checks: string[] = [];
  if (!consumerKey) checks.push("MPESA_CONSUMER_KEY is missing");
  if (!consumerSecret) checks.push("MPESA_CONSUMER_SECRET is missing");
  if (!shortcode) checks.push("MPESA_SHORTCODE is missing");
  if (!initiatorName) checks.push("MPESA_B2C_INITIATOR_NAME is missing");
  if (!securityCredential) checks.push("MPESA_B2C_SECURITY_CREDENTIAL is missing");
  if (!apiToken) checks.push("MPESA_B2C_API_TOKEN is missing");
  if (!resultUrl) checks.push("MPESA_B2C_RESULT_URL is missing and no NEXT_PUBLIC_APP_URL/VERCEL_URL fallback");
  if (!timeoutUrl) checks.push("MPESA_B2C_TIMEOUT_URL is missing and no NEXT_PUBLIC_APP_URL/VERCEL_URL fallback");
  if (resultUrl && !/^https:\/\//i.test(resultUrl)) checks.push("MPESA_B2C_RESULT_URL must be https");
  if (timeoutUrl && !/^https:\/\//i.test(timeoutUrl)) checks.push("MPESA_B2C_TIMEOUT_URL must be https");

  let oauthOk = false;
  let oauthMessage = "Skipped OAuth probe because required credentials are missing.";
  if (consumerKey && consumerSecret) {
    try {
      await mpesaGetAccessToken();
      oauthOk = true;
      oauthMessage = "OAuth success. B2C can authenticate to Daraja.";
    } catch (e) {
      oauthMessage = e instanceof Error ? e.message : "OAuth probe failed.";
    }
  }

  return {
    ok: checks.length === 0 && oauthOk,
    summary:
      checks.length === 0 && oauthOk
        ? "B2C config looks valid. If payouts fail, confirm initiator credential and shortcode permissions with Safaricom."
        : "B2C configuration has issues. Review checks and OAuth message.",
    env: {
      configured: {
        consumerKey: Boolean(consumerKey),
        consumerSecret: Boolean(consumerSecret),
        shortcode: Boolean(shortcode),
        initiatorName: Boolean(initiatorName),
        securityCredential: Boolean(securityCredential),
        apiToken: Boolean(apiToken),
      },
      urls: {
        payout,
        transactionStatus: status,
        accountBalance,
        result: resultUrl,
        timeout: timeoutUrl,
      },
      checks,
      masked: {
        shortcode: maskValue(shortcode),
        initiatorName: maskValue(initiatorName),
        securityCredential: maskValue(securityCredential),
        apiToken: maskValue(apiToken),
      },
      commandId: commandIdFromEnv(),
    },
    oauth: {
      ok: oauthOk,
      message: oauthMessage,
    },
  };
}
