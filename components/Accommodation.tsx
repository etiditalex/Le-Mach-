import Image from "next/image";
import Link from "next/link";
import { Bed, Droplet, Leaf, Users, Utensils, Wifi, Wind } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const cld = (src: string) =>
  src.replace("/image/upload/", "/image/upload/f_auto,q_auto,w_1200/");

type Amenity = { icon: LucideIcon; label: string };

const rooms: {
  id: string;
  view: string;
  name: string;
  description: string;
  price: number;
  image: string;
  alt: string;
  amenities: Amenity[];
}[] = [
  {
    id: "standard",
    view: "Garden View",
    name: "Standard Room",
    description:
      "Comfortable rooms for couples and solo travelers, with a king bed and the essentials for a relaxing stay in Kilifi.",
    price: 4500,
    image: cld(
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1773837495/LEMACHGARDENS7of562_cohiqd.jpg"
    ),
    alt: "Standard room at Lemach Hotel with a canopy bed and smart TV",
    amenities: [
      { icon: Wind, label: "Air Conditioning" },
      { icon: Wifi, label: "Free WiFi" },
      { icon: Bed, label: "King Bed" },
      { icon: Droplet, label: "Private Bathroom" },
    ],
  },
  {
    id: "deluxe",
    view: "Garden View",
    name: "Deluxe Room",
    description:
      "A two-bedroom room with extra space for families and small groups. Offered without bed and breakfast.",
    price: 8000,
    image: cld(
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1773405758/LEMACHGARDENS272of562_oerxub.jpg"
    ),
    alt: "Deluxe room at Lemach Hotel with a king bed and seating area",
    amenities: [
      { icon: Bed, label: "2 Bedrooms" },
      { icon: Users, label: "4 Guests" },
      { icon: Wifi, label: "Free WiFi" },
      { icon: Leaf, label: "Garden View" },
    ],
  },
  {
    id: "family",
    view: "Garden & Pool View",
    name: "Family Suite",
    description:
      "A spacious suite with two bedrooms and a living area. Bed and breakfast is included for a comfortable family stay.",
    price: 10000,
    image: cld(
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1773839988/LEMACHGARDENS301of562_w5lzhz.jpg"
    ),
    alt: "Family suite bedroom at Lemach Hotel",
    amenities: [
      { icon: Bed, label: "2 Bedrooms" },
      { icon: Users, label: "4 Guests" },
      { icon: Utensils, label: "Breakfast" },
      { icon: Wifi, label: "Free WiFi" },
    ],
  },
];

export default function Accommodation() {
  return (
    <section id="accommodation" className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#C99700] sm:text-xs">
            Accommodation
          </p>
          <h2 className="mt-4 font-serif leading-[1.05] text-[#1C2430]">
            <span className="block text-[2.6rem] font-medium sm:text-5xl lg:text-[3.4rem]">
              Your home
            </span>
            <span className="mt-1 block text-[2.75rem] font-medium italic text-primary sm:text-[3.15rem] lg:text-[3.6rem]">
              in Kilifi
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-[#6B6B6B] sm:text-base">
            Every room includes free WiFi, air conditioning, a private bathroom with hot
            water, and a smart TV. Some rooms also have a private balcony with views across
            Kilifi County.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-6 md:mt-16 md:grid-cols-3 md:gap-5 lg:gap-6">
          {rooms.map((room) => (
            <article key={room.id} className="flex flex-col bg-[#F7F4EF] p-3 sm:p-3.5">
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image
                  src={room.image}
                  alt={room.alt}
                  fill
                  sizes="(min-width: 768px) 30vw, 100vw"
                  className="object-cover"
                />
              </div>

              <div className="flex flex-1 flex-col px-2 pb-2 pt-5 sm:px-3">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#C99700]">
                  {room.view}
                </p>
                <h3 className="mt-2 font-serif text-[1.65rem] font-medium leading-tight text-primary">
                  {room.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#5C5C5C]">{room.description}</p>

                <ul className="mt-5 grid grid-cols-2 gap-2">
                  {room.amenities.map((amenity) => (
                    <li
                      key={amenity.label}
                      className="flex items-center gap-1.5 border border-[#E4E0D8] bg-white px-2 py-1.5 text-[11px] text-[#4A4A4A] sm:text-xs"
                    >
                      <amenity.icon className="h-3.5 w-3.5 shrink-0 text-[#6B6B6B]" aria-hidden />
                      <span className="truncate">{amenity.label}</span>
                    </li>
                  ))}
                </ul>

                <p className="mt-auto pt-6 text-sm text-[#6B6B6B]">
                  From{" "}
                  <span className="font-semibold text-[#1C2430]">
                    KSh {room.price.toLocaleString()}
                  </span>{" "}
                  per night
                </p>

                <Link
                  href={`/booking?room=${room.id}`}
                  className="mt-4 block bg-primary py-3 text-center text-[12px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-primary-dark"
                >
                  Book Now
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
