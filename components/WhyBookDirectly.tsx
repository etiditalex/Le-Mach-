"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

type Props = {
  ctaHref?: string;
  ctaText?: string;
};

export default function WhyBookDirectly({ ctaHref = "/booking", ctaText = "Book Directly" }: Props) {
  return (
    <section className="bg-primary text-white">
      <div className="relative overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/90 to-secondary/90" />
        <div
          className="absolute inset-0 opacity-20 mix-blend-overlay"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.08), rgba(255,255,255,0.02)), url(https://res.cloudinary.com/dyfnobo9r/image/upload/f_auto,q_auto,w_1600/v1773839990/LEMACHGARDENS333of562_kjjury.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="relative container mx-auto px-4 md:px-6 lg:px-8">
          <div className="py-12 md:py-14 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-8"
              >
                <h2 className="text-3xl md:text-4xl font-sans font-bold mb-2">
                  Why Book Directly
                </h2>
                <p className="text-white/90 text-base md:text-lg mb-6 max-w-3xl">
                  You will be guaranteed our exclusive offers and the best service with a personal touch by booking us directly online.
                </p>

                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-white/95">
                  {[
                    "Guaranteed lowest rate",
                    "No additional booking fees",
                    "Safe booking",
                    "Complimentary perks",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center bg-white/15 border border-white/25">
                        <Check className="h-4 w-4 text-logo" />
                      </span>
                      <span className="font-sans">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 }}
                className="lg:col-span-4 flex lg:justify-end"
              >
                <Link
                  href={ctaHref}
                  className="inline-flex items-center justify-center bg-logo text-primary px-8 py-4 font-semibold tracking-wide uppercase shadow-lg hover:shadow-xl hover:bg-white transition-all"
                >
                  {ctaText}
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

