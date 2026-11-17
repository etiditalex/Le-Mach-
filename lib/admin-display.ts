export function formatKsh(n: number) {
  const value = Number.isFinite(n) ? n : 0;
  return `KSh ${value.toLocaleString("en-KE")}`;
}

export function formatCount(n: number) {
  const value = Number.isFinite(n) ? n : 0;
  return Math.round(value).toLocaleString("en-KE");
}

export function paymentStatusLabel(status: string) {
  return status.replace(/_/g, " ");
}

/** Percent change versus a previous period. Null when the previous period has no baseline. */
export function percentChange(current: number, previous: number): number | null {
  if (!(previous > 0) || !Number.isFinite(current) || !Number.isFinite(previous)) return null;
  return ((current - previous) / previous) * 100;
}

export function relativeTime(iso: string, now = Date.now()): string {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return "";
  const diff = Math.max(0, now - t);
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min${mins === 1 ? "" : "s"}`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} hr${hours === 1 ? "" : "s"}`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"}`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function adminGreetingName(user: { email?: string | null; user_metadata?: unknown }): string {
  const meta = user.user_metadata;
  let full = "";
  if (meta && typeof meta === "object") {
    const record = meta as Record<string, unknown>;
    if (typeof record.full_name === "string") full = record.full_name;
    else if (typeof record.name === "string") full = record.name;
  }
  const first = full.trim().split(/\s+/)[0];
  if (first) return first;
  const local = user.email?.split("@")[0]?.trim();
  if (!local) return "there";
  const cleaned = local.replace(/[._-]+/g, " ");
  return cleaned.replace(/\b\w/g, (c) => c.toUpperCase());
}
