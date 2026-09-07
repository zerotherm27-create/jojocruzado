/* Client-only: downscales and re-encodes an image File as JPEG before it ever
   leaves the browser. Real phone photos routinely run 5-15MB+ at full
   resolution, which crashed the Site Settings form's Server Action (a 413 —
   the body was too large even after raising Next's own limit). Shrinking to a
   sane display size here fixes that at the root instead of chasing ever-larger
   body-size limits. */
export async function resizeImageFile(
  file: File,
  maxDimension = 1600,
  quality = 0.85,
): Promise<File> {
  const bitmap = await createImageBitmap(file);

  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) return file;

  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob: Blob | null = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", quality),
  );
  if (!blob) return file;

  const newName = file.name.replace(/\.[^.]+$/, "") + ".jpg";
  return new File([blob], newName, { type: "image/jpeg" });
}
