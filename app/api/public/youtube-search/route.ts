import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type YouTubeSearchResponse = {
  items?: { id?: { videoId?: string } }[];
  error?: { message?: string };
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) {
    return NextResponse.json({ error: "Enter at least 2 characters to search." }, { status: 400 });
  }

  const key = process.env.YOUTUBE_DATA_API_KEY?.trim();
  if (!key) {
    return NextResponse.json(
      {
        error:
          "YouTube search needs YOUTUBE_DATA_API_KEY in your server environment (Vercel project env). Create a key in Google Cloud Console with YouTube Data API v3 enabled.",
      },
      { status: 503 }
    );
  }

  const url = new URL("https://www.googleapis.com/youtube/v3/search");
  url.searchParams.set("part", "snippet");
  url.searchParams.set("type", "video");
  url.searchParams.set("videoEmbeddable", "true");
  url.searchParams.set("maxResults", "10");
  url.searchParams.set("safeSearch", "moderate");
  url.searchParams.set("q", q);
  url.searchParams.set("key", key);

  let res: Response;
  try {
    res = await fetch(url.toString(), { cache: "no-store" });
  } catch {
    return NextResponse.json({ error: "Network error talking to YouTube." }, { status: 502 });
  }

  const data = (await res.json()) as YouTubeSearchResponse;

  if (!res.ok) {
    const msg = data.error?.message ?? "YouTube search request failed.";
    return NextResponse.json({ error: msg }, { status: 502 });
  }

  const videoIds = (data.items ?? [])
    .map((i) => i.id?.videoId)
    .filter((id): id is string => typeof id === "string" && /^[a-zA-Z0-9_-]{11}$/.test(id));

  if (videoIds.length === 0) {
    return NextResponse.json({ error: "No playable videos found for that search." }, { status: 404 });
  }

  return NextResponse.json(
    { videoIds },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );
}
