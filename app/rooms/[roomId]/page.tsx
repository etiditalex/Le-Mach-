"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Bed, Users, Wifi, Wind, Tv, Coffee, Droplet, Bell, ArrowLeft, Check, MapPin, Clock } from "lucide-react";
import Image from "next/image";
import type { RoomRecord } from "@/lib/hotel-types";

const cld = (src: string, transform: string) => src.replace("/image/upload/", `/image/upload/${transform}/`);

/** Extra copy and galleries for legacy slugs; names/prices/descriptions/images still sync from Supabase when loaded. */
const rooms = {
  standard: {
    id: "standard",
    name: "Standard Room",
    price: 4500,
    description: "Perfect for solo travelers or couples, our standard rooms offer comfort and convenience with modern amenities.",
    longDescription: "Our Standard Rooms are thoughtfully designed to provide a comfortable and relaxing stay. Each room features a plush king-size bed, modern furnishings, and all the essential amenities you need for a pleasant stay. The room includes a private bathroom with hot water, complimentary WiFi, and a cozy atmosphere perfect for unwinding after a day of exploring Kilifi County.",
    features: [
      { icon: Bed, text: "1 King Bed", description: "Comfortable king-size bed with premium linens" },
      { icon: Users, text: "2 Guests", description: "Accommodates up to 2 guests comfortably" },
      { icon: Droplet, text: "Private Bathroom", description: "En-suite bathroom with hot water and modern fixtures" },
      { icon: Wifi, text: "Free WiFi", description: "High-speed internet access" },
      { icon: Tv, text: "Smart TV", description: "Entertainment with streaming services" },
      { icon: Wind, text: "Air Conditioning", description: "Climate control for your comfort" },
    ],
    images: [
      cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773837496/LEMACHGARDENS12of5621_d09e4v.jpg", "f_auto,q_auto,w_1200"),
      cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773837496/LEMACHGARDENS16of562_ouub2u.jpg", "f_auto,q_auto,w_1200"),
      cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773837496/LEMACHGARDENS17of562_wefrcn.jpg", "f_auto,q_auto,w_1200"),
      cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773837495/LEMACHGARDENS14of562_tkmzvc.jpg", "f_auto,q_auto,w_1200"),
      cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773837495/LEMACHGARDENS6of562_x8fn3x.jpg", "f_auto,q_auto,w_1200"),
      cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773837495/LEMACHGARDENS11of562_jh9vzn.jpg", "f_auto,q_auto,w_1200"),
      cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773837495/LEMACHGARDENS7of562_cohiqd.jpg", "f_auto,q_auto,w_1200"),
      cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773837495/LEMACHGARDENS8of562_zcckde.jpg", "f_auto,q_auto,w_1200"),
    ],
    size: "25 sqm",
    view: "Garden View",
  },
  deluxe: {
    id: "deluxe",
    name: "Deluxe Room",
    price: 8000,
    description: "Ideal for small families or groups, our 2-bedroom Deluxe Room offers extra space and comfort (without bed & breakfast).",
    longDescription:
      "Enjoy more space in our 2-bedroom Deluxe Room—perfect for families and small groups. This option is offered without bed & breakfast, while still providing the comfort and amenities you need for a relaxing stay in Kilifi County.",
    features: [
      { icon: Bed, text: "2 Bedrooms", description: "Two separate bedrooms for added comfort" },
      { icon: Users, text: "4 Guests", description: "Accommodates up to 4 guests" },
      { icon: Droplet, text: "En-suite Bathroom", description: "Private bathroom with modern fixtures" },
      { icon: Wifi, text: "Free WiFi", description: "High-speed internet access" },
      { icon: Tv, text: "Smart TV", description: "Entertainment with streaming services" },
      { icon: Wind, text: "Garden View", description: "Relaxing views of the gardens" },
    ],
    images: [
      cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773839990/LEMACHGARDENS333of562_kjjury.jpg", "f_auto,q_auto,w_1200"),
      cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773839990/LEMACHGARDENS337of562_ehegod.jpg", "f_auto,q_auto,w_1200"),
      cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773839990/LEMACHGARDENS339of562_goabil.jpg", "f_auto,q_auto,w_1200"),
      cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773839989/LEMACHGARDENS330of562_j5zdhm.jpg", "f_auto,q_auto,w_1200"),
      cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773839989/LEMACHGARDENS332of562_u2i6bj.jpg", "f_auto,q_auto,w_1200"),
      cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773839989/LEMACHGARDENS328of562_al2oim.jpg", "f_auto,q_auto,w_1200"),
      cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773839989/LEMACHGARDENS331of562_jsv5x6.jpg", "f_auto,q_auto,w_1200"),
      cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773839988/LEMACHGARDENS317of562_kplmrj.jpg", "f_auto,q_auto,w_1200"),
      cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773839989/LEMACHGARDENS319of562_fnigu4.jpg", "f_auto,q_auto,w_1200"),
      cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773839988/LEMACHGARDENS302of562_n3f4y7.jpg", "f_auto,q_auto,w_1200"),
      cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773839988/LEMACHGARDENS300of562_uhl0eq.jpg", "f_auto,q_auto,w_1200"),
      cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773839988/LEMACHGARDENS301of562_w5lzhz.jpg", "f_auto,q_auto,w_1200"),
    ],
    size: "45 sqm",
    view: "Garden View",
  },
  family: {
    id: "family",
    name: "Family Suite",
    price: 10000,
    description: "Perfect for families, our spacious suite includes bed & breakfast and plenty of room to relax.",
    longDescription: "Our Family Suite is designed with families in mind, offering ample space and comfort for everyone. The suite features two separate bedrooms, a spacious living area, and all the amenities needed for a comfortable family stay. The separate living room provides space for relaxation and family time.",
    features: [
      { icon: Bed, text: "2 Bedrooms", description: "Two separate bedrooms with comfortable beds" },
      { icon: Users, text: "4 Guests", description: "Accommodates up to 4 guests" },
      { icon: Tv, text: "Living Room", description: "Spacious living area for relaxation" },
      { icon: Tv, text: "Smart TV", description: "Entertainment for the whole family" },
      { icon: Coffee, text: "Kitchenette", description: "Basic kitchen facilities" },
      { icon: Droplet, text: "2 Bathrooms", description: "Two en-suite bathrooms" },
    ],
    images: [
      cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773839990/LEMACHGARDENS333of562_kjjury.jpg", "f_auto,q_auto,w_1200"),
      cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773839990/LEMACHGARDENS337of562_ehegod.jpg", "f_auto,q_auto,w_1200"),
      cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773839990/LEMACHGARDENS339of562_goabil.jpg", "f_auto,q_auto,w_1200"),
      cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773839989/LEMACHGARDENS330of562_j5zdhm.jpg", "f_auto,q_auto,w_1200"),
      cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773839989/LEMACHGARDENS332of562_u2i6bj.jpg", "f_auto,q_auto,w_1200"),
      cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773839989/LEMACHGARDENS328of562_al2oim.jpg", "f_auto,q_auto,w_1200"),
      cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773839989/LEMACHGARDENS331of562_jsv5x6.jpg", "f_auto,q_auto,w_1200"),
      cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773839988/LEMACHGARDENS317of562_kplmrj.jpg", "f_auto,q_auto,w_1200"),
      cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773839989/LEMACHGARDENS319of562_fnigu4.jpg", "f_auto,q_auto,w_1200"),
      cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773839988/LEMACHGARDENS302of562_n3f4y7.jpg", "f_auto,q_auto,w_1200"),
      cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773839988/LEMACHGARDENS300of562_uhl0eq.jpg", "f_auto,q_auto,w_1200"),
      cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773839988/LEMACHGARDENS301of562_w5lzhz.jpg", "f_auto,q_auto,w_1200"),
    ],
    size: "60 sqm",
    view: "Garden & Pool View",
  },
};

