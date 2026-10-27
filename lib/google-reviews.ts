import { unstable_noStore as noStore } from "next/cache";

/**
 * Guest reviews from the Le Mach Hotel Google Business Profile.
 * Tries Places API (New), then the classic Place Details API.
 */

const DEFAULT_PLACE_ID = "ChIJZxS0YlndPxgR7J9i7YQwT_g";
const CACHE_MS = 60 * 60 * 6 * 1000;

const KEY_NAMES = [
  "GOOGLE_PLACES_API_KEY",
  "GOOGLE_MAPS_API_KEY",
  "GOOGLE_API_KEY",
  "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY",
  "NEXT_PUBLIC_GOOGLE_PLACES_API_KEY",
] as const;

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
  error?: { message?: string; status?: string };
};

type LegacyReview = {
  author_name?: string;
  author_url?: string;
  profile_photo_url?: string;
  rating?: number;
  relative_time_description?: string;
  text?: string;
  time?: number;
};

type LegacyResponse = {
  status?: string;
  error_message?: string;
  result?: {
    rating?: number;
    user_ratings_total?: number;
    url?: string;
    reviews?: LegacyReview[];
  };
};

let cached: { at: number; data: GoogleReviews } | null = null;

function placeId(): string {
  return process.env.GOOGLE_PLACE_ID?.trim() || DEFAULT_PLACE_ID;
}

function apiKey(): string | null {
  for (const name of KEY_NAMES) {
    const value = process.env[name]?.trim();
    if (value) return value;
  }
  return null;
}

function clampRating(rating: number | undefined): number {
  return Math.max(1, Math.min(5, Math.round(rating ?? 0)));
}

async function fromPlacesNew(key: string, id: string): Promise<GoogleReviews | null> {
  const url = new URL(`https://places.googleapis.com/v1/places/${encodeURIComponent(id)}`);
  url.searchParams.set("languageCode", "en");

  const response = await fetch(url, {
    headers: {
      "X-Goog-Api-Key": key,
      "X-Goog-FieldMask": "rating,userRatingCount,googleMapsUri,reviews",
    },
    cache: "no-store",
  });
  const data = (await response.json().catch(() => ({}))) as PlacesResponse;
  if (!response.ok) {
    console.error("Places API (New) reviews failed", response.status, data.error?.status, data.error?.message);
    return null;
  }

  const reviews = (data.reviews ?? [])
    .map((review, index): GoogleReview | null => {
      const author = review.authorAttribution?.displayName?.trim();
      const text = review.text?.text?.trim() || review.originalText?.text?.trim() || "";
      if (!author || !text) return null;
      return {
        id: review.name || review.publishTime || `${author}-${index}`,
        author,
        authorUri: review.authorAttribution?.uri ?? null,
        authorPhoto: review.authorAttribution?.photoUri ?? null,
        rating: clampRating(review.rating),
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
    mapsUri: data.googleMapsUri ?? `https://search.google.com/local/reviews?placeid=${id}`,
    reviews,
  };
}

function mergeReviews(...groups: Array<GoogleReviews | null>): GoogleReviews | null {
  const reviews: GoogleReview[] = [];
  const seen = new Set<string>();
  let rating: number | null = null;
  let reviewCount: number | null = null;
  let mapsUri: string | null = null;

  for (const group of groups) {
    if (!group) continue;
    if (rating === null) rating = group.rating;
    if (reviewCount === null) reviewCount = group.reviewCount;
    if (!mapsUri) mapsUri = group.mapsUri;
    for (const review of group.reviews) {
      const key = `${review.author.toLowerCase()}|${review.text.slice(0, 80).toLowerCase()}`;
      if (seen.has(key)) continue;
      seen.add(key);
      reviews.push(review);
    }
  }

  if (reviews.length === 0) return null;
  return { rating, reviewCount, mapsUri, reviews };
}

async function fromLegacyPlaces(
  key: string,
  id: string,
  sort: "newest" | "most_relevant"
): Promise<GoogleReviews | null> {
  const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
  url.searchParams.set("place_id", id);
  url.searchParams.set("fields", "rating,user_ratings_total,url,reviews");
  url.searchParams.set("reviews_sort", sort);
  url.searchParams.set("language", "en");
  url.searchParams.set("key", key);

  const response = await fetch(url, { cache: "no-store" });
  const data = (await response.json().catch(() => ({}))) as LegacyResponse;
  if (!response.ok || data.status !== "OK") {
    console.error("Places API reviews failed", data.status, data.error_message);
    return null;
  }

  const reviews = (data.result?.reviews ?? [])
    .map((review, index): GoogleReview | null => {
      const author = review.author_name?.trim();
      const text = review.text?.trim() || "";
      if (!author || !text) return null;
      return {
        id: review.time ? String(review.time) : `${author}-${index}`,
        author,
        authorUri: review.author_url ?? null,
        authorPhoto: review.profile_photo_url ?? null,
        rating: clampRating(review.rating),
        text,
        relativeTime: review.relative_time_description?.trim() || "",
        reviewUri: review.author_url ?? null,
      };
    })
    .filter((review): review is GoogleReview => review !== null);

  if (reviews.length === 0) return null;
  return {
    rating: typeof data.result?.rating === "number" ? data.result.rating : null,
    reviewCount: typeof data.result?.user_ratings_total === "number" ? data.result.user_ratings_total : null,
    mapsUri: data.result?.url ?? `https://search.google.com/local/reviews?placeid=${id}`,
    reviews,
  };
}

export async function getGoogleReviews(): Promise<GoogleReviews | null> {
  noStore();
  if (cached && Date.now() - cached.at < CACHE_MS) return cached.data;

  const key = apiKey();
  if (!key) {
    console.error(
      "Google reviews are hidden because no API key was found. Set GOOGLE_PLACES_API_KEY (or GOOGLE_MAPS_API_KEY) on Vercel for Production, then redeploy."
    );
    return null;
  }

  const id = placeId();
  try {
    const [primary, newest, relevant] = await Promise.all([
      fromPlacesNew(key, id).catch(() => null),
      fromLegacyPlaces(key, id, "newest").catch(() => null),
      fromLegacyPlaces(key, id, "most_relevant").catch(() => null),
    ]);
    const data = mergeReviews(primary, relevant, newest);
    if (data) cached = { at: Date.now(), data };
    return data;
  } catch (error) {
    console.error("Google reviews request failed", error);
    return null;
  }
}
