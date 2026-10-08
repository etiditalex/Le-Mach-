"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Wifi, Wind, Tv, Coffee, Droplet, Bell } from "lucide-react";
import type { RoomRecord } from "@/lib/hotel-types";
import AccommodationHero from "@/components/AccommodationHero";
import AccommodationRoomList from "@/components/AccommodationRoomList";

const included = [
  { icon: Wifi, label: "Free WiFi" },
  { icon: Wind, label: "Air Conditioning" },
  { icon: Tv, label: "Smart TV" },
  { icon: Coffee, label: "Tea & Coffee" },
  { icon: Droplet, label: "En-suite Bathroom" },
  { icon: Bell, label: "Room Service" },
];

export default function RoomsPage() {
  const [rooms, setRooms] = useState<RoomRecord[]>([]);

  useEffect(() => {
    fetch("/api/public/rooms")
      .then(async (r) => {
        const data = (await r.json()) as { rooms?: RoomRecord[]; error?: string };
        if (!r.ok) throw new Error(data.error || "Could not load rooms");
        setRooms(data.rooms ?? []);
      })
      .catch(() => setRooms([]));
  }, []);

  return (
    <main>
      <Header />
      <div className="min-h-screen bg-gray-50 pt-24">
        <AccommodationHero titleAs="h1" />
        <section className="bg-white px-5 py-16 sm:px-6 sm:py-36 lg:py-44">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-secondary-dark sm:text-xs sm:tracking-[0.32em]">
              Garden rooms
            </p>
            <h2 className="mt-4 font-serif text-[2.15rem] font-medium leading-[1.05] text-primary-dark sm:mt-5 sm:text-5xl sm:leading-[1.02] lg:text-[3.5rem]">
              <span className="block">Quiet rooms</span>
              <span className="mt-1 block italic text-primary">in the gardens</span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[#6A6A6A] sm:mt-10 sm:text-lg">
              Lemach has a standard room, a deluxe room, and a family suite in Kilifi
              County, just off the B69 Highway. Each stay includes free WiFi, air
              conditioning, a private bathroom with hot water, and a smart TV. Some rooms
              have a balcony over the gardens, and the family suite includes breakfast.
            </p>
          </div>
        </section>
        <AccommodationRoomList rooms={rooms} />
        <section className="bg-primary-dark px-4 py-14 text-center sm:px-6 sm:py-24 lg:py-32">
          <div className="mx-auto max-w-5xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-secondary sm:text-xs sm:tracking-[0.32em]">
              Every room includes
            </p>
            <ul className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-x-4 gap-y-8 sm:mt-14 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-6">
              {included.map((item) => (
                <li key={item.label} className="flex flex-col items-center gap-3">
                  <item.icon className="h-6 w-6 text-secondary" strokeWidth={1.5} />
                  <span className="text-xs leading-snug text-white/90">{item.label}</span>
                </li>
              ))}
            </ul>

            <div className="mx-auto mt-16 max-w-2xl sm:mt-28 lg:mt-32">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-secondary sm:text-xs sm:tracking-[0.32em]">
                Ready to book?
              </p>
              <h2 className="mt-4 font-serif text-[2.15rem] font-medium leading-tight text-white sm:mt-5 sm:text-5xl lg:text-6xl">
                Reserve your room at Lemach
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-white/85 sm:text-base">
                Reserve directly with us for the best available rates and personal support
                throughout your stay.
              </p>
              <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/booking"
                  className="inline-flex min-h-11 w-full items-center justify-center bg-secondary px-6 py-3.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-primary-dark transition-colors hover:bg-logo sm:w-auto sm:min-w-[210px] sm:tracking-[0.16em]"
                >
                  Check availability
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex min-h-11 w-full items-center justify-center border border-white/75 px-6 py-3.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-white hover:text-primary-dark sm:w-auto sm:min-w-[210px] sm:tracking-[0.16em]"
                >
                  Contact reservations
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
