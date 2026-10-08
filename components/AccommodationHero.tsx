import Image from "next/image";

const cld = (src: string) =>
  src.replace("/image/upload/", "/image/upload/f_auto,q_auto,w_2200/");

const courtyard =
  "https://res.cloudinary.com/dyfnobo9r/image/upload/v1773406693/LEMACHGARDENS136of562_u52vrl.jpg";

type AccommodationHeroProps = {
  titleAs?: "h1" | "h2";
};

export default function AccommodationHero({ titleAs = "h2" }: AccommodationHeroProps) {
  const Title = titleAs;

  return (
    <section className="relative min-h-[320px] overflow-hidden sm:min-h-[400px] lg:min-h-[460px]">
      <Image
        src={cld(courtyard)}
        alt="Lemach Hotel courtyard and guest rooms in Kilifi County"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center sm:object-[68%_center]"
      />
      <div
        className="absolute inset-0 lg:hidden"
        style={{
          background:
            "linear-gradient(180deg, rgba(8, 20, 18, 0.2) 0%, rgba(8, 20, 18, 0.55) 42%, rgba(8, 20, 18, 0.78) 100%)",
        }}
      />
      <div
        className="absolute inset-0 hidden lg:block"
        style={{
          background:
            "linear-gradient(90deg, rgba(8, 20, 18, 0.72) 0%, rgba(8, 20, 18, 0.5) 36%, rgba(8, 20, 18, 0.08) 58%, rgba(8, 20, 18, 0) 72%)",
        }}
      />
      <div className="relative z-10 flex min-h-[320px] items-end px-5 pb-8 pt-16 sm:min-h-[400px] sm:items-center sm:px-12 sm:py-14 lg:min-h-[460px] lg:w-[52%] lg:px-16 xl:px-20">
        <div className="max-w-full">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5ed4cc] sm:text-xs sm:tracking-[0.34em]">
            Accommodation
          </p>
          <Title className="mt-3 font-serif text-[2.35rem] font-medium leading-[0.95] text-white sm:mt-5 sm:text-6xl sm:leading-[0.9] lg:text-[4.6rem]">
            Rooms among
            <span className="mt-1 block">the gardens</span>
          </Title>
        </div>
      </div>
    </section>
  );
}
