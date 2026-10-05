"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";

const isoDate = (date: Date) => {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
};

const fieldClass =
  "box-border block h-12 w-full min-w-0 max-w-full border border-neutral-300 bg-white px-3 text-base text-neutral-800 outline-none focus:border-primary lg:h-11 lg:text-sm";

const today = () => isoDate(new Date());

const nextDay = (iso: string) => {
  const date = new Date(`${iso}T00:00:00`);
  date.setDate(date.getDate() + 1);
  return isoDate(date);
};

export default function AvailabilitySearch() {
  const router = useRouter();
  const [arrival, setArrival] = useState("");
  const [departure, setDeparture] = useState("");
  const [guests, setGuests] = useState("2");
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!arrival || !departure) {
      setError("Choose an arrival and a departure date.");
      return;
    }
    if (departure <= arrival) {
      setError("Departure must be after arrival.");
      return;
    }
    setError("");
    const params = new URLSearchParams({
      checkIn: arrival,
      checkOut: departure,
      guests,
    });
    router.push(`/booking?${params.toString()}`);
  };

  return (
    <div className="relative z-30 -mt-6 px-3 sm:-mt-10 sm:px-4 lg:-mt-12">
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex w-full max-w-5xl flex-col bg-white shadow-[0_12px_40px_rgba(28,36,48,0.14)] lg:flex-row lg:items-stretch"
      >
        <div className="grid min-w-0 flex-1 grid-cols-1 gap-3 p-3 min-[360px]:grid-cols-2 sm:gap-4 sm:p-4 lg:grid-cols-3 lg:gap-5 lg:p-5">
          <label className="block min-w-0">
            <span className="block text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-500 sm:tracking-[0.18em]">
              Arrival
            </span>
            <input
              type="date"
              name="arrival"
              required
              min={today()}
              value={arrival}
              onChange={(event) => {
                const value = event.target.value;
                setArrival(value);
                if (departure && value && departure <= value) setDeparture("");
              }}
              className={`${fieldClass} mt-1.5 lg:mt-2`}
            />
          </label>

          <label className="block min-w-0">
            <span className="block text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-500 sm:tracking-[0.18em]">
              Departure
            </span>
            <input
              type="date"
              name="departure"
              required
              min={arrival ? nextDay(arrival) : today()}
              value={departure}
              onChange={(event) => setDeparture(event.target.value)}
              className={`${fieldClass} mt-1.5 lg:mt-2`}
            />
          </label>

          <label className="block min-w-0 min-[360px]:col-span-2 lg:col-span-1">
            <span className="block text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-500 sm:tracking-[0.18em]">
              Guests
            </span>
            <span className="relative mt-1.5 block lg:mt-2">
              <select
                name="guests"
                value={guests}
                onChange={(event) => setGuests(event.target.value)}
                className={`${fieldClass} appearance-none pr-10`}
              >
                <option value="1">1 Guest</option>
                <option value="2">2 Guests</option>
                <option value="3">3 Guests</option>
                <option value="4">4 Guests</option>
                <option value="5">5+ Guests</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            </span>
          </label>
        </div>

        <button
          type="submit"
          className="min-h-12 bg-primary px-4 py-3.5 text-[13px] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-primary-dark sm:text-sm sm:tracking-[0.16em] lg:w-56 lg:shrink-0 lg:px-6"
        >
          Check availability
        </button>
      </form>
      {error ? (
        <p className="mx-auto mt-2 max-w-5xl text-sm text-primary" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
