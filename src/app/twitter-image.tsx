import { ImageResponse } from "next/og";
import { BrandCard, size, contentType } from "@/lib/ogImage";

export { size, contentType };
export const alt = "Jojo Cruzado, Sun Life Financial Advisor";

export default function Image() {
  return new ImageResponse(<BrandCard />, { ...size });
}
