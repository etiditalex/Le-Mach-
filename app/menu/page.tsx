"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useCart, type MenuItem } from "@/context/CartContext";
import { menuItems as defaultMenuItems } from "@/data/menuItems";
import { ShoppingCart } from "lucide-react";

const categories = ["all", "breakfast", "lunch", "dinner", "desserts", "beverages"];

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [menuItems, setMenuItems] = useState<MenuItem[]>(defaultMenuItems);
  const { addToCart } = useCart();

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch("/api/public/menu");
        if (!res.ok) return;
        const data = (await res.json()) as { items?: MenuItem[] };
        if (!cancelled && data.items?.length) setMenuItems(data.items);
      } catch {
        /* keep bundled fallback */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredItems =
    selectedCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  return (
    <main>
      <Header />
      {/* Menu Hero Section */}
      <section className="relative mt-16 h-[260px] sm:h-[320px] md:h-[380px] lg:h-[420px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://res.cloudinary.com/dyfnobo9r/image/upload/v1773652442/LEMACHGARDENS191of562_nw6lzg.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative h-full flex items-center justify-center">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl mx-auto"
            >
              <p className="text-sm md:text-base uppercase tracking-[0.3em] text-white/80 mb-2 font-sans">
                Welcome to
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans font-bold mb-3">
                Lemach Hotel Menu
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-white/90">
                Discover our curated selection of dishes, drinks, and desserts crafted for every taste.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="pb-12">
        <div className="container mx-auto px-4">

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-logo text-primary shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative h-48">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.name}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      KSh {item.price.toLocaleString()}
                    </span>
                    <button
                      onClick={() => addToCart(item)}
                      className="flex items-center gap-2 bg-logo text-primary px-4 py-2 rounded-full font-semibold hover:bg-primary hover:text-white transition-all shadow-md"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No items found in this category.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}

