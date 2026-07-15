"use client";

import { useMemo } from "react";
import Image from "next/image";
import { galleryImages } from "@/data/galleryImages";

type Props = {
  speedSeconds?: number;
};

export default function PhotoCarousel({
  speedSeconds = 55,
}: Props) {
  const images = useMemo(() => {
    // Keep ordering identical to the Gallery page.
    return galleryImages;
  }, []);

  const slides = useMemo(() => {
    // Build 2-up collage slides (left small, right big).
    const pairs: Array<{ left: (typeof images)[number]; right: (typeof images)[number] }> = [];
    for (let i = 0; i < images.length; i += 2) {
      const left = images[i];
      const right = images[i + 1] ?? images[0];
      if (left && right) pairs.push({ left, right });
    }
    return pairs;
  }, [images]);

  const loopSlides = useMemo(() => [...slides, ...slides], [slides]);

  return (
    <section className="bg-white py-10 sm:py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-sans font-bold text-primary text-balance">
            Make Le Mach your Home
          </h2>
        </div>

        <div className="relative overflow-hidden rounded-none group">
          <div
            className="flex gap-3 sm:gap-6 will-change-transform [animation:lemach-marquee_var(--lemach-speed)_linear_infinite] group-hover:[animation-play-state:paused]"
            style={{ ["--lemach-speed" as never]: `${speedSeconds}s` }}
          >
            {loopSlides.map((slide, index) => (
              <div
                key={`${slide.left.id}-${slide.right.id}-${index}`}
                className="flex-shrink-0 w-[94%] sm:w-[86%] md:w-[72%] lg:w-[60%]"
              >
                <div className="grid grid-cols-12 gap-2 sm:gap-4 h-52 sm:h-72 md:h-80 lg:h-[420px]">
                  <div className="col-span-4 relative rounded-none overflow-hidden bg-gray-100 shadow-sm">
                    <Image
                      src={slide.left.src}
                      alt={slide.left.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 40vw, (max-width: 1024px) 30vw, 22vw"
                      priority={index === 0}
                    />
                  </div>
                  <div className="col-span-8 relative rounded-none overflow-hidden bg-gray-100 shadow-sm">
                    <Image
                      src={slide.right.src}
                      alt={slide.right.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 60vw, (max-width: 1024px) 50vw, 40vw"
                      priority={index === 0}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-16 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-16 bg-gradient-to-l from-white to-transparent" />
        </div>
      </div>

      <style jsx>{`
        @keyframes lemach-marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}

