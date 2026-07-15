"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    id: 1,
    question: "What are the check-in and check-out times?",
    answer: "Check-in time is from 2:00 PM onwards, and check-out time is before 11:00 AM. Early check-in and late check-out may be available upon request, subject to availability and additional charges.",
  },
  {
    id: 2,
    question: "Do you offer airport transfer services?",
    answer: "Yes, we provide airport transfer services from Moi International Airport. The airport is approximately 21 km away from our hotel. Please contact us in advance to arrange your transfer, and we'll be happy to assist you.",
  },
  {
    id: 3,
    question: "What amenities are included in the rooms?",
    answer: "All our rooms include free WiFi, air conditioning, private bathrooms with hot water, smart TVs, and modern furnishings. Some rooms also feature private balconies with stunning views of Kilifi County.",
  },
  {
    id: 4,
    question: "Is parking available at the hotel?",
    answer: "Yes, we provide complimentary parking for all our guests. The parking area is secure and easily accessible from the hotel entrance.",
  },
  {
    id: 5,
    question: "Do you have facilities for events and meetings?",
    answer: "Absolutely! We have professional meeting and event spaces suitable for conferences, corporate meetings, celebrations, and special occasions. Our team can assist with event planning and catering services.",
  },
  {
    id: 6,
    question: "What dining options are available?",
    answer: "We have a restaurant and bar offering both local and international cuisine. Our restaurant serves breakfast, lunch, and dinner. Room service is also available 24/7 for your convenience.",
  },
  {
    id: 7,
    question: "Is the hotel suitable for families with children?",
    answer: "Yes, Le Mach Hotel is family-friendly. We have family suites available, and children are welcome. Our facilities include a swimming pool and various activities suitable for families.",
  },
  {
    id: 8,
    question: "What is your cancellation policy?",
    answer: "We offer free cancellation up to 24 hours before your scheduled check-in time. Cancellations made within 24 hours may be subject to charges. Please refer to your booking confirmation for specific terms.",
  },
];

export default function FAQs() {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="bg-white py-10 sm:py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-3 sm:mb-4 font-sans text-balance leading-tight">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-4 sm:mb-6"></div>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto font-sans px-1">
            Find answers to common questions about Le Mach Hotel & Accommodations
          </p>
        </motion.div>

        {/* FAQs List */}
        <div className="max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3) }}
              className="mb-3 sm:mb-4"
            >
              <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                {/* Question */}
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full min-h-[52px] px-4 sm:px-6 py-4 sm:py-5 text-left flex items-center justify-between hover:bg-gray-100 transition-colors"
                >
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 font-sans pr-3 sm:pr-4">
                    {faq.question}
                  </h3>
                  <ChevronDown
                    className={`w-5 h-5 text-primary flex-shrink-0 transition-transform duration-300 ${
                      openId === faq.id ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Answer */}
                <AnimatePresence>
                  {openId === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 sm:px-6 py-4 sm:py-5 border-t border-gray-200">
                        <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-sans">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mt-8 sm:mt-12"
        >
          <p className="text-gray-600 mb-4 font-sans text-sm sm:text-base">
            Still have questions? We're here to help!
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center min-h-[44px] bg-logo text-primary px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition-all duration-300 font-sans shadow-md"
          >
            Contact Us
          </a>
        </motion.div>
      </div>
    </section>
  );
}

