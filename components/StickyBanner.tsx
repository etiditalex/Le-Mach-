"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Calendar, Phone } from "lucide-react";
import Link from "next/link";

export default function StickyBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if banner was dismissed
    if (typeof window !== "undefined") {
      const dismissed = localStorage.getItem("stickyBannerDismissed");
      if (dismissed === "true") {
        setIsDismissed(true);
        setIsVisible(false);
      } else {
        // Show banner after page loads
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("stickyBannerDismissed", "true");
    }
  };

  if (isDismissed) return null;

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="sticky top-16 left-0 right-0 z-[60] shadow-xl -mt-1"
    >
      <div className="bg-gradient-to-r from-primary via-secondary to-primary text-white py-3 px-4 border-b-2 border-accent/30">
        <div className="container mx-auto flex items-center justify-between gap-4">
          {/* Left side - Icon and message */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex-shrink-0">
              <Sparkles className="w-5 h-5 text-accent animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm md:text-base font-medium">
                <span className="font-bold text-accent">✨ Special Offer:</span> Book your stay at Le Mach Hotel and enjoy{" "}
                <span className="text-accent font-bold">15% off</span> on all room bookings this season!{" "}
                <span className="hidden lg:inline">Experience luxury in the heart of Kilifi County.</span>
              </p>
            </div>
          </div>

          {/* Right side - CTA buttons */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              href="/booking"
              className="hidden sm:flex items-center gap-2 bg-white text-primary px-4 py-2 rounded-lg font-semibold hover:bg-accent hover:text-white transition-all duration-200 whitespace-nowrap shadow-md hover:shadow-lg"
            >
              <Calendar className="w-4 h-4" />
              Book Now
            </Link>
            <Link
              href="/contact"
              className="hidden md:flex items-center gap-2 border-2 border-white/80 text-white px-4 py-2 rounded-lg font-semibold hover:bg-white hover:text-primary transition-all duration-200 whitespace-nowrap"
            >
              <Phone className="w-4 h-4" />
              Contact
            </Link>
            <button
              onClick={handleDismiss}
              className="text-white hover:text-accent transition-colors p-1 flex-shrink-0 hover:bg-white/10 rounded-full"
              aria-label="Dismiss banner"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

