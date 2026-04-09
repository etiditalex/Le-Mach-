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

/** Parse one or many YouTube links/IDs from free text input. */
export function youtubeVideoIdsFromInput(input: string): string[] {
  const tokens = input
    .split(/[\s,;]+/)
    .map((t) => t.trim())
    .filter(Boolean);
  const ids: string[] = [];
  for (const token of tokens) {
    const id = youtubeVideoIdFromInput(token);
    if (!id) continue;
    if (!ids.includes(id)) ids.push(id);
  }
  return ids;
}

/** Embed URL for digital signage: autoplay with optional playlist. */
export function youtubeSignageEmbedUrl(videoId: string, playlistVideoIds: string[] = []): string {
  const q = new URLSearchParams({
    autoplay: "1",
    playsinline: "1",
    rel: "0",
    modestbranding: "1",
    controls: "1",
  });
  if (playlistVideoIds.length > 1) {
    q.set("loop", "0");
    q.set("playlist", playlistVideoIds.join(","));
  } else {
    q.set("loop", "1");
    q.set("playlist", videoId);
  }
  return `https://www.youtube-nocookie.com/embed/${videoId}?${q.toString()}`;
}
