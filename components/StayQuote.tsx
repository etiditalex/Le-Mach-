import Image from "next/image";

const POOL_IMAGE =
  "https://res.cloudinary.com/dyfnobo9r/image/upload/f_auto,q_auto,w_2000/v1756012069/images_11_zaumgq.jpg";

export default function StayQuote() {
  return (
    <section id="stay-quote" className="relative min-h-[280px] overflow-hidden sm:min-h-[340px] lg:min-h-[400px]">
      <Image
        src={POOL_IMAGE}
        alt="Lemach Hotel swimming pool"
        fill
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-[#0B1C2C]/55" aria-hidden />
      <div className="relative z-10 flex min-h-[280px] items-center justify-center px-6 py-16 text-center sm:min-h-[340px] sm:px-10 lg:min-h-[400px]">
        <blockquote className="max-w-4xl font-serif text-xl font-medium italic leading-relaxed text-white sm:text-2xl lg:text-[2rem] lg:leading-snug">
          “Where the pool, the gardens, and warm hospitality remind you why you came to Kilifi.”
        </blockquote>
      </div>
    </section>
  );
}
