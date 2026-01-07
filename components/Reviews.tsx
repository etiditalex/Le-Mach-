"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const reviews = [
  {
    id: 1,
    rating: 5,
    title: "Exceptional",
    text: "We had an amazing two-night stay as a couple, and everything was just perfect! From the warm welcome at check-in to the beautiful room, every detail exceeded our expectations.",
    author: "Abdullahi",
    location: "Somalia",
  },
  {
    id: 2,
    rating: 5,
    title: "Fantastic Beachfront Stay at Le Mach - Highly Recommend",
    text: "I had a fantastic stay at Le Mach Hotel in Kilifi! The hotel's location is amazing, and everything from the rooms to the facilities is so well-kept. The staff was incredibly friendly and helpful throughout my stay.",
    author: "Ryan T",
    location: "Nairobi, Kenya",
  },
  {
    id: 3,
    rating: 5,
    title: "Excellent Service",
    text: "I had the pleasure of staying at Le Mach Hotel & Accommodations, and it truly exceeded all my expectations. From the moment I arrived, the staff greeted me with warm hospitality, making me feel right at home.",
    author: "Sarah M",
    location: "Mombasa, Kenya",
  },
];

export default function Reviews() {
  return (
    <section className="bg-gray-100 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-lg p-6 md:p-8 shadow-md hover:shadow-lg transition-shadow"
            >
              {/* Rating Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-accent text-accent"
                  />
                ))}
              </div>

              {/* Quotation Mark */}
              <div className="mb-4">
                <Quote className="w-12 h-12 text-gray-300" />
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-4 font-sans">
                {review.title}
              </h3>

              {/* Review Text */}
              <p className="text-gray-700 leading-relaxed mb-4 font-sans">
                {review.text}
              </p>

              {/* Read More Link */}
              <a
                href="#"
                className="text-primary font-semibold hover:text-secondary transition-colors font-sans inline-block mb-6"
              >
                Read More
              </a>

              {/* Separator Line */}
              <div className="border-t border-gray-200 my-6"></div>

              {/* Reviewer Info */}
              <div className="text-sm text-gray-600 font-sans">
                <p className="font-semibold text-gray-900">{review.author}</p>
                <p>{review.location}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

