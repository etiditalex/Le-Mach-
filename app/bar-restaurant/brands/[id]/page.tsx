"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart, type MenuItem } from "@/context/CartContext";
import type { BarBrandRecord } from "@/lib/hotel-types";

export default function BarBrandCheckoutPage() {
  const params = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [brand, setBrand] = useState<BarBrandRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/public/bar-brands/${encodeURIComponent(params.id)}`, { cache: "no-store" });
        const data = (await res.json()) as { brand?: BarBrandRecord; error?: string };
        if (!res.ok || !data.brand) {
          throw new Error(data.error || "Could not load brand");
        }
        if (!cancelled) setBrand(data.brand);
      } catch (e) {
        if (!cancelled) {
          setBrand(null);
          setError(e instanceof Error ? e.message : "Could not load brand");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  const cartItem = useMemo<MenuItem | null>(() => {
    if (!brand) return null;
    return {
      id: brand.id,
      name: brand.name,
      description: brand.description,
      price: brand.price,
      image: brand.imageUrl,
      category: brand.category,
    };
  }, [brand]);

  return (
    <main>
      <Header />
      <div className="pt-24 pb-16 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link href="/bar-restaurant" className="text-sm text-gray-600 hover:text-primary">
            ← Back to Bar &amp; Restaurant
          </Link>

          {loading ? (
            <div className="rounded-xl bg-white p-8 mt-6 text-gray-600">Loading brand details…</div>
          ) : error ? (
            <div className="rounded-xl bg-white p-8 mt-6 text-red-700 border border-red-100">{error}</div>
          ) : brand ? (
            <div className="rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden mt-6">
              <div className="relative h-72 bg-gray-100">
                <Image src={brand.imageUrl} alt={brand.name} fill className="object-cover" />
              </div>
              <div className="p-6 md:p-8">
                <h1 className="text-3xl font-sans font-bold text-gray-900">{brand.name}</h1>
                <p className="mt-3 text-lg font-semibold text-primary">KSh {brand.price.toLocaleString()}</p>
                <p className="mt-5 text-gray-700 leading-relaxed">{brand.description}</p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (cartItem) addToCart(cartItem);
                    }}
                    className="inline-flex items-center gap-2 bg-logo text-primary px-5 py-3 rounded-full font-semibold hover:bg-primary hover:text-white transition-all shadow-md"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </button>
                  <Link
                    href="/bar-restaurant"
                    className="inline-flex items-center px-5 py-3 rounded-full border border-gray-300 text-gray-700 hover:text-primary hover:border-primary/40"
                  >
                    Continue browsing
                  </Link>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <Footer />
    </main>
  );
}
