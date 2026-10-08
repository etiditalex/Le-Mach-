"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bed,
  Bell,
  Check,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Droplet,
  Tv,
  Users,
  Utensils,
  Wifi,
  Wind,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { RoomRecord } from "@/lib/hotel-types";

const cld = (src: string) =>
  src.replace("/image/upload/", "/image/upload/f_auto,q_auto,w_1400/");

type Amenity = { icon: LucideIcon; label: string };

type CatalogRoom = {
  id: string;
  name: string;
  price: number;
  view: string;
  size: string;
  description: string;
  beds: string[];
  amenities: Amenity[];
  images: { src: string; alt: string }[];
};

const sharedAmenities: Amenity[] = [
  { icon: Wifi, label: "Free WiFi" },
  { icon: Wind, label: "Air Conditioning" },
  { icon: Tv, label: "Smart TV" },
  { icon: Coffee, label: "Tea & Coffee" },
  { icon: Droplet, label: "Private Bathroom" },
  { icon: Bell, label: "Room Service" },
];

const catalog: CatalogRoom[] = [
  {
    id: "standard",
    name: "Standard Room",
    price: 4500,
    view: "Garden View",
    size: "25 M²",
    description:
      "Our Standard Rooms are thoughtfully designed for a comfortable stay in Kilifi County. Each room has a king-size bed, a private bathroom with hot water, and the essentials for unwinding after a day along the coast.",
    beds: ["King Size"],
    amenities: [{ icon: Users, label: "2 Guests" }, ...sharedAmenities],
    images: [
      {
        src: cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773837496/LEMACHGARDENS12of5621_d09e4v.jpg"),
        alt: "Standard room at Lemach Hotel",
      },
      {
        src: cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773837496/LEMACHGARDENS16of562_ouub2u.jpg"),
        alt: "Standard room seating at Lemach Hotel",
      },
      {
        src: cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773837495/LEMACHGARDENS7of562_cohiqd.jpg"),
        alt: "Standard room with a canopy bed at Lemach Hotel",
      },
      {
        src: cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773837495/LEMACHGARDENS8of562_zcckde.jpg"),
        alt: "Standard room interior at Lemach Hotel",
      },
    ],
  },
  {
    id: "deluxe",
    name: "Deluxe Room",
    price: 8000,
    view: "Garden View",
    size: "45 M²",
    description:
      "Enjoy more space in our two-bedroom Deluxe Room, ideal for families and small groups. It is offered without bed and breakfast, with a garden view and room to settle in just off the B69 Highway.",
    beds: ["2 Bedrooms"],
    amenities: [{ icon: Users, label: "4 Guests" }, ...sharedAmenities],
    images: [
      {
        src: cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773839990/LEMACHGARDENS333of562_kjjury.jpg"),
        alt: "Deluxe room at Lemach Hotel",
      },
      {
        src: cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773839990/LEMACHGARDENS337of562_ehegod.jpg"),
        alt: "Deluxe room bedroom at Lemach Hotel",
      },
      {
        src: cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773405758/LEMACHGARDENS272of562_oerxub.jpg"),
        alt: "Deluxe room with seating at Lemach Hotel",
      },
      {
        src: cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773839989/LEMACHGARDENS330of562_j5zdhm.jpg"),
        alt: "Deluxe room interior at Lemach Hotel",
      },
    ],
  },
  {
    id: "family",
    name: "Family Suite",
    price: 10000,
    view: "Garden & Pool View",
    size: "60 M²",
    description:
      "Our Family Suite has two bedrooms and a living area, with bed and breakfast included. There is space for the whole family to relax, with garden and pool views in Kilifi County.",
    beds: ["2 Bedrooms"],
    amenities: [
      { icon: Users, label: "4 Guests" },
      { icon: Utensils, label: "Breakfast" },
      { icon: Tv, label: "Living Room" },
      ...sharedAmenities.filter((item) => item.label !== "Smart TV"),
    ],
    images: [
      {
        src: cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773839988/LEMACHGARDENS301of562_w5lzhz.jpg"),
        alt: "Family suite at Lemach Hotel",
      },
      {
        src: cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773839988/LEMACHGARDENS302of562_n3f4y7.jpg"),
        alt: "Family suite bedroom at Lemach Hotel",
      },
      {
        src: cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773839989/LEMACHGARDENS319of562_fnigu4.jpg"),
        alt: "Family suite interior at Lemach Hotel",
      },
      {
        src: cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773839988/LEMACHGARDENS300of562_uhl0eq.jpg"),
        alt: "Family suite living space at Lemach Hotel",
      },
    ],
  },
];

