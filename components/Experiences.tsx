import Image from "next/image";
import Link from "next/link";
import { Droplet, Trees, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const cld = (src: string) =>
  src.replace("/image/upload/", "/image/upload/f_auto,q_auto,w_1200/");

const experiences: {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  image: string;
  alt: string;
}[] = [
  {
    href: "/gallery",
    icon: Droplet,
    title: "Swimming Pool",
    description:
      "Relax by the Lemach pool, set among the grounds, a favourite spot for guests and families in Kilifi.",
    image: cld(
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1756012069/images_11_zaumgq.jpg"
    ),
    alt: "Lemach Hotel swimming pool",
  },
  {
    href: "/gallery",
    icon: Trees,
    title: "Gardens",
    description:
      "Palm-lined grounds and open-air seating around the hotel, a calm place to sit between the pool and your room.",
    image: cld(
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1773406693/LEMACHGARDENS136of562_u52vrl.jpg"
    ),
    alt: "Lemach Hotel gardens and exterior",
  },
  {
    href: "/meetings-events",
    icon: Users,
    title: "Meetings & Celebrations",
    description:
      "Conference rooms for business, plus space for birthdays and family gatherings, with catering when you need it.",
    image: cld(
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1773406340/LEMACHGARDENS99of562_d80jsm.jpg"
    ),
    alt: "Lemach Hotel conference room",
  },
];

export default function Experiences() {
  return (
    <section id="experiences" className="bg-[#F6F3EE] py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#C99700] sm:text-xs">
              Activities &amp; Experiences
            </p>
            <h2 className="mt-4 font-serif leading-[1.05] text-[#1C2430]">
              <span className="block text-[2.5rem] font-medium sm:text-5xl lg:text-[3.35rem]">
                More than
              </span>
              <span className="mt-1 block text-[2.6rem] font-medium italic text-primary sm:text-[3.1rem] lg:text-[3.5rem]">
                a quiet stay
              </span>
            </h2>
            <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-[#6B6B6B] sm:text-base">
              From the swimming pool and gardens to meetings, birthdays, and celebrations,
              there is always something to enjoy at Lemach.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:mt-14 lg:grid-cols-3 lg:gap-7">
            {experiences.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group flex flex-col bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-[16/11] w-full overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex flex-1 flex-col px-6 py-6 sm:px-7">
                  <item.icon className="h-5 w-5 text-primary" aria-hidden />
                  <h3 className="mt-3 font-serif text-[1.45rem] font-medium leading-tight text-primary">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#5C5C5C]">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
