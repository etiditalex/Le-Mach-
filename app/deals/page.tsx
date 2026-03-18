"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calendar, Users, Utensils, Wifi, Waves, Heart, Sparkles, Gift, Star, Check, ArrowRight, Clock, FileText, AlertCircle, Bed, Droplet, Wind } from "lucide-react";
import Image from "next/image";

const cld = (src: string, transform: string) =>
  src.replace("/image/upload/", `/image/upload/${transform}/`);

const featuredDeal = {
  id: "family",
  badge: "Family Suite",
  title: "Family Suite (Bed & Breakfast Included)",
  description:
    "Bed & breakfast included per night. Spacious comfort for families and small groups.",
  price: 10000,
  features: [
    { icon: Users, text: "Up to 4 Guests" },
    { icon: Bed, text: "2 Bedrooms" },
    { icon: Utensils, text: "Breakfast Included" },
    { icon: Wifi, text: "Free WiFi" },
  ],
  image: cld(
    "https://res.cloudinary.com/dyfnobo9r/image/upload/v1773839988/LEMACHGARDENS301of562_w5lzhz.jpg",
    "f_auto,q_auto,w_1600"
  ),
};

const deals = [
  {
    id: "standard",
    badge: "Standard Room",
    title: "Standard Room",
    description: "Comfortable stay with private bathroom and free WiFi.",
    price: 4500,
    features: [
      { icon: Bed, text: "1 King Bed" },
      { icon: Users, text: "2 Guests" },
      { icon: Droplet, text: "Private Bathroom" },
      { icon: Wifi, text: "Free WiFi" },
    ],
    image: cld(
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1773837496/LEMACHGARDENS12of5621_d09e4v.jpg",
      "f_auto,q_auto,w_1200"
    ),
  },
  {
    id: "deluxe",
    badge: "Deluxe Room",
    title: "Deluxe Room (2 Bedrooms)",
    description: "Extra space for families or groups (no bed & breakfast).",
    price: 8000,
    features: [
      { icon: Bed, text: "2 Bedrooms" },
      { icon: Users, text: "4 Guests" },
      { icon: Droplet, text: "En-suite Bathroom" },
      { icon: Wind, text: "Garden View" },
    ],
    image: cld(
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1773839990/LEMACHGARDENS333of562_kjjury.jpg",
      "f_auto,q_auto,w_1200"
    ),
  },
  {
    id: "family",
    badge: "Family Suite",
    title: "Family Suite (Bed & Breakfast Included)",
    description: "Bed & breakfast included per night for families.",
    price: 10000,
    features: [
      { icon: Users, text: "Up to 4 Guests" },
      { icon: Bed, text: "2 Bedrooms" },
      { icon: Utensils, text: "Breakfast Included" },
      { icon: Wifi, text: "Free WiFi" },
    ],
    image: cld(
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1773839988/LEMACHGARDENS301of562_w5lzhz.jpg",
      "f_auto,q_auto,w_1200"
    ),
  },
];

const rewardsFeatures = [
  {
    icon: Star,
    title: "Earn Points",
    description: "Earn points for every shilling spent on accommodation and services.",
  },
  {
    icon: Gift,
    title: "Redeem Rewards",
    description: "Use your points for free nights, upgrades, and exclusive experiences.",
  },
  {
    icon: Sparkles,
    title: "VIP Treatment",
    description: "Enjoy priority booking, early check-in, and late check-out privileges.",
  },
];

const termsCategories = [
  {
    title: "Booking & Cancellation",
    items: [
      "All bookings require a valid credit card or advance payment",
      "Free cancellation up to 48 hours before check-in",
      "Late cancellations may incur charges",
      "Rates are subject to change without notice",
    ],
  },
  {
    title: "Package Inclusions",
    items: [
      "All packages include accommodation as specified",
      "Meals are included as per package description",
      "Additional services may incur extra charges",
      "Package rates are per room, per night unless stated otherwise",
    ],
  },
  {
    title: "Validity & Availability",
    items: [
      "Offers are subject to availability",
      "Blackout dates may apply during peak seasons",
      "Offers cannot be combined with other promotions",
      "Management reserves the right to modify terms",
    ],
  },
];

export default function DealsPage() {
  return (
    <main>
      <Header />
      <div className="pt-24 pb-12 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden mb-16"
          >
            {/* Hero background image */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  'url("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773839988/LEMACHGARDENS317of562_kplmrj.jpg")',
                // Improve contrast/clarity so the banner looks crisp.
                filter: "brightness(0.88) contrast(1.30) saturate(1.10)",
              }}
            />
            {/* Lighter overlay since there is no text here */}
            <div aria-hidden="true" className="absolute inset-0 bg-primary/20" />

            {/* Keep hero area height (text removed as requested) */}
            <div className="relative z-10 h-56 sm:h-64 lg:h-72" />
          </motion.div>

          {/* Featured Deal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-20"
          >
            <div className="bg-gradient-to-r from-primary to-secondary rounded-lg overflow-hidden shadow-xl">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-64 lg:h-auto">
                  <Image
                    src={featuredDeal.image}
                    alt={featuredDeal.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      {featuredDeal.badge}
                    </span>
                  </div>
                </div>
                <div className="p-8 lg:p-12 text-white">
                  <h2 className="text-4xl font-sans font-bold mb-4">{featuredDeal.title}</h2>
                  <p className="text-lg mb-6 opacity-90">{featuredDeal.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {featuredDeal.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <feature.icon className="w-5 h-5" />
                        <span className="text-sm">{feature.text}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-baseline gap-4 mb-6">
                    <div>
                      <span className="text-sm opacity-75">Price per night</span>
                      <div className="text-4xl font-bold">
                        KSh {featuredDeal.price.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/booking?room=${featuredDeal.id}`}
                    className="inline-block bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Book This Room
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* All Deals Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-20"
          >
            <h2 className="text-3xl font-sans font-bold text-primary mb-8 text-center">
              Choose Your Room
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {deals.map((deal, index) => (
                <motion.div
                  key={deal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="relative h-48">
                    <Image
                      src={deal.image}
                      alt={deal.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {deal.badge}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-sans font-bold text-gray-800 mb-2">
                      {deal.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{deal.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      {deal.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                          <feature.icon className="w-4 h-4 text-primary" />
                          <span>{feature.text}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-baseline gap-3 mb-6">
                      <span className="text-sm text-gray-500">KSh</span>
                      <span className="text-2xl font-bold text-primary">
                        {deal.price.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-500">/night</span>
                    </div>

                    <Link
                      href={`/booking?room=${deal.id}`}
                      className="w-full bg-logo text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition-all shadow-md text-center block"
                    >
                      Book Now
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Rewards Program */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-primary to-secondary rounded-lg p-12 mb-20 text-white"
          >
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-sans font-bold mb-4">Lemach Rewards Program</h2>
                <p className="text-xl opacity-90">
                  Join our loyalty program and earn points with every stay. Enjoy exclusive benefits and special member-only offers.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                {rewardsFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/10 backdrop-blur-sm p-6 rounded-lg"
                  >
                    <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                      <feature.icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="opacity-90">{feature.description}</p>
                  </motion.div>
                ))}
              </div>

              <div className="text-center">
                <button className="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2">
                  Join Rewards Program
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Terms & Conditions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-lg shadow-md p-8"
          >
            <div className="flex items-center gap-3 mb-8">
              <FileText className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-sans font-bold text-primary">Terms & Conditions</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {termsCategories.map((category, index) => (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-primary" />
                    {category.title}
                  </h3>
                  <ul className="space-y-3">
                    {category.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-600">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
