"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const slides = [
  {
    id: 1,
    title: "Welcome to Lemach Hotel",
    description: "Experience luxury and comfort in the heart of Kilifi County",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1756014496/IMG_20250710_182533_vsppzh.jpg",
    buttonText: "Book Now",
    buttonLink: "/booking",
  },
  {
    id: 2,
    title: "Luxurious Accommodations",
    description: "Elegant rooms and suites designed for your ultimate comfort",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1756014494/IMG_2944_cvtn8r.jpg",
    buttonText: "View Rooms",
    buttonLink: "/rooms",
  },
  {
    id: 3,
    title: "Exquisite Dining Experience",
    description: "Savor local and international cuisine in our restaurant",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1756014494/IMG_2948_kzpa8s.jpg",
    buttonText: "View Menu",
    buttonLink: "/menu",
  },
  {
    id: 4,
    title: "Perfect Venue for Events",
    description: "Host your conferences, meetings, and celebrations in our professional facilities",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1756014498/IMG_2958_dsuafs.jpg",
    buttonText: "Plan Event",
    buttonLink: "/meetings-events",
  },
  {
    id: 5,
    title: "Relaxation & Recreation",
    description: "Unwind by our swimming pool and enjoy various leisure activities",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1756014497/IMG_2954_y59iig.jpg",
    buttonText: "Learn More",
    buttonLink: "/about",
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative h-screen mt-16 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
          >
            <div className="absolute inset-0 bg-black/40" />
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="relative h-full flex items-center justify-center">
        <div className="container mx-auto px-4 text-center text-white">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl md:text-7xl font-serif font-bold mb-4">
                {slides[currentSlide].title}
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
                {slides[currentSlide].description}
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  href={slides[currentSlide].buttonLink}
                  className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-shadow"
                >
                  {slides[currentSlide].buttonText}
                </Link>
                <Link
                  href="/contact"
                  className="bg-white/20 backdrop-blur-sm text-white px-8 py-3 rounded-full font-semibold hover:bg-white/30 transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide ? "w-8 bg-white" : "w-2 bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

