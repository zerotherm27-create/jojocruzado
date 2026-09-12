import { ImageResponse } from "next/og";
import { BrandCard, resolveCardImageSrc, size, contentType } from "@/lib/ogImage";

export { size, contentType };
export const alt = "Jojo Cruzado, Sun Life Financial Advisor";
export const revalidate = 60;

export default async function Image() {
  const imageSrc = await resolveCardImageSrc();
  return new ImageResponse(
    <BrandCard imageSrc={imageSrc} tagline="Share your experience working with me." />,
    { ...size },
  );
}
