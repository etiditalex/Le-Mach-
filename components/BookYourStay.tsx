import Link from "next/link";

export default function BookYourStay() {
  return (
    <section id="book-your-stay" className="bg-primary">
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:py-24">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-white/70 sm:text-xs">
          Ready to visit?
        </p>
        <h2 className="mt-4 font-serif text-[2.4rem] font-medium leading-tight text-white sm:text-5xl lg:text-[3.25rem]">
          Book your stay at Lemach
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-white/85 sm:text-base">
          Reserve directly with us for the best available rates and personal support
          throughout your stay.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/booking"
            className="inline-flex min-w-[160px] items-center justify-center bg-logo px-8 py-3.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-primary transition-colors hover:bg-white"
          >
            Book Now
          </Link>
          <Link
            href="/contact"
            className="inline-flex min-w-[160px] items-center justify-center border border-white/80 px-8 py-3.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-white hover:text-primary"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
