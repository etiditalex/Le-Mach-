"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { BedDouble, Wine, UtensilsCrossed } from "lucide-react";
import { menuItems } from "@/data/menuItems";

type MenuItem = (typeof menuItems)[number];

const cld = (src: string, transform: string) =>
  src.replace("/image/upload/", `/image/upload/${transform}/`);

const rooms = [
  {
    id: "standard",
    name: "Standard Room",
    price: 4500,
    image: cld(
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1773837496/LEMACHGARDENS12of5621_d09e4v.jpg",
      "f_auto,q_auto,w_1200"
    ),
  },
  {
    id: "deluxe",
    name: "2 Bedroom Deluxe",
    price: 8000,
    image: cld(
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1773839990/LEMACHGARDENS333of562_kjjury.jpg",
      "f_auto,q_auto,w_1200"
    ),
  },
  {
    id: "family",
    name: "Family Suite",
    price: 10000,
    image: cld(
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1773839988/LEMACHGARDENS301of562_w5lzhz.jpg",
      "f_auto,q_auto,w_1200"
    ),
  },
];

function formatKsh(price: number) {
  return `KSh ${price.toLocaleString()}`;
}

function cyclicGet<T>(arr: T[], start: number, offset: number) {
  if (arr.length === 0) return undefined;
  return arr[(start + offset) % arr.length];
}

