import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { requireAdminApi } from "@/lib/admin-auth";
import { getServiceSupabase } from "@/lib/supabase/service";
import { BAR_BRANDS_BUCKET } from "@/lib/storage/bar-brands-bucket";

export const runtime = "nodejs";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

const extFromMime: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

/** Multipart upload: field `file` — returns public URL for bar brand image. */
export async function POST(req: Request) {
  const auth = await requireAdminApi();
  if (auth instanceof NextResponse) return auth;

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Expected multipart form data" }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file field required" }, { status: 400 });
  }

  const type = file.type || "application/octet-stream";
  if (!ALLOWED.has(type)) {
    return NextResponse.json({ error: "Invalid type; use JPEG, PNG, WebP, or GIF" }, { status: 400 });
  }

  const buf = Buffer.from(await file.arrayBuffer());
  if (buf.length > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 5 MB)" }, { status: 400 });
  }

  const ext = extFromMime[type] || "bin";
  const path = `brand-${randomUUID()}.${ext}`;

  const sb = getServiceSupabase();
  const { error: upErr } = await sb.storage.from(BAR_BRANDS_BUCKET).upload(path, buf, {
    contentType: type,
    upsert: false,
  });

  if (upErr) {
    console.error(upErr);
    return NextResponse.json(
      { error: upErr.message || "Upload failed — ensure bar-brands bucket migration ran in Supabase." },
      { status: 400 }
    );
  }

  const {
    data: { publicUrl },
  } = sb.storage.from(BAR_BRANDS_BUCKET).getPublicUrl(path);

  return NextResponse.json({ url: publicUrl, path });
}
