"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Bed, Users, Wifi, Wind, Tv, Coffee, Droplet, Bell, ArrowRight } from "lucide-react";
import Image from "next/image";
import type { RoomRecord } from "@/lib/hotel-types";

/** Shown on cards; full detail pages can use richer legacy data when available. */
const quickFeatures = [
  { icon: Bed, text: "Comfortable stay" },
  { icon: Users, text: "Spacious for guests" },
  { icon: Wifi, text: "Free WiFi" },
  { icon: Droplet, text: "Private bathroom" },
];

const amenities = [
  { icon: Wifi, title: "Free WiFi", description: "High-speed internet access throughout the hotel" },
  { icon: Wind, title: "Air Conditioning", description: "Climate control for your comfort" },
  { icon: Tv, title: "Smart TV", description: "Entertainment with streaming services" },
  { icon: Coffee, title: "Coffee Maker", description: "In-room coffee and tea facilities" },
  { icon: Droplet, title: "Private Bathroom", description: "En-suite bathrooms with hot water" },
  { icon: Bell, title: "Room Service", description: "24/7 room service available" },
];

export default function RoomsPage() {
  const [rooms, setRooms] = useState<RoomRecord[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/public/rooms")
      .then(async (r) => {
        const data = (await r.json()) as { rooms?: RoomRecord[]; error?: string };
        if (!r.ok) throw new Error(data.error || "Could not load rooms");
        setRooms(data.rooms ?? []);
        setLoadError(null);
      })
      .catch((e) => setLoadError(e instanceof Error ? e.message : "Could not load rooms"));
  }, []);

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
            {/* Hero background image (no text per request) */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  'url("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773839988/LEMACHGARDENS300of562_uhl0eq.jpg")',
                // Improve contrast/clarity while keeping colors natural.
                filter: "brightness(0.88) contrast(1.30) saturate(1.10)",
              }}
            />

            {/* Lightweight overlay so the background reads clearly */}
            <div aria-hidden="true" className="absolute inset-0 bg-primary/20" />

            {/* Keep hero area visible even without text */}
            <div className="relative z-10 h-56 sm:h-64 lg:h-72" />
          </motion.div>

          {/* Rooms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {loadError ? (
              <p className="text-red-600 md:col-span-2 text-center">{loadError}</p>
            ) : null}
            {!loadError && rooms.length === 0 ? (
              <p className="text-gray-600 md:col-span-2 text-center">No rooms available yet.</p>
            ) : null}
            {rooms.map((room, index) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative h-64">
                  <Image
                    src={room.image}
                    alt={room.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={index === 0}
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-sans font-bold text-gray-800 mb-2">
                        {room.name}
                      </h2>
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm text-gray-500">From</span>
                        <span className="text-3xl font-bold text-primary">
                          KSh {room.pricePerNight.toLocaleString()}
                        </span>
                        <span className="text-gray-500">per night</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6">{room.description ?? ""}</p>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {quickFeatures.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-gray-700">
                        <feature.icon className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-sm">{feature.text}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <Link
                      href={`/booking?room=${room.id}`}
                      className="flex-1 bg-logo text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition-all shadow-md text-center"
                    >
                      Book Now
                    </Link>
                    <Link
                      href={`/rooms/${room.id}`}
                      className="px-6 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors text-center"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Room Amenities Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-lg shadow-md p-8 mb-20"
          >
            <h2 className="text-3xl font-sans font-bold text-primary mb-8 text-center">
              Room Amenities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {amenities.map((amenity, index) => (
                <motion.div
                  key={amenity.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="bg-gradient-to-r from-primary to-secondary p-3 rounded-lg flex-shrink-0">
                    <amenity.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">{amenity.title}</h3>
                    <p className="text-gray-600 text-sm">{amenity.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Call to Action Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-primary to-secondary rounded-lg p-12 text-center text-white"
          >
            <h2 className="text-4xl font-sans font-bold mb-4">
              Ready to Book Your Stay?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Experience the perfect blend of comfort and luxury at Lemach Hotel
            </p>
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors text-lg"
            >
              Book Your Room Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
