/**
 * Guest reviews from the Le Mach Hotel Google Business Profile.
 * Places API (New) returns the reviews Google shows on that profile.
 * https://developers.google.com/maps/documentation/places/web-service/place-details
 */

const DEFAULT_PLACE_ID = "ChIJZxS0YlndPxgR7J9i7YQwT_g";

export type GoogleReview = {
  id: string;
  author: string;
  authorUri: string | null;
  authorPhoto: string | null;
  rating: number;
  text: string;
  relativeTime: string;
  reviewUri: string | null;
};

export type GoogleReviews = {
  rating: number | null;
  reviewCount: number | null;
  mapsUri: string | null;
  reviews: GoogleReview[];
};

type PlacesReview = {
  name?: string;
  relativePublishTimeDescription?: string;
  rating?: number;
  text?: { text?: string };
  originalText?: { text?: string };
  authorAttribution?: {
    displayName?: string;
    uri?: string;
    photoUri?: string;
  };
  googleMapsUri?: string;
  publishTime?: string;
};

type PlacesResponse = {
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: PlacesReview[];
};

function placeId(): string {
  return process.env.GOOGLE_PLACE_ID?.trim() || DEFAULT_PLACE_ID;
}

export async function getGoogleReviews(): Promise<GoogleReviews | null> {
  const key = process.env.GOOGLE_PLACES_API_KEY?.trim();
  if (!key) return null;

  const url = new URL(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId())}`);
  url.searchParams.set("languageCode", "en");

  let response: Response;
  try {
    response = await fetch(url, {
      headers: {
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": "rating,userRatingCount,googleMapsUri,reviews",
      },
      next: { revalidate: 60 * 60 * 6 },
    });
  } catch (error) {
    console.error("Google reviews request failed", error);
    return null;
  }

  if (!response.ok) {
    console.error("Google reviews request failed", response.status);
    return null;
  }

  const data = (await response.json()) as PlacesResponse;
  const reviews = (data.reviews ?? [])
    .map((review, index): GoogleReview | null => {
      const author = review.authorAttribution?.displayName?.trim();
      const text = review.text?.text?.trim() || review.originalText?.text?.trim() || "";
      if (!author || !text) return null;
      const rating = Math.max(1, Math.min(5, Math.round(review.rating ?? 0)));
      return {
        id: review.name || review.publishTime || `${author}-${index}`,
        author,
        authorUri: review.authorAttribution?.uri ?? null,
        authorPhoto: review.authorAttribution?.photoUri ?? null,
        rating,
        text,
        relativeTime: review.relativePublishTimeDescription?.trim() || "",
        reviewUri: review.googleMapsUri ?? null,
      };
    })
    .filter((review): review is GoogleReview => review !== null);

  if (reviews.length === 0) return null;

  return {
    rating: typeof data.rating === "number" ? data.rating : null,
    reviewCount: typeof data.userRatingCount === "number" ? data.userRatingCount : null,
    mapsUri: data.googleMapsUri ?? `https://search.google.com/local/reviews?placeid=${placeId()}`,
    reviews,
  };
}
