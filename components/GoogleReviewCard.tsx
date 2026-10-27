import { Star } from "lucide-react";
import type { GoogleReview } from "@/lib/google-reviews";

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

export function ReviewCard({ review }: { review: GoogleReview }) {
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
          // Google profile photos use several hosts, so a plain image avoids a failed optimizer taking down the section.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={review.authorPhoto} alt="" width={40} height={40} className="h-10 w-10 rounded-full object-cover" />
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
