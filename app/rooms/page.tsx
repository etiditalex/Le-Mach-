"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Bed, Users, Wifi, Wind, Tv, Coffee, Droplet, Bell, ArrowRight, Check } from "lucide-react";
import Image from "next/image";

const rooms = [
  {
    id: "standard",
    name: "Standard Room",
    price: 8500,
    description: "Perfect for solo travelers or couples, our standard rooms offer comfort and convenience with modern amenities.",
    features: [
      { icon: Bed, text: "1 King Bed" },
      { icon: Users, text: "2 Guests" },
      { icon: Droplet, text: "Private Bathroom" },
      { icon: Wifi, text: "Free WiFi" },
    ],
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1756014481/IMG_2936_sgngqe.jpg",
  },
  {
    id: "deluxe",
    name: "Deluxe Room",
    price: 12000,
    description: "Spacious and elegant, our deluxe rooms feature premium furnishings and stunning views of Kilifi County.",
    features: [
      { icon: Bed, text: "1 King Bed" },
      { icon: Users, text: "2 Guests" },
      { icon: Droplet, text: "En-suite Bathroom" },
      { icon: Wind, text: "Balcony View" },
    ],
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1756014481/IMG_2926_nzrxnh.jpg",
  },
  {
    id: "family",
    name: "Family Suite",
    price: 18000,
    description: "Perfect for families, our spacious suite includes separate living area and multiple bedrooms.",
    features: [
      { icon: Bed, text: "2 Bedrooms" },
      { icon: Users, text: "4 Guests" },
      { icon: Tv, text: "Living Room" },
      { icon: Tv, text: "Smart TV" },
    ],
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1756014478/IMG_2925_ah7764.jpg",
  },
  {
    id: "executive",
    name: "Executive Suite",
    price: 25000,
    description: "Ultimate luxury with premium amenities, private balcony, and exclusive services for discerning guests.",
    features: [
      { icon: Bed, text: "King Bed" },
      { icon: Users, text: "2 Guests" },
      { icon: Bell, text: "Butler Service" },
      { icon: Droplet, text: "Jacuzzi" },
    ],
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1756014472/IMG_2921_ces2aj.jpg",
  },
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
              Our Rooms & Accommodations
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience comfort and luxury in our carefully designed rooms
            </p>
          </motion.div>

          {/* Rooms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
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
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-serif font-bold text-gray-800 mb-2">
                        {room.name}
                      </h2>
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm text-gray-500">From</span>
                        <span className="text-3xl font-bold text-primary">
                          KSh {room.price.toLocaleString()}
                        </span>
                        <span className="text-gray-500">per night</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6">{room.description}</p>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {room.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-gray-700">
                        <feature.icon className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-sm">{feature.text}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <Link
                      href={`/booking?room=${room.id}`}
                      className="flex-1 bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow text-center"
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
            <h2 className="text-3xl font-serif font-bold text-primary mb-8 text-center">
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
            <h2 className="text-4xl font-serif font-bold mb-4">
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