function mergeRooms(liveRooms: RoomRecord[]): CatalogRoom[] {
  const byId = new Map(liveRooms.map((room) => [room.id, room]));
  const merged = catalog.map((room) => {
    const live = byId.get(room.id);
    if (!live) return room;
    const images = room.images.some((image) => image.src === live.image)
      ? room.images
      : [{ src: live.image, alt: live.name }, ...room.images];
    return {
      ...room,
      name: live.name || room.name,
      price: live.pricePerNight || room.price,
      images,
    };
  });

  for (const live of liveRooms) {
    if (catalog.some((room) => room.id === live.id)) continue;
    merged.push({
      id: live.id,
      name: live.name,
      price: live.pricePerNight,
      view: "Garden View",
      size: "",
      description: live.description ?? "",
      beds: ["Comfortable bedding"],
      amenities: sharedAmenities,
      images: [{ src: live.image, alt: live.name }],
    });
  }

  return merged;
}

function RoomFeature({ room }: { room: CatalogRoom }) {
  const [index, setIndex] = useState(0);
  const count = room.images.length;
  const photo = room.images[index] ?? room.images[0];
  const meta = [room.view, room.size].filter(Boolean).join(" — ");

  const showPhoto = (next: number) => {
    if (count < 2) return;
    setIndex((next + count) % count);
  };

  return (
    <article className="grid items-center gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#EFE8DC]">
        {photo ? (
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        ) : null}
        {count > 1 ? (
          <>
            <button
              type="button"
              aria-label={`Previous photo of ${room.name}`}
              onClick={() => showPhoto(index - 1)}
              className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#4A4A4A] shadow-md transition-colors hover:text-primary sm:left-3"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label={`Next photo of ${room.name}`}
              onClick={() => showPhoto(index + 1)}
              className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#4A4A4A] shadow-md transition-colors hover:text-primary sm:right-3"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        ) : null}
      </div>

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary sm:tracking-[0.22em]">
          {meta}
        </p>
        <h3 className="mt-2 font-serif text-3xl font-medium text-primary-dark sm:mt-3 sm:text-5xl">
          {room.name}
        </h3>
        <p className="mt-4 text-sm text-[#5C5C5C] sm:text-[15px]">
          From{" "}
          <span className="font-semibold text-primary-dark">
            KSh {room.price.toLocaleString("en-KE")}
          </span>{" "}
          per night
        </p>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[#5A5A5A] sm:text-base">
          {room.description}
        </p>

        <div className="mt-6 border-t border-black/10 pt-5">
          <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            <Bed className="h-4 w-4" />
            Bed configuration
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 bg-[#F4F1EA] px-4 py-3">
            {room.beds.map((bed) => (
              <span key={bed} className="inline-flex items-center gap-1.5 text-sm text-[#3A3A3A]">
                <Check className="h-3.5 w-3.5 text-primary" strokeWidth={2.75} />
                {bed}
              </span>
            ))}
          </div>
        </div>

        <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 sm:gap-x-8">
          {room.amenities.map((amenity) => (
            <li key={amenity.label} className="flex items-start gap-2 text-sm leading-snug text-[#3F3F3F]">
              <amenity.icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span className="min-w-0">{amenity.label}</span>
            </li>
          ))}
        </ul>

        <Link
          href={`/booking?room=${room.id}`}
          className="mt-8 flex min-h-11 w-full items-center justify-center bg-primary px-8 py-3.5 text-[13px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-primary-dark sm:inline-flex sm:w-auto sm:tracking-[0.16em]"
        >
          Book this room
        </Link>
      </div>
    </article>
  );
}

export default function AccommodationRoomList({ rooms }: { rooms: RoomRecord[] }) {
  const list = useMemo(() => mergeRooms(rooms), [rooms]);

  return (
    <section className="bg-logo px-4 py-12 sm:px-8 sm:py-20 lg:px-12 lg:py-28">
      <div className="mx-auto flex max-w-6xl flex-col gap-14 sm:gap-20 lg:gap-28">
        {list.map((room) => (
          <RoomFeature key={room.id} room={room} />
        ))}
      </div>
    </section>
  );
}
