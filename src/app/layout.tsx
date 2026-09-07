import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Inter, Manrope } from "next/font/google";
import { siteConfig } from "@/config/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jojocruzado.safetymargin.app"),
  title: {
    default: "Jojo Cruzado — Sun Life Financial Advisor",
    template: "%s — Jojo Cruzado",
  },
  description:
    "I help professionals, families, and business owners understand their financial picture, see what may need attention, and make practical decisions without feeling pressured.",
};

/* Deliberately just the <html>/<body> shell — the public site's nav/footer/sticky
   CTA live in src/app/(site)/layout.tsx instead, so /admin (outside that route
   group) renders with none of it. */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${manrope.variable}`}
      style={{ "--accent": siteConfig.accent } as CSSProperties}
    >
      <body>{children}</body>
    </html>
  );
}
