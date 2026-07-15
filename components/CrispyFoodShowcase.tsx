"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

/** High-res Cloudinary delivery — fit full plate in frame, no aggressive crop */
const cld = (src: string) =>
  src.replace(
    "/image/upload/",
    "/image/upload/f_auto,q_auto:best,w_1400,c_fit,b_rgb:ffffff/"
  );

const leftImage = {
  src: cld(
    "https://res.cloudinary.com/dyfnobo9r/image/upload/v1784096510/WhatsApp_Image_2026-07-11_at_23.25.15_qigvra.jpg"
  ),
  alt: "Crispy chicken platter with golden potato rounds at Lemach Hotel",
};

const rightImage = {
  src: cld(
    "https://res.cloudinary.com/dyfnobo9r/image/upload/v1783941369/WhatsApp_Image_2026-07-11_at_23.25.17_1_liwd9z.jpg"
  ),
  alt: "Crispy fried plantains with savoury meat at Lemach Hotel",
};

function PlateImage({
  src,
  alt,
  className,
  delay = 0,
  from,
}: {
  src: string;
  alt: string;
  className?: string;
  delay?: number;
  from: "left" | "right";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: from === "left" ? -24 : 24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay }}
      className={`relative aspect-[4/5] sm:aspect-square md:aspect-auto md:h-full min-h-0 overflow-hidden bg-[#FDFBF8] ${className ?? ""}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        quality={95}
        className="object-contain object-center p-1.5 sm:p-2 md:p-3"
        sizes="(max-width: 768px) 50vw, 33vw"
        priority
      />
    </motion.div>
  );
}

export default function CrispyFoodShowcase() {
  return (
    <section className="bg-white py-8 sm:py-10 md:py-14">
      <div className="container mx-auto px-4 sm:px-5 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 md:gap-6 max-w-7xl mx-auto md:items-stretch">
          {/* On mobile: description first, then both plates side-by-side */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center px-1 sm:px-2 md:px-4 py-2 sm:py-4 md:py-8 order-1 md:order-2 h-full"
          >
            <div className="max-w-md w-full text-center">
              <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6 font-sans text-balance leading-snug">
                Crispy Favourites, Fresh Off the Plate
              </h3>
              <p className="text-gray-900 text-sm sm:text-base md:text-lg leading-relaxed mb-4 sm:mb-5 md:mb-6 font-sans">
                From golden, crunchy potato rounds with tender chicken to caramelised fried plantains
                layered with savoury meat and cool tomato — every plate is about that satisfying
                crisp outside and rich flavour within. Taste the crunch that keeps guests coming back
                to Lemach.
              </p>
              <Link
                href="/menu"
                className="inline-flex items-center justify-center min-h-[44px] px-1 text-primary underline font-semibold text-base sm:text-lg hover:text-secondary transition-colors font-sans"
              >
                View our menu
              </Link>
            </div>
          </motion.div>

          <div className="order-2 md:contents grid grid-cols-2 gap-3 sm:gap-4">
            <PlateImage
              src={leftImage.src}
              alt={leftImage.alt}
              className="md:order-1"
              from="left"
            />
            <PlateImage
              src={rightImage.src}
              alt={rightImage.alt}
              className="md:order-3"
              from="right"
              delay={0.1}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
