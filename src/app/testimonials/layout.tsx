import type { Metadata } from "next";
import type { ReactNode } from "react";

// Title/description/openGraph/twitter now come from the page's own
// generateMetadata (src/app/testimonials/[shareSlug]/page.tsx), which has
// access to the actual shareSlug for a correct og:url and a dedicated
// photo-based image -- a layout-level metadata object with no openGraph of
// its own caused the ENTIRE parent (root) openGraph object to be inherited
// wholesale, including the wrong URL and generic homepage image.
export const metadata: Metadata = {
  // A link shared directly with clients, not meant to rank in search or be
  // browsed to from elsewhere on the site — same reasoning /card already
  // applies to itself.
  robots: { index: false, follow: true },
};

/* Deliberately just a pass-through, like src/app/card/layout.tsx — the public
   site's header/footer/sticky CTA live in src/app/(site)/layout.tsx, so this
   route (outside that group) renders without any of it. */
export default function TestimonialsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
