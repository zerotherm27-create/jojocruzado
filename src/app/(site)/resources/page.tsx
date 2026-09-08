import Link from "next/link";
import ArtcardGrid from "@/components/ArtcardDialog";
import { SAFETY_MARGIN_URL } from "@/config/site";
import { getArtcards } from "@/lib/supabase/queries";
import Reveal from "@/components/Reveal";
import { pageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export const metadata = pageMetadata({
  title: "Sun Life Material",
  description:
    "Different priorities call for different plans. Sun Life's own product material, organized by what it's for.",
  path: "/resources",
});

// Revalidate so a card added/edited/removed in /admin -> Sun Life Artcards
// shows up here within a minute instead of needing a redeploy.
export const revalidate = 60;

export default async function ResourcesPage() {
  const artcards = await getArtcards();

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
            depends on your situation, your existing coverage and your priorities, and that
            is what a conversation is for.
          </p>
        </div>
      </section>

      <section className="band-white">
        <Reveal className={`container ${styles.band}`}>
          <h2 className="h2-band">Available material</h2>
          <span className={`eyebrow ${styles.issuer}`}>Issued by Sun Life Philippines</span>

          <div className={styles.gridWrap}>
            {artcards.length > 0 ? (
              <ArtcardGrid cards={artcards} />
            ) : (
              <p className={styles.empty}>Product material will be posted here soon.</p>
            )}
          </div>
        </Reveal>
      </section>

      <section className="band-surface-top">
        <Reveal className={`container ${styles.closing}`}>
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
            <Link href={SAFETY_MARGIN_URL} target="_blank" rel="noopener noreferrer" className="btn btn-outline-light">
              Check My Safety Margin
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
