import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";
import { createServerAuthClient } from "@/lib/supabase/server-auth";

/**
 * Require a logged-in Supabase user for admin routes.
 * If `ADMIN_EMAILS` is set (comma-separated), only those emails may access admin.
 */
export async function requireAdminUser(): Promise<User> {
  const supabase = createServerAuthClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/admin-login?redirect=/admin");
  }

  const raw = process.env.ADMIN_EMAILS?.trim();
  if (raw) {
    const allowed = raw.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
    const email = user.email?.toLowerCase();
    if (!email || !allowed.includes(email)) {
      redirect("/?notice=admin_forbidden");
    }
  }

  return user;
}

/** For Route Handlers: returns `User` or a `NextResponse` to return immediately. */
export async function requireAdminApi(): Promise<User | NextResponse> {
  const supabase = createServerAuthClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const raw = process.env.ADMIN_EMAILS?.trim();
  if (raw) {
    const allowed = raw.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
    const email = user.email?.toLowerCase();
    if (!email || !allowed.includes(email)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  return user;
}
