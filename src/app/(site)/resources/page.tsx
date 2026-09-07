import type { Metadata } from "next";
import Link from "next/link";
import ArtcardGrid, { type Artcard } from "@/components/ArtcardDialog";
import { needs } from "@/content/needs";
import { SAFETY_MARGIN_URL } from "@/config/site";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Sun Life Material",
  description:
    "Different priorities call for different plans. Sun Life's own product material, organized by what it's for.",
};

/* TODO(compliance) — BLOCKING, do not publish this route until all four are resolved:
   1. Jojo must confirm IN WRITING that these artcards are approved for use on a personal
      WEBSITE. Artcards are normally issued for advisors' social media, and approval for
      one channel is not approval for another (handoff brief, section 10: trademarks may
      be used "only in ways approved under applicable Sun Life brand/compliance
      requirements").
   2. The real artcard files, their product names, and their issue dates must come from
      Jojo. None of it may be invented — the placeholders below are neutral grey slots
      and contain no Sun Life branding of any kind.
   3. Rate/payout figures: if any real artcard shows a specific rate, payout percentage or
      peso amount (e.g. "4.95% Annual Payout", "EARN ₱495,000"), confirm with Jojo that
      figure is still current and that this specific card is cleared for open web display,
      not only social. Section 10 forbids implying guarantees about returns, investment
      performance or future value — a stale rate on a website is the advisor's exposure.
   4. Set a review cadence. A superseded artcard on a website persists in a way a social
      post does not; the visible issue date on each card exists so staleness is auditable. */
const artcards: Artcard[] = [
  { id: "artcard-1", image: "/images/artcard-1.png", need: needs[1] },
  { id: "artcard-2", image: "/images/artcard-2.png", need: needs[2] },
  { id: "artcard-3", image: "/images/artcard-3.png", need: needs[4] },
];

export default function ResourcesPage() {
  return (
    <main>
      <section className="band-surface-bottom">
        <div className={`container ${styles.hero}`}>
          <span className="eyebrow" style={{ color: "var(--ink-500)" }}>
            Product material
          </span>
          <h1 className={`h1-sub ${styles.heroTitle}`}>Different priorities. Different plans.</h1>
          <p className={`lead ${styles.heroLead}`}>
            These are Sun Life&apos;s own materials, shared as published. Which one is relevant
            depends on your situation, your existing coverage and your priorities &mdash; and that
            is what a conversation is for.
          </p>
        </div>
      </section>

      <section className="band-white">
        <div className={`container ${styles.band}`}>
          <span className={`eyebrow ${styles.issuer}`}>Issued by Sun Life Philippines</span>

          <div className={styles.gridWrap}>
            <ArtcardGrid cards={artcards} />
          </div>
        </div>
      </section>

      <section className="band-surface-top">
        <div className={`container ${styles.closing}`}>
          {/* Required verbatim: the advisor/corporate distinction (handoff README).
              Matches the wording in SiteFooter.tsx and /disclaimer exactly. */}
          <p className={styles.disclaimer}>
            This is the personal website of Jojo Cruzado, a Sun Life Financial Advisor. It is not
            the official corporate website of Sun Life Philippines. Product information, where
            discussed, should be verified against official Sun Life materials and applicable policy
            contracts, prospectuses or other governing documents.
          </p>
          <div className={styles.ctaRow}>
            <Link href="/contact" className="btn btn-navy">
              Talk to Jojo
            </Link>
            <Link href={SAFETY_MARGIN_URL} className="btn btn-outline-light">
              Check My Safety Margin
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
