import Image from "next/image";
import { ReviewCard } from "@/components/GoogleReviewCard";
import { getGoogleReviews } from "@/lib/google-reviews";

export default async function GoogleReviews({ limit = 3 }: { limit?: number }) {
  const data = await getGoogleReviews();
  if (!data) return null;
  const reviews = data.reviews.slice(0, limit);

  const ratingLabel =
    data.rating !== null ? data.rating.toFixed(1).replace(/\.0$/, "") : null;

  return (
    <section id="guest-reviews" className="bg-[#F7F4EE] px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#C99700] sm:text-xs">
            Guest reviews
          </p>
          <h2 className="mt-4 font-serif leading-[1.05] text-[#1C2430]">
            <span className="block text-[2.5rem] font-medium sm:text-5xl lg:text-[3.35rem]">
              What guests say
            </span>
            <span className="mt-1 block text-[2.6rem] font-medium italic text-primary sm:text-[3.1rem] lg:text-[3.5rem]">
              about Lemach
            </span>
          </h2>
          {ratingLabel ? (
            <p className="mt-5 text-sm text-[#5A5A5A]">
              <span className="font-semibold text-primary-dark">{ratingLabel}</span>
              {" out of 5"}
              {data.reviewCount ? ` from ${data.reviewCount} Google reviews` : " on Google"}
            </p>
          ) : null}
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {reviews.map((review) => (
            <li key={review.id} className="h-full">
              <ReviewCard review={review} />
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
          {data.mapsUri ? (
            <a
              href="/reviews"
              className="inline-flex min-h-11 items-center justify-center bg-primary px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-primary-dark"
            >
              Testimonials / Reviews
            </a>
          ) : null}
          <Image
            src="https://maps.gstatic.com/mapfiles/api-3/images/powered-by-google-on-white3.png"
            alt="Powered by Google"
            width={144}
            height={18}
            className="h-[18px] w-auto"
          />
        </div>
      </div>
    </section>
  );
}
