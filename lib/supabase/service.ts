import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

/**
 * Server-only client with service role — bypasses RLS. Use only in Route Handlers / Server Actions.
 */
export function getServiceSupabase(): SupabaseClient {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !key) {
    const missing: string[] = [];
    if (!url) missing.push("NEXT_PUBLIC_SUPABASE_URL");
    if (!key) missing.push("SUPABASE_SERVICE_ROLE_KEY");
    throw new Error(
      `Missing Supabase env: ${missing.join(", ")}.\n\n` +
        `Fix:\n` +
        `1. Create or edit .env.local in the project root (same folder as package.json).\n` +
        `2. Add the two variables with no space after "=".\n` +
        `3. SUPABASE_SERVICE_ROLE_KEY must be the "service_role" key from Supabase → Project Settings → API (not the anon key).\n` +
        `4. Stop and run npm run dev again so Next.js reloads env.\n\n` +
        `.env.example is only a template — Next.js does not load it automatically.`
    );
  }

  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
