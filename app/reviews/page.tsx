import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ReviewCard } from "@/components/GoogleReviews";
import { getGoogleReviews } from "@/lib/google-reviews";

export default async function ReviewsPage() {
  const data = await getGoogleReviews();
  const ratingLabel = data?.rating != null ? data.rating.toFixed(1).replace(/\.0$/, "") : null;
  const mapsUri =
    data?.mapsUri ?? "https://search.google.com/local/reviews?placeid=ChIJZxS0YlndPxgR7J9i7YQwT_g";

  return (
    <main className="min-h-screen bg-[#F7F4EE]">
      <Header />
      <section className="px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32 lg:pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#C99700] sm:text-xs">
              Guest reviews
            </p>
            <h1 className="mt-4 font-serif text-[2.4rem] font-medium leading-[1.05] text-[#1C2430] sm:text-5xl lg:text-[3.35rem]">
              Testimonials/Reviews
            </h1>
            {ratingLabel ? (
              <p className="mt-5 text-base text-[#5A5A5A] sm:text-lg">
                <span className="font-serif text-4xl font-medium text-primary sm:text-5xl">{ratingLabel}</span>
                <span className="mt-1 block">
                  out of 5
                  {data?.reviewCount ? ` from ${data.reviewCount} Google reviews` : " on Google"}
                </span>
              </p>
            ) : (
              <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-[#5A5A5A] sm:text-base">
                Reviews from guests on the Lemach Hotel Google listing.
              </p>
            )}
          </div>

          {data && data.reviews.length > 0 ? (
            <ul className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 md:grid-cols-2 lg:gap-5">
              {data.reviews.map((review) => (
                <li key={review.id} className="h-full">
                  <ReviewCard review={review} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="mx-auto mt-10 max-w-xl text-center text-sm leading-relaxed text-[#5A5A5A]">
              Google reviews will appear here once the Places API key is available to the site.
            </p>
          )}

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            <a
              href={mapsUri}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center bg-primary px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-primary-dark"
            >
              See all Google reviews
            </a>
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
      <Footer />
    </main>
  );
}
