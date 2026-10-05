"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Award, Play, X } from "lucide-react";

const cld = (src: string) =>
  src.replace("/image/upload/", "/image/upload/f_auto,q_auto,w_1600/");

const HOTEL_IMAGE = cld(
  "https://res.cloudinary.com/dyfnobo9r/image/upload/v1773406693/LEMACHGARDENS136of562_u52vrl.jpg"
);

const tourFrames = [
  {
    src: HOTEL_IMAGE,
    alt: "Lemach Hotel exterior with palms and courtyard in Kilifi County",
  },
  {
    src: cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1756012069/images_11_zaumgq.jpg"),
    alt: "Lemach Hotel swimming pool with the Le Mach name",
  },
  {
    src: cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773406693/LEMACHGARDENS167of562_jtecbr.jpg"),
    alt: "Lemach Hotel bar and restaurant",
  },
  {
    src: cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773405758/LEMACHGARDENS272of562_oerxub.jpg"),
    alt: "A guest room at Lemach Hotel",
  },
  {
    src: cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773406340/LEMACHGARDENS99of562_d80jsm.jpg"),
    alt: "Conference space at Lemach Hotel",
  },
];

export default function AboutTheHotel() {
  const [videoOpen, setVideoOpen] = useState(false);
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!videoOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setVideoOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setInterval(() => {
      setFrame((current) => (current + 1) % tourFrames.length);
    }, 3200);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
      window.clearInterval(timer);
    };
  }, [videoOpen]);

  return (
    <section id="about-the-hotel" className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-stretch lg:gap-14 xl:gap-16">
          <div className="max-w-xl">
            <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.28em] text-[#C99700] sm:text-xs">
              About the hotel
            </p>

            <h2 className="font-serif leading-[1.05] text-[#1C2430]">
              <span className="block text-[2.35rem] font-medium sm:text-5xl lg:text-[3.35rem]">
                A legacy of
              </span>
              <span className="mt-1 block text-[2.55rem] font-medium italic text-primary sm:text-[3.15rem] lg:text-[3.65rem]">
                Kilifi hospitality
              </span>
            </h2>

            <div className="mt-7 space-y-4 text-[15px] leading-[1.75] text-[#3A3A3A] sm:text-base">
              <p>
                Founded in 2010 just off the scenic B69 Highway, Lemach Hotel &amp;
                Accommodations has been welcoming guests to Kilifi County with comfort,
                gardens, and genuine Kenyan hospitality.
              </p>
              <p>
                With well-appointed rooms, a bar and restaurant, conference spaces, and a
                swimming pool, Lemach offers an easy blend of rest, dining, and
                celebration. Whether you&apos;re here for a quiet stay, a business meeting,
                or a family gathering — you&apos;re in exactly the right place.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setFrame(0);
                setVideoOpen(true);
              }}
              className="mt-8 inline-flex items-center gap-2.5 border border-[#1C2430] px-5 py-3 text-[12px] font-medium uppercase tracking-[0.18em] text-[#1C2430] transition-colors hover:border-primary hover:bg-primary hover:text-white"
            >
              <Play className="h-3 w-3 fill-current" aria-hidden />
              Watch hotel video
            </button>

            <div className="mt-8 flex items-center gap-3 bg-logo px-4 py-3.5 text-primary-dark">
              <Award className="h-5 w-5 shrink-0 text-primary" aria-hidden />
              <p className="text-sm font-medium leading-snug sm:text-[15px]">
                Best Hotel in Kilifi County — Tourism Excellence
              </p>
            </div>
          </div>

          <div className="relative aspect-[5/4] w-full overflow-hidden sm:aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[520px]">
            <Image
              src={HOTEL_IMAGE}
              alt="Lemach Hotel exterior with palms and courtyard in Kilifi County"
              fill
              sizes="(min-width: 1024px) 52vw, 100vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </div>

      {videoOpen ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/75 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Lemach Hotel video"
          onClick={() => setVideoOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setVideoOpen(false)}
              className="absolute -top-11 right-0 inline-flex items-center gap-1.5 text-sm font-medium uppercase tracking-wider text-white"
              aria-label="Close video"
            >
              Close
              <X className="h-4 w-4" />
            </button>
            <div className="relative aspect-video w-full overflow-hidden bg-black shadow-2xl">
              {tourFrames.map((item, index) => (
                <Image
                  key={item.src}
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 1024px) 896px, 100vw"
                  className={`object-cover transition-opacity duration-700 ${
                    index === frame ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
              <p className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/70 to-transparent px-4 py-3 text-sm font-medium text-white">
                Lemach Hotel, Kilifi County
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
