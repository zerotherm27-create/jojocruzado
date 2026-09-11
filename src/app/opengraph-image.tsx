import { ImageResponse } from "next/og";
import { BrandCard, resolveCardImageSrc, size, contentType } from "@/lib/ogImage";

export { size, contentType };
export const alt = "Jojo Cruzado, Sun Life Financial Advisor";
// Keeps this in sync with whatever photo is set as the site's hero image
// (matches the homepage's own revalidate window) instead of caching
// indefinitely as a static route.
export const revalidate = 60;

export default async function Image() {
  const imageSrc = await resolveCardImageSrc();
  return new ImageResponse(<BrandCard imageSrc={imageSrc} />, { ...size });
}
