import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Inter, Manrope } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import MobileStickyCta from "@/components/MobileStickyCta";
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

// Footer reads Sanity data (Connect column) on every page — revalidate so an edit
// in the Studio shows up within a minute instead of needing a redeploy.
export const revalidate = 60;

export const metadata: Metadata = {
  metadataBase: new URL("https://jojocruzado.safetymargin.app"),
  title: {
    default: "Jojo Cruzado — Sun Life Financial Advisor",
    template: "%s — Jojo Cruzado",
  },
  description:
    "I help professionals, families, and business owners understand their financial picture, see what may need attention, and make practical decisions without feeling pressured.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${manrope.variable}`}
      style={{ "--accent": siteConfig.accent } as CSSProperties}
    >
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <SiteHeader />
        <div id="main-content" tabIndex={-1}>
          {children}
        </div>
        <SiteFooter />
        <MobileStickyCta />
      </body>
    </html>
  );
}
