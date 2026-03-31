/** Extract 11-character YouTube video or live stream ID from URL or raw id. */
export function youtubeVideoIdFromInput(input: string): string | null {
  const u = input.trim();
  if (!u) return null;
  const fromUrl = u.match(
    /(?:youtube\.com\/(?:watch\?.*v=|embed\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (fromUrl?.[1]) return fromUrl[1];
  if (/^[a-zA-Z0-9_-]{11}$/.test(u)) return u;
  return null;
}

/** Embed URL for digital signage: autoplay muted (browser-safe), loop single video. */
export function youtubeSignageEmbedUrl(videoId: string): string {
  const q = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    playsinline: "1",
    rel: "0",
    modestbranding: "1",
    loop: "1",
    playlist: videoId,
  });
  return `https://www.youtube-nocookie.com/embed/${videoId}?${q.toString()}`;
}
