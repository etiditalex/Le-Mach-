import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { ROOMS_BUCKET } from "@/lib/storage/rooms-bucket";
import { uploadPublicImage } from "@/lib/storage/upload-public-image";

export const runtime = "nodejs";

/** Multipart upload: field `file` — returns public URL for room image. */
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

  const result = await uploadPublicImage(
    ROOMS_BUCKET,
    file,
    "room",
    "rooms storage bucket migration"
  );
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({ url: result.url, path: result.path });
}
