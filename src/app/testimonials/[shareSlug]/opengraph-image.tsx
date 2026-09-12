import { ImageResponse } from "next/og";
import { BrandCard, resolveCardImageSrc, size, contentType } from "@/lib/ogImage";

export { size, contentType };
export const alt = "Jojo Cruzado, Sun Life Financial Advisor";
// Keeps this in sync with whatever photo is set as the site's hero image,
// same as the sitewide default image.
export const revalidate = 60;

export default async function Image() {
  const imageSrc = await resolveCardImageSrc();
  return new ImageResponse(
    <BrandCard imageSrc={imageSrc} tagline="Share your experience working with me." />,
    { ...size },
  );
}