export default function SignagePage() {
  const foods = useMemo(
    () => menuItems.filter((item) => item.category !== "beverages"),
    []
  );
  const drinks = useMemo(
    () => menuItems.filter((item) => item.category === "beverages"),
    []
  );
  const tickerItems = useMemo(() => menuItems, []);

  const [foodBase, setFoodBase] = useState(0);
  const [drinkBase, setDrinkBase] = useState(0);
  const [roomIndex, setRoomIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [clock, setClock] = useState<Date | null>(null);

  useEffect(() => {
    setMounted(true);
    setClock(new Date());
    const t = setInterval(() => {
      setClock(new Date());
    }, 60_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      if (foods.length > 0) setFoodBase((v) => (v + 1) % foods.length);
    }, 4200);
    return () => clearInterval(t);
  }, [foods.length]);

  useEffect(() => {
    const t = setInterval(() => {
      if (drinks.length > 0) setDrinkBase((v) => (v + 1) % drinks.length);
    }, 3600);
    return () => clearInterval(t);
  }, [drinks.length]);

  useEffect(() => {
    const t = setInterval(() => {
      setRoomIndex((v) => (v + 1) % rooms.length);
    }, 5200);
    return () => clearInterval(t);
  }, []);

  const visibleFoods = useMemo(() => {
    return Array.from(
      { length: 3 },
      (_, i) => cyclicGet<MenuItem>(foods, foodBase, i)
    ).filter((x): x is MenuItem => x !== undefined);
  }, [foods, foodBase]);

  const visibleDrinks = useMemo(() => {
    return Array.from(
      { length: 3 },
      (_, i) => cyclicGet<MenuItem>(drinks, drinkBase, i)
    ).filter((x): x is MenuItem => x !== undefined);
  }, [drinks, drinkBase]);

  const activeRoom = rooms[roomIndex % rooms.length];

  return (
    <main className="min-h-screen w-full text-white relative overflow-hidden bg-[#0b0b0e]">
      {/* Hand-made facade texture: wood grain + subtle noise */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-100"
        style={{
          backgroundImage:
            // Brand blend (subtle) + dark base so it isn't too bright.
            "radial-gradient(980px 520px at 20% 0%, rgba(221,20,2,0.22), transparent 62%)," +
            "radial-gradient(980px 520px at 85% 10%, rgba(255,150,31,0.18), transparent 62%)," +
            "radial-gradient(820px 520px at 50% 105%, rgba(139,69,19,0.20), transparent 60%)," +
            "linear-gradient(180deg, rgba(6,6,10,0.25) 0%, rgba(2,2,4,0.92) 70%, rgba(2,2,4,0.98) 100%)," +
            // Reduce visible background grid lines (more "handmade" texture).
            "repeating-linear-gradient(90deg, rgba(255,255,255,0.018) 0 1px, transparent 1px 40px),"+
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.010) 0 1px, transparent 1px 56px)",
          filter: "blur(0.15px)",
        }}
      />

      {/* Faux imperfections */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-18"
        style={{
          backgroundImage:
            "radial-gradient(circle at 12% 18%, rgba(255,255,255,0.10), transparent 22%)," +
            "radial-gradient(circle at 82% 26%, rgba(255,255,255,0.08), transparent 26%)," +
            "radial-gradient(circle at 36% 76%, rgba(255,255,255,0.06), transparent 30%)",
          filter: "blur(0.2px) saturate(1.05)",
        }}
      />

      {/* Subtle breathing glow for the whole facade (not AI-ish) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-22"
        style={{
          background:
            "linear-gradient(90deg, rgba(221,20,2,0.00) 0%, rgba(221,20,2,0.14) 22%, rgba(255,150,31,0.14) 50%, rgba(139,69,19,0.12) 72%, rgba(221,20,2,0.00) 100%)",
          animation: "lemachFacadeGlow 7.2s ease-in-out infinite",
        }}
      />

      <div className="relative z-10 px-4 py-6 sm:py-10">
        <header className="max-w-6xl mx-auto">
          <div className="flex items-start justify-between gap-4">
              <h1 className="text-lg sm:text-2xl font-semibold text-white/90 leading-tight">
                Lemach Foods, Drinks & Rooms
              </h1>

            <div className="text-right">
              <p className="text-xs uppercase tracking-widest text-white/60">
                Tonight
              </p>
              <p
                className="text-sm sm:text-base tabular-nums text-white/90"
                suppressHydrationWarning
              >
                {mounted && clock
                  ? clock.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "--:--"}
              </p>
            </div>
          </div>
        </header>

        <section className="max-w-6xl mx-auto mt-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 items-stretch">
            {/* Foods Panel */}
            <div className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden relative shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
              {/* rivets */}
              <div aria-hidden="true" className="absolute top-3 left-3 w-2 h-2 rounded-full bg-secondary/80 shadow-[0_0_18px_rgba(210,105,30,0.45)]" />
              <div aria-hidden="true" className="absolute top-3 right-3 w-2 h-2 rounded-full bg-secondary/80 shadow-[0_0_18px_rgba(210,105,30,0.45)]" />
              <div className="px-4 pt-4">
                <div className="flex items-center gap-2">
                  <UtensilsCrossed className="w-5 h-5 text-secondary" />
                  <p className="text-xs uppercase tracking-[0.25em] text-white/70">
                    Foods
                  </p>
                </div>
              </div>

              <div className="px-4 pb-4 pt-3">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`foods-${foodBase}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="space-y-3"
                  >
                    {visibleFoods.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-3 rounded-2xl border border-white/10 bg-black/20 overflow-hidden"
                      >
                        <div className="relative h-16 w-16 shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                        <div className="py-3 pr-3">
                          <p className="text-[12px] font-semibold text-white/90 leading-tight">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-white/60">
                            {formatKsh(item.price)}
                          </p>
                        </div>
                      </div>
                    ))}

                    {visibleFoods.length === 0 && (
                      <p className="text-white/60 text-sm">No food items.</p>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Drinks Panel */}
            <div className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden relative shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
              <div aria-hidden="true" className="absolute top-3 left-3 w-2 h-2 rounded-full bg-secondary/80 shadow-[0_0_18px_rgba(210,105,30,0.45)]" />
              <div aria-hidden="true" className="absolute top-3 right-3 w-2 h-2 rounded-full bg-secondary/80 shadow-[0_0_18px_rgba(210,105,30,0.45)]" />
              <div className="px-4 pt-4">
                <div className="flex items-center gap-2">
                  <Wine className="w-5 h-5 text-secondary" />
                  <p className="text-xs uppercase tracking-[0.25em] text-white/70">
                    Drinks
                  </p>
                </div>
              </div>

              <div className="px-4 pb-4 pt-3">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`drinks-${drinkBase}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="space-y-3"
                  >
                    {visibleDrinks.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-3 rounded-2xl border border-white/10 bg-black/20 overflow-hidden"
                      >
                        <div className="relative h-16 w-16 shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                        <div className="py-3 pr-3">
                          <p className="text-[12px] font-semibold text-white/90 leading-tight">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-white/60">
                            {formatKsh(item.price)}
                          </p>
                        </div>
                      </div>
                    ))}

                    {visibleDrinks.length === 0 && (
                      <p className="text-white/60 text-sm">No drink items.</p>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Rooms Panel */}
            <div className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden relative shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
              <div aria-hidden="true" className="absolute top-3 left-3 w-2 h-2 rounded-full bg-secondary/80 shadow-[0_0_18px_rgba(210,105,30,0.45)]" />
              <div aria-hidden="true" className="absolute top-3 right-3 w-2 h-2 rounded-full bg-secondary/80 shadow-[0_0_18px_rgba(210,105,30,0.45)]" />
              <div className="px-4 pt-4">
                <div className="flex items-center gap-2">
                  <BedDouble className="w-5 h-5 text-secondary" />
                  <p className="text-xs uppercase tracking-[0.25em] text-white/70">
                    Rooms
                  </p>
                </div>
              </div>

              <div className="px-4 pb-4 pt-3">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`room-${activeRoom.id}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="relative h-72 sm:h-80 rounded-3xl overflow-hidden border border-white/10 bg-black/20"
                  >
                    <Image
                      src={activeRoom.image}
                      alt={activeRoom.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      priority={roomIndex === 0}
                    />
                    <div aria-hidden="true" className="absolute inset-0 bg-black/45" />

                    {/* "facade window" highlight */}
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 opacity-35"
                      style={{
                        background:
                          "linear-gradient(110deg, rgba(255,210,140,0.0) 20%, rgba(210,105,30,0.20) 42%, rgba(255,210,140,0.0) 68%)",
                        transform: "translateX(-25%)",
                        animation: "lemachWindow 3.2s ease-in-out infinite",
                      }}
                    />

                    <div className="absolute left-4 right-4 bottom-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-white/65">
                        From {formatKsh(activeRoom.price)} / night
                      </p>
                      <h2 className="text-xl sm:text-2xl font-bold text-white/95 mt-1">
                        {activeRoom.name}
                      </h2>
                      <p className="text-[12px] text-white/70 mt-2">
                        Book and arrive refreshed.
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Mini room indicators */}
                <div className="flex gap-2 mt-3">
                  {rooms.map((r, idx) => {
                    const isActive = idx === roomIndex;
                    return (
                      <div
                        key={r.id}
                        className={`h-2 flex-1 rounded-full transition-colors ${
                          isActive ? "bg-secondary" : "bg-white/15"
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Live Menu Ticker */}
          <div className="mt-4 sm:mt-6 rounded-3xl border border-white/10 bg-white/5 overflow-hidden relative shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
            {/* bottom screws */}
            <div
              aria-hidden="true"
              className="absolute bottom-3 left-6 w-2 h-2 rounded-full bg-secondary/70 shadow-[0_0_18px_rgba(210,105,30,0.35)]"
            />
            <div
              aria-hidden="true"
              className="absolute bottom-3 right-6 w-2 h-2 rounded-full bg-secondary/70 shadow-[0_0_18px_rgba(210,105,30,0.35)]"
            />

            <div className="px-4 py-3 flex items-center justify-between gap-3">
              <p className="text-xs uppercase tracking-[0.25em] text-white/70">
                Live Menu Running
              </p>
              <p className="text-xs text-white/55">Foods & Drinks</p>
            </div>

            <div className="relative">
              {/* Fade edges for readability */}
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-20 pointer-events-none"
                style={{
                  background: "linear-gradient(90deg, rgba(0,0,0,0.85), transparent)",
                }}
              />
              <div
                aria-hidden="true"
                className="absolute inset-y-0 right-0 w-20 pointer-events-none"
                style={{
                  background: "linear-gradient(-90deg, rgba(0,0,0,0.85), transparent)",
                }}
              />

              <div
                aria-label="Live menu ticker"
                className="flex items-center whitespace-nowrap"
                style={{
                  animation: "lemachMarquee 28s linear infinite",
                }}
              >
                {[0, 1].flatMap((copy) =>
                  tickerItems.map((item) => (
                    <div
                      key={`${copy}-${item.id}`}
                      className="mr-4 sm:mr-6 flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-2"
                    >
                      <span className="text-[11px] uppercase tracking-[0.2em] text-secondary/80">
                        {item.category}
                      </span>
                      <span className="text-[12px] font-semibold text-white/90">
                        {item.name}
                      </span>
                      <span className="text-[12px] font-bold text-secondary">
                        {formatKsh(item.price)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        @keyframes lemachMarquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes lemachFacadeGlow {
          0%,
          100% {
            filter: saturate(1) brightness(1);
            opacity: 0.35;
          }
          50% {
            filter: saturate(1.1) brightness(1.05);
            opacity: 0.55;
          }
        }
        @keyframes lemachWindow {
          0%,
          100% {
            transform: translateX(-30%);
          }
          50% {
            transform: translateX(30%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .facadeMotion,
          * {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.001ms !important;
          }
        }
      `}</style>
    </main>
  );
}

