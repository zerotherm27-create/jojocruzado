import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: { absolute: "Jojo Cruzado: Digital Business Card" },
  description: "Save Jojo Cruzado's contact details or send him yours.",
  // A contact-card utility meant to be reached via an NFC tap or a direct
  // link, not to rank in search results — same reasoning /admin already
  // applies to itself.
  robots: { index: false, follow: true },
};

/* Deliberately just a pass-through, like src/app/admin/layout.tsx — the
   public site's header/footer/sticky CTA live in src/app/(site)/layout.tsx,
   so this route (outside that group) renders without any of it. The root
   layout (src/app/layout.tsx) still supplies fonts and the --accent CSS var. */
export default function CardLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
