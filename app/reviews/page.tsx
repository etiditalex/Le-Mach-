import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReviewsList from "@/components/ReviewsList";
import { getGoogleReviews, writeReviewUrl } from "@/lib/google-reviews";

export default async function ReviewsPage() {
  const data = await getGoogleReviews();
  const ratingLabel = data?.rating != null ? data.rating.toFixed(1).replace(/\.0$/, "") : null;
  const mapsUri =
    data?.mapsUri ?? "https://search.google.com/local/reviews?placeid=ChIJZxS0YlndPxgR7J9i7YQwT_g";
  const writeReviewUri = data?.writeReviewUri ?? writeReviewUrl();

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
            <ReviewsList reviews={data.reviews} reviewCount={data.reviewCount} mapsUri={mapsUri} />
          ) : (
            <p className="mx-auto mt-10 max-w-xl text-center text-sm leading-relaxed text-[#5A5A5A]">
              Google reviews will appear here once the Places API key is available to the site.
            </p>
          )}

          <section className="mx-auto mt-14 max-w-3xl border border-[#E7E1D8] bg-white px-6 py-10 text-center sm:mt-16 sm:px-10 sm:py-12">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#C99700] sm:text-xs">
              Google
            </p>
            <h2 className="mt-3 font-serif text-4xl font-medium leading-tight text-[#1C2430] sm:text-5xl">
              Leave your review
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[#5A5A5A] sm:text-base">
              Stayed at Lemach? Share your experience on Google so other guests can read it.
            </p>
            <a
              href={writeReviewUri}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex min-h-11 items-center justify-center bg-primary px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-primary-dark"
            >
              Leave your review
            </a>
          </section>

          <div className="mt-10 flex justify-center">
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
