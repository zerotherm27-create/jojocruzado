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

const DESCRIPTION =
  "I help professionals, families, and business owners understand their financial picture, see what may need attention, and make practical decisions without feeling pressured.";

// Em dash fixed to a colon here to match this site's standing "no em dashes
// in user-facing content" rule -- missed in the original sitewide sweep
// since metadata isn't visible page copy, but it still renders in the
// browser tab, search results, and social share cards.
export const metadata: Metadata = {
  metadataBase: new URL("https://jojocruzado.safetymargin.app"),
  title: {
    default: "Jojo Cruzado: Sun Life Financial Advisor",
    template: "%s: Jojo Cruzado",
  },
  description: DESCRIPTION,
  openGraph: {
    title: "Jojo Cruzado: Sun Life Financial Advisor",
    description: DESCRIPTION,
    url: "/",
    siteName: "Jojo Cruzado",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jojo Cruzado: Sun Life Financial Advisor",
    description: DESCRIPTION,
  },
};

// Minimal, static Person schema -- only facts already stated as plain page
// copy elsewhere on the site (name, job title, description, URL). No
// contact details, credentials, or claims about Sun Life itself, per this
// project's standing rule against inventing compliance-sensitive content.
const PERSON_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Jojo Cruzado",
  jobTitle: "Sun Life Financial Advisor",
  description: DESCRIPTION,
  url: "https://jojocruzado.safetymargin.app",
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
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_JSON_LD) }}
        />
        {children}
      </body>
    </html>
  );
}
