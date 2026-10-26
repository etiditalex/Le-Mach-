import Image from "next/image";
import { Star } from "lucide-react";
import { getGoogleReviews, type GoogleReview } from "@/lib/google-reviews";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => {
        const filled = index < rating;
        return (
          <Star
            key={index}
            className={`h-4 w-4 ${filled ? "fill-secondary text-secondary-dark" : "text-[#D9D1C7]"}`}
            aria-hidden
          />
        );
      })}
    </div>
  );
}

function ReviewCard({ review }: { review: GoogleReview }) {
  const author = review.authorUri ? (
    <a href={review.authorUri} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
      {review.author}
    </a>
  ) : (
    review.author
  );

  return (
    <article className="flex h-full flex-col border border-[#E7E1D8] bg-white px-5 py-6 text-left sm:px-6 sm:py-8">
      <Stars rating={review.rating} />
      <p className="mt-4 flex-1 text-sm leading-relaxed text-[#3A3A3A]">{review.text}</p>
      <div className="mt-6 flex items-center gap-3">
        {review.authorPhoto ? (
          <Image
            src={review.authorPhoto}
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-logo font-serif text-lg text-primary">
            {review.author.slice(0, 1)}
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-primary-dark">{author}</p>
          {review.relativeTime ? <p className="text-xs text-[#6A6A6A]">{review.relativeTime}</p> : null}
        </div>
      </div>
      {review.reviewUri ? (
        <a
          href={review.reviewUri}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary hover:text-primary-dark"
        >
          Read on Google
        </a>
      ) : null}
    </article>
  );
}

export default async function GoogleReviews() {
  const data = await getGoogleReviews();
  if (!data) return null;

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
          {data.reviews.map((review) => (
            <li key={review.id} className="h-full">
              <ReviewCard review={review} />
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
          {data.mapsUri ? (
            <a
              href={data.mapsUri}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center bg-primary px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-primary-dark"
            >
              See all Google reviews
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
