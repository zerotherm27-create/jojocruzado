import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: { absolute: "Share a Review: Jojo Cruzado" },
  description: "Share a short review of your experience working with Jojo Cruzado.",
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
