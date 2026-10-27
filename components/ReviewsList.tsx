"use client";

import { useState } from "react";
import { ReviewCard } from "@/components/GoogleReviewCard";
import type { GoogleReview } from "@/lib/google-reviews";

const PAGE_SIZE = 15;

export default function ReviewsList({
  reviews,
  reviewCount,
  mapsUri,
}: {
  reviews: GoogleReview[];
  reviewCount: number | null;
  mapsUri: string | null;
}) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const visible = reviews.slice(0, visibleCount);
  const hasMoreHere = visibleCount < reviews.length;
  const total = reviewCount && reviewCount > reviews.length ? reviewCount : reviews.length;
  const hasMoreOnGoogle = !hasMoreHere && Boolean(mapsUri) && total > visible.length;

  return (
    <div className="mt-10 sm:mt-12">
      <p className="text-center text-sm text-[#5A5A5A]">
        Showing {visible.length} of {total} Google reviews
      </p>
      <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5">
        {visible.map((review) => (
          <li key={review.id} className="h-full">
            <ReviewCard review={review} />
          </li>
        ))}
      </ul>
      {hasMoreHere ? (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
            className="inline-flex min-h-11 items-center justify-center border border-primary bg-white px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-primary transition-colors hover:bg-primary hover:text-white"
          >
            More reviews
          </button>
        </div>
      ) : null}
      {hasMoreOnGoogle && mapsUri ? (
        <div className="mt-8 flex justify-center">
          <a
            href={mapsUri}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center border border-primary bg-white px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-primary transition-colors hover:bg-primary hover:text-white"
          >
            More reviews
          </a>
        </div>
      ) : null}
    </div>
  );
}