const fallbackFeatures = [
  { icon: Bed, text: "Comfortable bedding", description: "Quality linens for a restful stay" },
  { icon: Users, text: "Spacious layout", description: "Roomy accommodation for your group" },
  { icon: Wifi, text: "Free WiFi", description: "Stay connected throughout your visit" },
  { icon: Droplet, text: "Private bathroom", description: "Modern en-suite facilities" },
];

export default function RoomDetailPage() {
  const params = useParams();
  const roomId = params.roomId as string;
  const legacy = rooms[roomId as keyof typeof rooms];
  const [apiRoom, setApiRoom] = useState<RoomRecord | null | undefined>(undefined);
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setApiRoom(undefined);
    fetch("/api/public/rooms")
      .then(async (r) => {
        const data = (await r.json()) as { rooms?: RoomRecord[] };
        if (!r.ok) return null;
        return (data.rooms ?? []).find((x) => x.id === roomId) ?? null;
      })
      .then((found) => {
        if (!cancelled) setApiRoom(found);
      })
      .catch(() => {
        if (!cancelled) setApiRoom(null);
      });
    return () => {
      cancelled = true;
    };
  }, [roomId]);

  const room = useMemo(() => {
    if (apiRoom === undefined) return null;
    if (!apiRoom) return null;
    const legacyImages = legacy?.images ?? [];
    const images =
      legacyImages.length > 0
        ? [apiRoom.image, ...legacyImages.filter((u) => u !== apiRoom.image)]
        : [apiRoom.image];
    return {
      id: apiRoom.id,
      name: apiRoom.name,
      price: apiRoom.pricePerNight,
      description: apiRoom.description ?? "",
      longDescription: legacy?.longDescription ?? apiRoom.description ?? "",
      features: legacy?.features ?? fallbackFeatures,
      images,
      size: legacy?.size ?? "—",
      view: legacy?.view ?? "—",
    };
  }, [apiRoom, legacy]);

  const visibleImages = useMemo(() => {
    const initialCount = 3;
    if (!room) return [];
    return showAllPhotos ? room.images : room.images.slice(0, initialCount);
  }, [room, showAllPhotos]);

  if (apiRoom === undefined) {
    return (
      <main>
        <Header />
        <div className="pt-24 pb-12 min-h-screen flex items-center justify-center bg-gray-50">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </main>
    );
  }

  if (!room) {
    return (
      <main>
        <Header />
        <div className="pt-24 pb-12 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Room Not Found</h1>
            <Link href="/rooms" className="text-primary hover:underline">
              Back to Rooms
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main>
      <Header />
      <div className="pt-24 pb-12 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <Link
              href="/rooms"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Rooms
            </Link>
          </motion.div>

          {/* Room Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-5xl font-sans font-bold text-primary mb-4">{room.name}</h1>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-sm text-gray-500">From</span>
              <span className="text-4xl font-bold text-primary">
                KSh {room.price.toLocaleString()}
              </span>
              <span className="text-gray-500">per night</span>
            </div>
            <p className="text-xl text-gray-600">{room.description}</p>
          </motion.div>

          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {visibleImages.map((image, index) => (
                <div key={image} className="relative h-64 rounded-lg overflow-hidden">
                  <Image
                    src={image}
                    alt={`${room.name} - Image ${index + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>

            {room.images.length > 3 && !showAllPhotos && (
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowAllPhotos(true)}
                  className="px-6 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors"
                >
                  Show more photos
                </button>
              </div>
            )}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h2 className="text-2xl font-sans font-bold text-gray-800 mb-4">About This Room</h2>
                <p className="text-gray-600 leading-relaxed">{room.longDescription}</p>
              </motion.div>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h2 className="text-2xl font-sans font-bold text-gray-800 mb-6">Room Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {room.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <feature.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-1">{feature.text}</h3>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Room Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h2 className="text-2xl font-sans font-bold text-gray-800 mb-6">Room Details</h2>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Room Size</p>
                    <p className="text-lg font-semibold text-gray-800">{room.size}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">View</p>
                    <p className="text-lg font-semibold text-gray-800">{room.view}</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Booking Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="lg:col-span-1"
            >
              <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
                <h2 className="text-2xl font-sans font-bold text-primary mb-6">Book This Room</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 text-gray-600">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span className="text-sm">B69 Highway, Kilifi County</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Clock className="w-5 h-5 text-primary" />
                    <span className="text-sm">Check-in: 2:00 PM | Check-out: 11:00 AM</span>
                  </div>
                </div>

                <div className="border-t border-b py-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Price per night</span>
                    <span className="text-2xl font-bold text-primary">
                      KSh {room.price.toLocaleString()}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/booking?room=${room.id}`}
                  className="w-full bg-logo text-primary px-6 py-4 rounded-lg font-semibold hover:bg-primary hover:text-white transition-all shadow-md text-center block"
                >
                  Book Now
                </Link>

                <div className="mt-6 space-y-3">
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Free cancellation up to 24 hours before check-in</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Best price guarantee</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Instant confirmation</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

