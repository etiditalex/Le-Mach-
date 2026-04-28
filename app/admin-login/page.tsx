"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { LogIn, Loader2 } from "lucide-react";
import { Suspense } from "react";

function AdminLoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/admin";

  const safePath = (path: string) =>
    path.startsWith("/") && !path.startsWith("//") ? path : "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const supabase = createBrowserSupabaseClient();
      const { error: signError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (signError) {
        setError(signError.message);
        setLoading(false);
        return;
      }
      // Full navigation so the Supabase cookie session is visible to middleware and server.
      window.location.assign(safePath(redirectTo));
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 sm:p-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="rounded-xl bg-primary/10 p-2.5">
              <LogIn className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-sans font-bold text-primary">Admin login</h1>
              <p className="text-sm text-gray-600">Sign in to access the admin dashboard</p>
            </div>
          </div>

          <form onSubmit={(e) => void handleSubmit(e)} className="mt-8 space-y-5">
            <div>
              <label htmlFor="admin-login-email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <input
                id="admin-login-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label htmlFor="admin-login-password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <input
                id="admin-login-password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-800">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary text-white py-3.5 font-semibold hover:opacity-95 disabled:opacity-60 transition-opacity shadow-md"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign in
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center">
            <Link href="/" className="text-sm text-gray-500 hover:text-primary">
              Back to website
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <main>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        }
      >
        <AdminLoginForm />
      </Suspense>
    </main>
  );
}
