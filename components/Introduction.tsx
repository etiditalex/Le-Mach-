"use client";

import { motion } from "framer-motion";

export default function Introduction() {
  return (
    <section className="bg-[#FDFBF8] py-10 sm:py-14 md:py-24">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Small intro line */}
          <p className="text-xs sm:text-sm md:text-base uppercase tracking-widest text-gray-500 mb-2 font-sans">
            Welcome to
          </p>
          {/* Main Heading */}
          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-3 sm:mb-4 font-sans text-balance leading-tight">
            Lemach Hotel & Accommodations
          </h2>

          {/* Decorative Line */}
          <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-4 sm:mb-6"></div>

          {/* Short intro paragraph */}
          <p className="text-gray-600 text-base sm:text-lg md:text-xl leading-relaxed font-sans max-w-3xl mx-auto px-1">
            Welcome to Lemach Hotel & Accommodations, where comfort and authentic Kenyan hospitality meet in the heart of Kilifi County. Explore our rooms, dining, and events for an unforgettable stay.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
