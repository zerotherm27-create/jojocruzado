import type { Metadata } from "next";
import Link from "next/link";
import { needs } from "@/content/needs";
import { SAFETY_MARGIN_URL } from "@/config/site";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "How I Help",
  description:
    "These are the areas we usually look at together. Which ones matter most depends entirely on where you are right now.",
};

export default function HowIHelpPage() {
  return (
    <main>
      <section className="band-navy">
        <div className={`container ${styles.hero}`}>
          <span className="eyebrow" style={{ color: "var(--accent)" }}>
            How I help
          </span>
          <h1 className={`h1-sub ${styles.heroTitle}`}>Organized around needs, not products.</h1>
          <p className={`lead ${styles.heroLead}`}>
            These are the areas we usually look at together. Which ones matter most depends entirely
            on where you are right now.
          </p>
        </div>
      </section>

      <section className="band-white">
        <div className={`container autogrid ${styles.cards}`}>
          {needs.map((need) => (
            <div key={need.id} className={styles.card}>
              <h2 className={styles.cardTitle}>{need.title}</h2>
              <p className={`body ${styles.cardBody}`}>{need.body}</p>
              <span className={styles.cardNote}>
                The right priority depends on your current situation.
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="band-surface-top">
        <div className={`container ${styles.closing}`}>
          <p className={styles.closingText}>
            Not sure which of these applies to you? That&apos;s what the check is for.
          </p>
          <Link href={SAFETY_MARGIN_URL} className="btn btn-gold">
            Check My Safety Margin
          </Link>
          {/* Quiet reference only. The eight need-categories above stay the structure of
              this page; product material sits one link away, never in front of it. */}
          <p className={styles.materialNote}>
            If you would rather read Sun Life&apos;s own product material first,{" "}
            <Link href="/resources">it is here</Link>.
          </p>
        </div>
      </section>
    </main>
  );
}
