import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";

const cld = (src: string) =>
  src.replace("/image/upload/", "/image/upload/f_auto,q_auto,w_1400/");

const venues = [
  {
    href: "/menu",
    label: "Restaurant",
    name: "Lemach Restaurant",
    description:
      "Local and international cuisine in a warm dining room. Fresh plates for breakfast, lunch, and dinner.",
    service: "Breakfast · Lunch · Dinner",
    image: cld(
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1773406693/LEMACHGARDENS167of562_jtecbr.jpg"
    ),
    alt: "Lemach Hotel restaurant dining room",
  },
  {
    href: "/bar-restaurant",
    label: "Bar",
    name: "The Bar",
    description:
      "Beers, wine, and spirits, served indoors and on the patio. Ask the team for today’s list and specials.",
    service: "Beers · Wine · Spirits",
    image: cld(
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1773406091/LEMACHGARDENS190of562_sdatzg.jpg"
    ),
    alt: "Lemach Hotel bar and outdoor seating",
  },
];

export default function DiningVenues() {
  return (
    <section id="dining" className="bg-[#F6F3EE] py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#C99700] sm:text-xs">
              Restaurant &amp; Bar
            </p>
            <h2 className="mt-4 font-serif leading-[1.05] text-[#1C2430]">
              <span className="block text-[2.5rem] font-medium sm:text-5xl lg:text-[3.35rem]">
                The restaurant,
              </span>
              <span className="mt-1 block text-[2.6rem] font-medium italic text-primary sm:text-[3.1rem] lg:text-[3.5rem]">
                and the bar
              </span>
            </h2>
            <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-[#6B6B6B] sm:text-base">
              From breakfast through dinner, and drinks at the bar, Lemach serves local and
              international flavour in the heart of Kilifi.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:mt-14 md:grid-cols-2 md:gap-8">
            {venues.map((venue) => (
              <Link
                key={venue.name}
                href={venue.href}
                className="group flex flex-col bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={venue.image}
                    alt={venue.alt}
                    fill
                    sizes="(min-width: 768px) 46vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex flex-1 flex-col px-6 py-6 sm:px-7 sm:py-7">
                  <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#C99700]">
                    {venue.label}
                  </p>
                  <h3 className="mt-2 font-serif text-[1.75rem] font-medium leading-tight text-primary">
                    {venue.name}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#5C5C5C] sm:text-[15px]">
                    {venue.description}
                  </p>
                  <p className="mt-5 flex items-center gap-2 text-sm font-medium text-primary">
                    <Clock className="h-4 w-4 shrink-0" aria-hidden />
                    {venue.service}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
