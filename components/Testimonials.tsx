"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "Amazing experience! The staff was incredibly friendly and the facilities were top-notch.",
    author: "Sarah Johnson",
    role: "Business Traveler",
  },
  {
    quote: "Perfect venue for our corporate meeting. Professional service and excellent amenities.",
    author: "Michael Chen",
    role: "Corporate Client",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-gradient-to-r from-primary/10 to-secondary/10">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-serif font-bold text-center mb-12 text-primary"
        >
          What Our Guests Say
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-8 rounded-lg shadow-md"
            >
              <p className="text-gray-700 mb-6 italic text-lg">"{testimonial.quote}"</p>
              <div>
                <h4 className="font-semibold text-gray-800">{testimonial.author}</h4>
                <p className="text-gray-500 text-sm">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

