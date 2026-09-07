import type { SupabaseClient } from "@supabase/supabase-js";

const BUCKET = "site-media";

const ALLOWED_TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};

/* Sniffs the actual file bytes rather than trusting the client-supplied
   `file.type` header, which is trivially spoofable (a renamed .html or .svg can
   claim to be "image/png"). Only real raster images pass. */
function sniffImageType(bytes: Uint8Array): string | null {
  if (bytes.length >= 4 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
    return "image/png";
  }
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    bytes.length >= 12 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return "image/webp";
  }
  if (bytes.length >= 3 && bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) {
    return "image/gif";
  }
  return null;
}

/* Uploads a File to the public site-media bucket at `${folder}/${filename}.<ext>`
   — the extension is derived from the sniffed file content, NEVER from the
   client-supplied name or MIME type, and `filename` must be caller-chosen (a
   uuid or a fixed name like "hero"), never the browser's original filename.
   This closes a stored-XSS path: without it, an attacker could upload a
   .html/.svg file mislabeled as an image and have it served back, executing in
   the browser, from the same asset origin. `upsert: true` keeps re-uploads to a
   fixed name stable (no orphaned old files). Throws on anything that isn't a
   real PNG/JPEG/WEBP/GIF. */
export async function uploadImage(
  supabase: SupabaseClient,
  folder: string,
  filename: string,
  file: File,
): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const sniffed = sniffImageType(buffer);

  if (!sniffed) {
    throw new Error("Only PNG, JPEG, WEBP, or GIF images are allowed.");
  }

  const path = `${folder}/${filename}.${ALLOWED_TYPES[sniffed]}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, { contentType: sniffed, upsert: true });

  if (error) {
    throw new Error(`uploadImage failed: ${error.message}`);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
