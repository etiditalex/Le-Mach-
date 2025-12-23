"use client";

import { motion } from "framer-motion";
import { Bed, Utensils, Users, Waves } from "lucide-react";

const services = [
  {
    icon: Bed,
    title: "Accommodations",
    description: "Luxurious rooms and suites designed for your comfort and relaxation.",
  },
  {
    icon: Utensils,
    title: "Bar & Restaurant",
    description: "Exquisite dining experience with local and international cuisine.",
  },
  {
    icon: Users,
    title: "Conference Room",
    description: "Professional meeting spaces for corporate events and gatherings.",
  },
  {
    icon: Waves,
    title: "Activities",
    description: "Swimming, birthday celebrations, and various entertainment options.",
  },
];

export default function Services() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-serif font-bold text-center mb-12 text-primary"
        >
          Our Services
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow"
            >
              <div className="bg-gradient-to-r from-primary to-secondary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <service.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

