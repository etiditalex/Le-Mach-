import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const cld = (src: string) =>
  src.replace("/image/upload/", "/image/upload/f_auto,q_auto,w_1400/");

const photos = [
  {
    src: cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1756012069/images_11_zaumgq.jpg"),
    alt: "Lemach Hotel swimming pool",
    className: "sm:col-span-2 lg:col-span-4 aspect-[16/10] lg:aspect-[16/9]",
  },
  {
    src: cld(
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1773406091/LEMACHGARDENS190of562_sdatzg.jpg"
    ),
    alt: "Outdoor seating at Lemach Hotel",
    className: "lg:col-span-2 aspect-[16/10] lg:aspect-auto lg:h-full",
  },
  {
    src: cld(
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1773837495/LEMACHGARDENS7of562_cohiqd.jpg"
    ),
    alt: "Standard room at Lemach Hotel",
    className: "lg:col-span-2 aspect-[4/3]",
  },
  {
    src: cld(
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1773406693/LEMACHGARDENS136of562_u52vrl.jpg"
    ),
    alt: "Lemach Hotel exterior and palms",
    className: "lg:col-span-2 aspect-[4/3]",
  },
  {
    src: cld(
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1773405758/LEMACHGARDENS272of562_oerxub.jpg"
    ),
    alt: "Deluxe room at Lemach Hotel",
    className: "lg:col-span-2 aspect-[4/3]",
  },
  {
    src: cld(
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1790422520/lemach_food_landscape_1-150kb_k9vmzh.jpg"
    ),
    alt: "A plated meal at Lemach Hotel",
    className: "lg:col-span-2 aspect-[4/3]",
  },
  {
    src: cld(
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1773839988/LEMACHGARDENS301of562_w5lzhz.jpg"
    ),
    alt: "Family suite at Lemach Hotel",
    className: "lg:col-span-2 aspect-[4/3]",
  },
];

function PhotoTile({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className: string;
}) {
  return (
    <Link href="/gallery" className={`group relative block overflow-hidden bg-[#F6F3EE] ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 40vw, 100vw"
        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      />
    </Link>
  );
}

export default function GalleryGlimpse() {
  return (
    <section id="gallery-glimpse" className="bg-white pt-16 sm:pt-20 lg:pt-24">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#C99700] sm:text-xs">
            Gallery
          </p>
          <h2 className="mt-4 font-serif leading-[1.05] text-[#1C2430]">
            <span className="block text-[2.5rem] font-medium sm:text-5xl lg:text-[3.35rem]">
              A glimpse of
            </span>
            <span className="mt-1 block text-[2.6rem] font-medium italic text-primary sm:text-[3.1rem] lg:text-[3.5rem]">
              Lemach
            </span>
          </h2>
        </div>
      </div>

      <div className="mt-12 grid w-full grid-cols-1 gap-1 sm:grid-cols-2 sm:gap-1.5 lg:grid-cols-6">
        {photos.map((photo) => (
          <PhotoTile key={photo.src} {...photo} />
        ))}
        <Link
          href="/gallery"
          className="flex aspect-[4/3] flex-col items-center justify-center gap-4 bg-primary text-white transition-colors hover:bg-primary-dark lg:col-span-2"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/80">
            <ArrowRight className="h-5 w-5" aria-hidden />
          </span>
          <span className="text-[12px] font-medium uppercase tracking-[0.2em]">
            View full gallery
          </span>
        </Link>
      </div>
    </section>
  );
}
