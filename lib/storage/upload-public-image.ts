import { randomUUID } from "crypto";
import { getServiceSupabase } from "@/lib/supabase/service";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

const extFromMime: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

type UploadOk = { url: string; path: string };
type UploadErr = { error: string; status: number };

/** Upload an image file to a public Supabase Storage bucket; returns public URL. */
export async function uploadPublicImage(
  bucket: string,
  file: File,
  pathPrefix: string,
  migrationHint: string
): Promise<UploadOk | UploadErr> {
  const type = file.type || "application/octet-stream";
  if (!ALLOWED.has(type)) {
    return { error: "Invalid type; use JPEG, PNG, WebP, or GIF", status: 400 };
  }

  const buf = Buffer.from(await file.arrayBuffer());
  if (buf.length > MAX_BYTES) {
    return { error: "File too large (max 5 MB)", status: 400 };
  }

  const ext = extFromMime[type] || "bin";
  const path = `${pathPrefix}-${randomUUID()}.${ext}`;

  const sb = getServiceSupabase();
  const { error: upErr } = await sb.storage.from(bucket).upload(path, buf, {
    contentType: type,
    upsert: false,
  });

  if (upErr) {
    console.error(upErr);
    return {
      error: upErr.message || `Upload failed — ensure ${migrationHint} ran in Supabase.`,
      status: 400,
    };
  }

  const {
    data: { publicUrl },
  } = sb.storage.from(bucket).getPublicUrl(path);

  return { url: publicUrl, path };
}
