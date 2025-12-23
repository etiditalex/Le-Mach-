"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Bed, Users, Wifi, Wind, Tv, Coffee, Droplet, Bell, ArrowLeft, Check, MapPin, Clock } from "lucide-react";
import Image from "next/image";

const rooms = {
  standard: {
    id: "standard",
    name: "Standard Room",
    price: 8500,
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
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1756014481/IMG_2936_sgngqe.jpg",
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1756014487/IMG_2937_idnyhf.jpg",
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1756014488/IMG_2938_ahm3zz.jpg",
    ],
    size: "25 sqm",
    view: "Garden View",
  },
  deluxe: {
    id: "deluxe",
    name: "Deluxe Room",
    price: 12000,
    description: "Spacious and elegant, our deluxe rooms feature premium furnishings and stunning views of Kilifi County.",
    longDescription: "Experience elevated comfort in our Deluxe Rooms, featuring spacious layouts and elegant design. These rooms offer stunning views of Kilifi County from your private balcony, premium furnishings, and enhanced amenities. Perfect for those seeking a more luxurious stay with additional space and comfort.",
    features: [
      { icon: Bed, text: "1 King Bed", description: "Premium king-size bed with luxury linens" },
      { icon: Users, text: "2 Guests", description: "Accommodates up to 2 guests" },
      { icon: Droplet, text: "En-suite Bathroom", description: "Spacious bathroom with modern amenities" },
      { icon: Wind, text: "Balcony View", description: "Private balcony with stunning views" },
      { icon: Tv, text: "Smart TV", description: "Large screen with streaming services" },
      { icon: Coffee, text: "Coffee Maker", description: "In-room coffee and tea facilities" },
    ],
    images: [
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1756014481/IMG_2926_nzrxnh.jpg",
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1756014489/IMG_2942_oawe9y.jpg",
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1756014505/IMG_2947_u6egrt.jpg",
    ],
    size: "35 sqm",
    view: "County View",
  },
  family: {
    id: "family",
    name: "Family Suite",
    price: 18000,
    description: "Perfect for families, our spacious suite includes separate living area and multiple bedrooms.",
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
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1756014478/IMG_2925_ah7764.jpg",
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1756014481/IMG_2926_nzrxnh.jpg",
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1756014481/IMG_2936_sgngqe.jpg",
    ],
    size: "60 sqm",
    view: "Garden & Pool View",
  },
  executive: {
    id: "executive",
    name: "Executive Suite",
    price: 25000,
    description: "Ultimate luxury with premium amenities, private balcony, and exclusive services for discerning guests.",
    longDescription: "Indulge in the ultimate luxury experience in our Executive Suite. This premium accommodation features the finest furnishings, a private jacuzzi, butler service, and exclusive amenities. Perfect for special occasions, business travelers, or those seeking the very best in hospitality.",
    features: [
      { icon: Bed, text: "King Bed", description: "Premium king-size bed with luxury linens" },
      { icon: Users, text: "2 Guests", description: "Accommodates up to 2 guests" },
      { icon: Bell, text: "Butler Service", description: "Dedicated butler for personalized service" },
      { icon: Droplet, text: "Jacuzzi", description: "Private jacuzzi in the bathroom" },
      { icon: Wind, text: "Private Balcony", description: "Spacious balcony with premium views" },
      { icon: Coffee, text: "Premium Minibar", description: "Fully stocked premium minibar" },
    ],
    images: [
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1756014472/IMG_2921_ces2aj.jpg",
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1756014505/IMG_2947_u6egrt.jpg",
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1756014501/IMG_2941_t3rved.jpg",
    ],
    size: "80 sqm",
    view: "Panoramic County View",
  },
};

export default function RoomDetailPage() {
  const params = useParams();
  const roomId = params.roomId as string;
  const room = rooms[roomId as keyof typeof rooms];

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
            <h1 className="text-5xl font-serif font-bold text-primary mb-4">{room.name}</h1>
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
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
          >
            {room.images.map((image, index) => (
              <div key={index} className="relative h-64 rounded-lg overflow-hidden">
                <Image
                  src={image}
                  alt={`${room.name} - Image ${index + 1}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
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
                <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">About This Room</h2>
                <p className="text-gray-600 leading-relaxed">{room.longDescription}</p>
              </motion.div>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h2 className="text-2xl font-serif font-bold text-gray-800 mb-6">Room Features</h2>
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
                <h2 className="text-2xl font-serif font-bold text-gray-800 mb-6">Room Details</h2>
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
                <h2 className="text-2xl font-serif font-bold text-primary mb-6">Book This Room</h2>
                
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
                  className="w-full bg-gradient-to-r from-primary to-secondary text-white px-6 py-4 rounded-lg font-semibold hover:shadow-lg transition-shadow text-center block"
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

