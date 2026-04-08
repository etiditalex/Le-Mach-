"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Utensils,
  Wine,
  Music,
  Trees,
  CheckCircle,
  ShoppingCart,
} from "lucide-react";
import Image from "next/image";
import type { BarBrandRecord } from "@/lib/hotel-types";
import { useCart } from "@/context/CartContext";

export default function BarRestaurantPage() {
  const [barBrands, setBarBrands] = useState<BarBrandRecord[]>([]);
  const [brandsLoadError, setBrandsLoadError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const [brandSearch, setBrandSearch] = useState("");
  const [activeBrandCategory, setActiveBrandCategory] = useState("all");

  useEffect(() => {
    fetch("/api/public/bar-brands")
      .then(async (r) => {
        const data = (await r.json()) as { brands?: BarBrandRecord[]; error?: string };
        if (!r.ok) throw new Error(data.error || "Could not load brands");
        setBarBrands(data.brands ?? []);
        setBrandsLoadError(null);
      })
      .catch((e) => setBrandsLoadError(e instanceof Error ? e.message : "Could not load brands"));
  }, []);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    date: "",
    time: "",
    guests: "",
    phone: "",
    specialRequests: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const brandCategoryTabs = [
    { key: "all", label: "Categories" },
    { key: "beers", label: "Beers" },
    { key: "wines", label: "Wine" },
    { key: "cans", label: "Cans" },
    { key: "whiskey", label: "Whiskey" },
    { key: "shots", label: "Shots" },
    { key: "tequila", label: "Tequila" },
    { key: "gin", label: "Gin" },
    { key: "rum-spirits", label: "Rum & Spirits" },
    { key: "creams-liqueurs", label: "Creams & Liqueurs" },
    { key: "vodka", label: "Vodka" },
  ];
  const filteredBarBrands = barBrands.filter((brand) => {
    const matchesCategory =
      activeBrandCategory === "all" || brand.category.toLowerCase() === activeBrandCategory;
    const q = brandSearch.trim().toLowerCase();
    const matchesSearch = !q || brand.name.toLowerCase().includes(q) || brand.category.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        fullName: "",
        email: "",
        date: "",
        time: "",
        guests: "",
        phone: "",
        specialRequests: "",
      });
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  const timeSlots = [
    "6:30 AM", "7:00 AM", "7:30 AM", "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM",
    "11:00 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM",
    "4:00 PM", "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM",
    "8:30 PM", "9:00 PM", "9:30 PM", "10:00 PM", "11:00 PM",
  ];

  return (
    <main>
      <Header />
      <div className="pt-24 pb-12 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Alcohol brands & pricing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-sans font-bold text-primary mb-3 text-center">
              Our bar offers from the given selection
            </h2>
            <p className="text-center text-gray-600 max-w-2xl mx-auto mb-10">
              Selection and prices for our bar — updated from the admin dashboard. Ask our staff for today&apos;s full list
              and specials.
            </p>
            <div className="max-w-5xl mx-auto mb-8 space-y-4">
              <input
                type="search"
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
                placeholder="Search drinks..."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <div className="overflow-x-auto">
                <div className="min-w-max flex items-center gap-3">
                  {brandCategoryTabs.map((tab) => {
                    const isActive = activeBrandCategory === tab.key;
                    return (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => setActiveBrandCategory(tab.key)}
                        className={`rounded-md px-4 py-2 text-sm font-semibold uppercase tracking-wide whitespace-nowrap transition-colors ${
                          isActive
                            ? "bg-primary text-white"
                            : "bg-white border border-gray-200 text-gray-900 hover:border-primary/40 hover:text-primary"
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            {brandsLoadError && (
              <p className="text-center text-amber-800 bg-amber-50 rounded-lg py-3 px-4 max-w-xl mx-auto text-sm mb-8">
                {brandsLoadError}
              </p>
            )}
            {!brandsLoadError && barBrands.length === 0 && (
              <p className="text-center text-gray-500 text-sm">
                Brands will appear here once they are added in Admin → Bar brands.
              </p>
            )}
            {!brandsLoadError && barBrands.length > 0 && filteredBarBrands.length === 0 && (
              <p className="text-center text-gray-500 text-sm">
                No drinks match your current search or category.
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredBarBrands.map((brand, index) => (
                <motion.div
                  key={brand.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-72 bg-white p-4">
                    <Image
                      src={brand.imageUrl}
                      alt={brand.name}
                      fill
                      className="object-contain p-2"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <Link href={`/bar-restaurant/brands/${encodeURIComponent(brand.id)}`} className="hover:text-primary">
                        <h3 className="text-xl font-sans font-bold text-gray-900">{brand.name}</h3>
                      </Link>
                      <span className="text-lg font-bold text-primary whitespace-nowrap tabular-nums">
                        KSh {brand.price.toLocaleString()}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        addToCart({
                          id: brand.id,
                          name: brand.name,
                          description: brand.description,
                          price: brand.price,
                          image: brand.imageUrl,
                          category: brand.category,
                        })
                      }
                      className="mt-2 inline-flex items-center gap-2 bg-logo text-primary px-4 py-2 rounded-full font-semibold hover:bg-primary hover:text-white transition-all shadow-md"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Reservation Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-lg shadow-md p-8 md:p-12 max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-sans font-bold text-primary mb-8 text-center">
              Make a Reservation
            </h2>
            <p className="text-center text-gray-600 mb-8">
              Book your table for an unforgettable dining experience
            </p>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border border-green-200 rounded-lg p-6 text-center"
              >
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <p className="text-green-700 font-semibold text-lg">
                  Reservation request submitted successfully!
                </p>
                <p className="text-green-600 mt-2">
                  We'll confirm your reservation via email shortly.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      required
                      min={new Date().toISOString().split("T")[0]}
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                      Time *
                    </label>
                    <select
                      id="time"
                      name="time"
                      required
                      value={formData.time}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select time</option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Guests *
                    </label>
                    <select
                      id="guests"
                      name="guests"
                      required
                      value={formData.guests}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select guests</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? "Guest" : "Guests"}
                        </option>
                      ))}
                      <option value="10+">10+ Guests</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-2">
                    Special Requests
                  </label>
                  <textarea
                    id="specialRequests"
                    name="specialRequests"
                    rows={4}
                    value={formData.specialRequests}
                    onChange={handleChange}
                    placeholder="Any special requests or dietary requirements..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-logo text-primary px-6 py-4 rounded-lg font-semibold hover:bg-primary hover:text-white transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "Book Table"}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
