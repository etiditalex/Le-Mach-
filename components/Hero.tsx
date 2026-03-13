"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const slides = [
  { id: 1, image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1773406340/LEMACHGARDENS99of562_d80jsm.jpg" },
  { id: 2, image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1773406693/LEMACHGARDENS167of562_jtecbr.jpg" },
  { id: 3, image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1773406091/LEMACHGARDENS190of562_sdatzg.jpg" },
  { id: 4, image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1773405758/LEMACHGARDENS272of562_oerxub.jpg" },
  { id: 5, image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1773406693/LEMACHGARDENS12of562_ddnbmc.jpg" },
  { id: 6, image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1773406693/LEMACHGARDENS136of562_u52vrl.jpg" },
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
    <section className="relative min-h-[70vh] sm:min-h-[85vh] md:h-screen mt-16 overflow-hidden">
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

      {/* Overlay: bottom-left corner on all screen sizes (mobile + desktop) */}
      <div className="relative h-full flex items-end justify-start">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 pb-16 sm:pb-20 md:pb-28 text-white w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex flex-col gap-3 sm:gap-4 items-start text-left"
            >
              <div className="flex flex-col items-start">
                <span className="text-lg sm:text-xl md:text-2xl font-medium tracking-wide text-logo drop-shadow-md">
                  Lemach
                </span>
                <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans font-bold tracking-tight text-logo drop-shadow-md">
                  Hotels
                </span>
              </div>
              <motion.div
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.45, delay: 0.15, ease: "easeOut" }}
                className="pl-1 md:pl-2"
              >
                <Link
                  href="/booking"
                  className="inline-block bg-logo text-primary font-semibold uppercase tracking-wider text-sm sm:text-base px-5 py-2.5 sm:px-8 sm:py-3 border border-white/40 shadow-lg rounded-none"
                >
                  Book Now
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-2 sm:p-3 rounded-full hover:bg-white/30 transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-2 sm:p-3 rounded-full hover:bg-white/30 transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
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

