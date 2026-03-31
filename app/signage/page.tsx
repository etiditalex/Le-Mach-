"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { BedDouble, Wine, UtensilsCrossed } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { menuItems as staticMenuItems } from "@/data/menuItems";
import type { MenuItem } from "@/context/CartContext";
import { DEFAULT_SIGNAGE_YOUTUBE } from "@/lib/site";
import { youtubeVideoIdFromInput, youtubeSignageEmbedUrl } from "@/lib/youtube";

const cld = (src: string, transform: string) =>
  src.replace("/image/upload/", `/image/upload/${transform}/`);

type RoomSlide = {
  id: string;
  name: string;
  price: number;
  image: string;
};

const defaultRooms: RoomSlide[] = [
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

function SignageFallback() {
  return (
    <main className="fixed inset-0 z-[200] flex items-center justify-center bg-white text-gray-600" />
  );
}

function SignageContent() {
  const searchParams = useSearchParams();
  const youtubeParam =
    searchParams.get("youtube") ||
    searchParams.get("yt") ||
    searchParams.get("v") ||
    "";
  const envYoutube =
    typeof process !== "undefined" ? process.env.NEXT_PUBLIC_SIGNAGE_YOUTUBE?.trim() || "" : "";

  const youtubeId = useMemo(() => {
    const raw = youtubeParam || envYoutube || DEFAULT_SIGNAGE_YOUTUBE;
    return youtubeVideoIdFromInput(raw);
  }, [youtubeParam, envYoutube]);

  const embedSrc = youtubeId ? youtubeSignageEmbedUrl(youtubeId) : null;

  const [menuSource, setMenuSource] = useState<MenuItem[]>(staticMenuItems);
  const [rooms, setRooms] = useState<RoomSlide[]>(defaultRooms);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const [menuRes, roomsRes] = await Promise.all([
          fetch("/api/public/menu", { cache: "no-store" }),
          fetch("/api/public/rooms", { cache: "no-store" }),
        ]);
        if (cancelled) return;
        const menuJson = (await menuRes.json()) as { items?: MenuItem[] };
        if (Array.isArray(menuJson.items) && menuJson.items.length > 0) {
          setMenuSource(menuJson.items);
        }
        const roomsJson = (await roomsRes.json()) as {
          rooms?: { id: string; name: string; pricePerNight: number; image: string }[];
        };
        if (Array.isArray(roomsJson.rooms) && roomsJson.rooms.length > 0) {
          setRooms(
            roomsJson.rooms.map((r) => ({
              id: r.id,
              name: r.name,
              price: r.pricePerNight,
              image: r.image,
            }))
          );
        }
      } catch {
        /* keep static fallback */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const foods = useMemo(() => {
    return menuSource.filter((item) => {
      const cat = (item.category ?? "").trim().toLowerCase();
      return cat !== "beverages";
    });
  }, [menuSource]);
  const drinks = useMemo(() => {
    return menuSource.filter((item) => {
      const cat = (item.category ?? "").trim().toLowerCase();
      return cat === "beverages";
    });
  }, [menuSource]);
  const tickerItems = useMemo(() => menuSource, [menuSource]);

  /** Long enough strip so one loop is wider than typical TVs (seamless -50% scroll). */
  const marqueeStrip = useMemo(() => {
    if (tickerItems.length === 0) return [];
    const out: MenuItem[] = [];
    while (out.length < 20) {
      for (const it of tickerItems) out.push(it);
    }
    return out;
  }, [tickerItems]);

  const [foodBase, setFoodBase] = useState(0);
  const [drinkBase, setDrinkBase] = useState(0);
  const [roomIndex, setRoomIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [clock, setClock] = useState<Date | null>(null);
  const [showFullscreenPrompt, setShowFullscreenPrompt] = useState(true);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);
    setClock(new Date());
    const t = setInterval(() => {
      setClock(new Date());
    }, 60_000);
    return () => clearInterval(t);
  }, []);

  /** Lock document scroll; page fills one screen — no vertical page scroll. */
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    html.classList.add("signage-kiosk-html");
    body.classList.add("signage-kiosk-body");

    const onFsChange = () => {
      if (document.fullscreenElement) setShowFullscreenPrompt(false);
    };
    document.addEventListener("fullscreenchange", onFsChange);
    onFsChange();

    return () => {
      document.removeEventListener("fullscreenchange", onFsChange);
      html.classList.remove("signage-kiosk-html");
      body.classList.remove("signage-kiosk-body");
      const fs = document.fullscreenElement;
      if (fs) void document.exitFullscreen?.().catch(() => {});
    };
  }, []);

  const enterFullscreen = () => {
    const el = mainRef.current;
    if (el?.requestFullscreen) {
      void el.requestFullscreen().catch(() => {
        void document.documentElement.requestFullscreen?.().catch(() => {});
      });
    } else {
      void document.documentElement.requestFullscreen?.().catch(() => {});
    }
  };

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
    if (rooms.length === 0) return;
    const t = setInterval(() => {
      setRoomIndex((v) => (v + 1) % rooms.length);
    }, 5200);
    return () => clearInterval(t);
  }, [rooms.length]);

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
    <main
      ref={mainRef}
      className="signage-root fixed inset-0 z-[100] flex h-[100dvh] max-h-[100dvh] w-full flex-col overflow-hidden bg-white text-gray-900"
    >
      {showFullscreenPrompt ? (
        <div
          className="fixed inset-0 z-[250] flex flex-col items-center justify-center bg-black/55 px-6 text-center text-white backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-label="Fullscreen option"
        >
          <p className="max-w-md text-lg font-semibold leading-snug sm:text-xl">
            Hide browser tabs and address bar
          </p>
          <p className="mt-2 max-w-sm text-sm text-white/85">
            Fullscreen uses the whole monitor for signage. Browsers require a tap here first.
          </p>
          <button
            type="button"
            className="mt-6 rounded-full bg-white px-8 py-3 text-base font-semibold text-gray-900 shadow-lg transition hover:bg-gray-100"
            onClick={() => {
              enterFullscreen();
              setShowFullscreenPrompt(false);
            }}
          >
            Enter fullscreen
          </button>
          <button
            type="button"
            className="mt-4 text-sm text-white/75 underline decoration-white/40 underline-offset-4 hover:text-white"
            onClick={() => setShowFullscreenPrompt(false)}
          >
            Continue in normal window
          </button>
        </div>
      ) : null}

      {/* Grid: top row shrinks; bottom row (price ticker) always keeps height — avoids flex min-height pushing ticker off-screen (esp. fullscreen). */}
      <div className="signage-layout-shell relative z-10 grid min-h-0 w-full min-w-0 flex-1 grid-rows-[minmax(0,1fr)_auto] overflow-hidden">
        <div className="signage-layout-top flex min-h-0 min-w-0 flex-col overflow-hidden px-2 pb-1 pt-1 sm:px-3">
          <header className="mx-auto flex w-full max-w-6xl shrink-0 items-start justify-between gap-3 py-1">
            <div>
              <h1 className="text-base font-semibold leading-tight text-gray-900 sm:text-xl md:text-2xl">
                Lemach Foods, Drinks & Rooms
              </h1>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-[10px] uppercase tracking-widest text-gray-500 sm:text-xs">Tonight</p>
              <p
                className="tabular-nums text-sm text-gray-900 sm:text-base"
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
          </header>

          <div className="mx-auto flex min-h-0 w-full min-w-0 max-w-6xl flex-1 flex-col gap-2 overflow-hidden">
          {embedSrc ? (
            <section
              className="relative z-0 min-h-0 flex-1 basis-0 overflow-hidden"
              aria-label="YouTube video"
            >
              <div className="relative z-0 h-full min-h-[100px] isolate overflow-hidden rounded-xl border border-gray-200 bg-black shadow-md sm:rounded-2xl">
                <iframe
                  title="Lemach digital signage — YouTube"
                  src={embedSrc}
                  className="block h-full w-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
            </section>
          ) : null}

          <section className="flex min-h-0 shrink-0 flex-col gap-2 overflow-hidden pb-1">
          <div className="grid grid-cols-1 items-stretch gap-2 md:grid-cols-3 md:gap-2">
            <div className="relative overflow-hidden rounded-2xl border border-red-700/30 bg-[#fe0000] text-white shadow-lg md:rounded-3xl">
              <div
                aria-hidden="true"
                className="absolute left-2 top-2 z-[1] h-1.5 w-1.5 rounded-full bg-secondary shadow-[0_0_12px_rgba(255,205,0,0.7)] sm:left-3 sm:top-3 sm:h-2 sm:w-2"
              />
              <div
                aria-hidden="true"
                className="absolute right-2 top-2 z-[1] h-1.5 w-1.5 rounded-full bg-secondary shadow-[0_0_12px_rgba(255,205,0,0.7)] sm:right-3 sm:top-3 sm:h-2 sm:w-2"
              />
              <div className="px-3 pt-2 sm:px-3 sm:pt-3">
                <div className="flex items-center gap-2">
                  <UtensilsCrossed className="h-4 w-4 text-secondary sm:h-5 sm:w-5" />
                  <p className="text-[10px] uppercase tracking-[0.25em] text-white/90 sm:text-xs">Foods</p>
                </div>
              </div>

              <div className="px-3 pb-2 pt-2 sm:px-3 sm:pb-3">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`foods-${foodBase}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="space-y-1.5 sm:space-y-2"
                  >
                    {visibleFoods.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-2 overflow-hidden rounded-xl border border-white/25 bg-black/20 sm:gap-3 sm:rounded-2xl"
                      >
                        <div className="relative h-12 w-12 shrink-0 self-center overflow-hidden rounded-l-lg bg-black/45 p-0.5 sm:h-14 sm:w-14 sm:rounded-l-xl sm:p-1">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-contain"
                            sizes="56px"
                          />
                        </div>
                        <div className="min-w-0 py-1.5 pr-2 sm:py-2 sm:pr-3">
                          <p className="text-[11px] font-semibold leading-tight text-white sm:text-xs">
                            {item.name}
                          </p>
                          <p className="text-[10px] text-white/80 sm:text-[11px]">{formatKsh(item.price)}</p>
                        </div>
                      </div>
                    ))}

                    {visibleFoods.length === 0 && (
                      <p className="text-sm text-white/80">No food items.</p>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-red-700/30 bg-[#fe0000] text-white shadow-lg md:rounded-3xl">
              <div
                aria-hidden="true"
                className="absolute left-2 top-2 z-[1] h-1.5 w-1.5 rounded-full bg-secondary shadow-[0_0_12px_rgba(255,205,0,0.7)] sm:left-3 sm:top-3 sm:h-2 sm:w-2"
              />
              <div
                aria-hidden="true"
                className="absolute right-2 top-2 z-[1] h-1.5 w-1.5 rounded-full bg-secondary shadow-[0_0_12px_rgba(255,205,0,0.7)] sm:right-3 sm:top-3 sm:h-2 sm:w-2"
              />
              <div className="px-3 pt-2 sm:px-3 sm:pt-3">
                <div className="flex items-center gap-2">
                  <Wine className="h-4 w-4 text-secondary sm:h-5 sm:w-5" />
                  <p className="text-[10px] uppercase tracking-[0.25em] text-white/90 sm:text-xs">Drinks</p>
                </div>
              </div>

              <div className="px-3 pb-2 pt-2 sm:px-3 sm:pb-3">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`drinks-${drinkBase}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="space-y-1.5 sm:space-y-2"
                  >
                    {visibleDrinks.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-2 overflow-hidden rounded-xl border border-white/25 bg-black/20 sm:gap-3 sm:rounded-2xl"
                      >
                        <div className="relative h-12 w-12 shrink-0 self-center overflow-hidden rounded-l-lg bg-black/45 p-0.5 sm:h-14 sm:w-14 sm:rounded-l-xl sm:p-1">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-contain"
                            sizes="56px"
                          />
                        </div>
                        <div className="min-w-0 py-1.5 pr-2 sm:py-2 sm:pr-3">
                          <p className="text-[11px] font-semibold leading-tight text-white sm:text-xs">
                            {item.name}
                          </p>
                          <p className="text-[10px] text-white/80 sm:text-[11px]">{formatKsh(item.price)}</p>
                        </div>
                      </div>
                    ))}

                    {visibleDrinks.length === 0 && (
                      <p className="text-sm text-white/80">No drink items.</p>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-red-700/30 bg-[#fe0000] text-white shadow-lg md:rounded-3xl">
              <div
                aria-hidden="true"
                className="absolute left-2 top-2 z-[1] h-1.5 w-1.5 rounded-full bg-secondary shadow-[0_0_12px_rgba(255,205,0,0.7)] sm:left-3 sm:top-3 sm:h-2 sm:w-2"
              />
              <div
                aria-hidden="true"
                className="absolute right-2 top-2 z-[1] h-1.5 w-1.5 rounded-full bg-secondary shadow-[0_0_12px_rgba(255,205,0,0.7)] sm:right-3 sm:top-3 sm:h-2 sm:w-2"
              />
              <div className="px-3 pt-2 sm:px-3 sm:pt-3">
                <div className="flex items-center gap-2">
                  <BedDouble className="h-4 w-4 text-secondary sm:h-5 sm:w-5" />
                  <p className="text-[10px] uppercase tracking-[0.25em] text-white/90 sm:text-xs">Rooms</p>
                </div>
              </div>

              <div className="px-3 pb-2 pt-2 sm:px-3 sm:pb-3">
                {activeRoom ? (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`room-${activeRoom.id}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="relative h-[clamp(9rem,20vh,13rem)] overflow-hidden rounded-2xl border border-white/25 bg-black/25 sm:h-[clamp(10rem,22vh,15rem)]"
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
                      <div aria-hidden="true" className="signage-room-shimmer absolute inset-0 opacity-35" />
                      <div className="absolute bottom-2 left-3 right-3 sm:bottom-3 sm:left-4 sm:right-4">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-white/65 sm:text-xs">
                          From {formatKsh(activeRoom.price)} / night
                        </p>
                        <h2 className="mt-0.5 text-base font-bold text-white/95 sm:text-lg">{activeRoom.name}</h2>
                        <p className="mt-1 hidden text-[11px] text-white/70 sm:block sm:text-[12px]">
                          Book and arrive refreshed.
                        </p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                ) : (
                  <p className="py-4 text-sm text-white/80">No rooms.</p>
                )}

                <div className="mt-2 flex gap-2">
                  {rooms.map((r, idx) => {
                    const isActive = idx === roomIndex;
                    return (
                      <div
                        key={r.id}
                        className={`h-1.5 flex-1 rounded-full transition-colors sm:h-2 ${
                          isActive ? "bg-secondary" : "bg-white/30"
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          </section>
        </div>
        </div>

        {/* Edge-to-edge price ticker — grid row 2: always visible; z above iframe compositor in fullscreen */}
        <div className="signage-price-ticker relative z-30 min-h-[3rem] w-full max-w-none shrink-0 overflow-hidden bg-[#fe0000] text-white [transform:translateZ(0)]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-16 bg-gradient-to-r from-[#fe0000] to-transparent sm:w-24"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-16 bg-gradient-to-l from-[#fe0000] to-transparent sm:w-24"
          />

          <div className="overflow-hidden">
            <div
              aria-label="Live menu prices"
              className="signage-marquee-track whitespace-nowrap py-2.5 sm:py-3"
            >
              {[0, 1].flatMap((copy) =>
                marqueeStrip.map((item, idx) => (
                  <div
                    key={`${copy}-${item.id}-${idx}`}
                    className="mr-4 inline-flex shrink-0 items-center gap-2 rounded-full border border-white/30 bg-black/25 px-3 py-2 sm:mr-5 sm:px-4 sm:py-2.5"
                  >
                    <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-secondary sm:text-xs">
                      {item.category}
                    </span>
                    <span className="text-xs font-semibold text-white sm:text-sm">{item.name}</span>
                    <span className="text-xs font-bold text-white sm:text-sm">{formatKsh(item.price)}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function SignagePage() {
  return (
    <Suspense fallback={<SignageFallback />}>
      <SignageContent />
    </Suspense>
  );
}
