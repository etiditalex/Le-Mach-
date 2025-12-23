"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const offers = [
  {
    title: "Weekend Getaway",
    description: "Enjoy 20% off on weekend stays with complimentary breakfast.",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1756014494/IMG_2944_cvtn8r.jpg",
    link: "/deals",
  },
  {
    title: "Corporate Package",
    description: "Special rates for corporate meetings and conference bookings.",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1756014494/IMG_2948_kzpa8s.jpg",
    link: "/deals",
  },
];

export default function Offers() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-serif font-bold text-center mb-12 text-primary"
        >
          Special Deals
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {offers.map((offer, index) => (
            <motion.div
              key={offer.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative h-64">
                <Image
                  src={offer.image}
                  alt={offer.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-serif font-bold mb-2 text-gray-800">{offer.title}</h3>
                <p className="text-gray-600 mb-4">{offer.description}</p>
                <Link
                  href={offer.link}
                  className="inline-block bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-shadow"
                >
                  View Deal
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

