"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calendar, Users, Utensils, Wifi, Waves, Heart, Sparkles, Gift, Star, Check, ArrowRight, Clock, FileText, AlertCircle } from "lucide-react";
import Image from "next/image";

const featuredDeal = {
  id: "weekend-getaway",
  badge: "Limited Time Offer",
  title: "Weekend Getaway Package",
  description: "Escape to luxury this weekend with our special package including accommodation, breakfast, and dinner for two.",
  originalPrice: 25000,
  discountedPrice: 18000,
  discount: 28,
  features: [
    { icon: Calendar, text: "2 Nights Stay" },
    { icon: Utensils, text: "Breakfast & Dinner" },
    { icon: Waves, text: "Pool Access" },
    { icon: Wifi, text: "Free WiFi" },
  ],
  image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1756014497/IMG_2954_y59iig.jpg",
};

const deals = [
  {
    id: "family",
    badge: "Family Special",
    title: "Family Package",
    description: "Perfect for families with spacious accommodation and activities for children.",
    originalPrice: 35000,
    discountedPrice: 28000,
    features: [
      { icon: Users, text: "Up to 4 Guests" },
      { icon: Utensils, text: "All Meals Included" },
      { icon: Gift, text: "Kids Activities" },
    ],
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1756014481/IMG_2926_nzrxnh.jpg",
  },
  {
    id: "business",
    badge: "Business Special",
    title: "Business Package",
    description: "Ideal for business travelers with conference facilities and business amenities.",
    originalPrice: 20000,
    discountedPrice: 15000,
    features: [
      { icon: FileText, text: "Conference Room Access" },
      { icon: Wifi, text: "High-speed WiFi" },
      { icon: Utensils, text: "Business Lunch" },
    ],
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1756014498/IMG_2958_dsuafs.jpg",
  },
  {
    id: "honeymoon",
    badge: "Romance Special",
    title: "Honeymoon Package",
    description: "Create unforgettable memories with our romantic honeymoon package.",
    originalPrice: 45000,
    discountedPrice: 35000,
    features: [
      { icon: Heart, text: "Romantic Setup" },
      { icon: Utensils, text: "Candlelight Dinner" },
      { icon: Sparkles, text: "Spa Treatment" },
    ],
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1756012069/download_cxioxr.jpg",
  },
  {
    id: "long-stay",
    badge: "Extended Stay",
    title: "Long Stay Package",
    description: "Special rates for extended stays of 7 nights or more with additional amenities.",
    originalPrice: 60000,
    discountedPrice: 45000,
    features: [
      { icon: Calendar, text: "7+ Nights" },
      { icon: Utensils, text: "Daily Breakfast" },
      { icon: Star, text: "Concierge Service" },
    ],
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1756014481/IMG_2936_sgngqe.jpg",
  },
  {
    id: "group",
    badge: "Group Discount",
    title: "Group Booking",
    description: "Special rates for groups of 10 or more people with dedicated event planning.",
    originalPrice: 80000,
    discountedPrice: 60000,
    features: [
      { icon: Users, text: "10+ Guests" },
      { icon: Calendar, text: "Event Planning" },
      { icon: Utensils, text: "Group Catering" },
    ],
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1756014498/IMG_2958_dsuafs.jpg",
  },
  {
    id: "seasonal",
    badge: "Seasonal Special",
    title: "Seasonal Offer",
    description: "Take advantage of our seasonal rates during off-peak periods.",
    originalPrice: 15000,
    discountedPrice: 10000,
    features: [
      { icon: Calendar, text: "Off-peak Rates" },
      { icon: Utensils, text: "Breakfast Included" },
      { icon: Waves, text: "Pool Access" },
    ],
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1756014497/IMG_2954_y59iig.jpg",
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
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-serif font-bold text-primary mb-4">
              Special Deals & Offers
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover amazing deals and packages for your perfect stay at Lemach Hotel
            </p>
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
                  <h2 className="text-4xl font-serif font-bold mb-4">{featuredDeal.title}</h2>
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
                      <span className="text-sm opacity-75 line-through">
                        KSh {featuredDeal.originalPrice.toLocaleString()}
                      </span>
                      <div className="text-4xl font-bold">
                        KSh {featuredDeal.discountedPrice.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                      <span className="text-2xl font-bold">Save {featuredDeal.discount}%</span>
                    </div>
                  </div>

                  <Link
                    href={`/booking?deal=${featuredDeal.id}`}
                    className="inline-block bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Book This Deal
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
            <h2 className="text-3xl font-serif font-bold text-primary mb-8 text-center">
              All Special Offers
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
                    <h3 className="text-2xl font-serif font-bold text-gray-800 mb-2">
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
                      <span className="text-sm text-gray-500 line-through">
                        KSh {deal.originalPrice.toLocaleString()}
                      </span>
                      <span className="text-2xl font-bold text-primary">
                        KSh {deal.discountedPrice.toLocaleString()}
                      </span>
                    </div>

                    <Link
                      href={`/booking?deal=${deal.id}`}
                      className="w-full bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow text-center block"
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
                <h2 className="text-4xl font-serif font-bold mb-4">Lemach Rewards Program</h2>
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
              <h2 className="text-3xl font-serif font-bold text-primary">Terms & Conditions</h2>
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
