import Link from "next/link";
import { SAFETY_MARGIN_URL, MESSENGER_URL } from "@/config/site";
import styles from "./SiteFooter.module.css";

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={`autogrid ${styles.columns}`}>
          <div className={styles.identity}>
            <span className={styles.identityName}>JOJO CRUZADO</span>
            <span className={styles.identityRole}>Sun Life Financial Advisor</span>
            <p className={styles.tagline}>Clear Guidance. Practical Protection.</p>
            <span className={styles.byline}>by Safety Margin</span>
          </div>

          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Explore</h3>
            <Link href="/about" className={styles.link}>
              About
            </Link>
            <Link href="/how-i-help" className={styles.link}>
              How I Help
            </Link>
            <Link href="/insights" className={styles.link}>
              Insights
            </Link>
            <Link href="/resources" className={styles.link}>
              Sun Life
            </Link>
            <Link href={SAFETY_MARGIN_URL} className={styles.link}>
              Safety Margin
            </Link>
            <Link href="/contact" className={styles.link}>
              Book a Conversation
            </Link>
          </div>

          {/* TODO(compliance): LinkedIn, Instagram and a personal email are still
              unconfirmed — Jojo must confirm before these become links. Facebook is
              resolved below via the Messenger channel already live on safetymargin.app. */}
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Connect</h3>
            <Link
              href={MESSENGER_URL}
              className={styles.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook
            </Link>
            <span className={styles.pending}>LinkedIn &mdash; TBC</span>
            <span className={styles.pending}>Instagram &mdash; TBC</span>
            <span className={styles.pending}>Email &mdash; TBC</span>
          </div>

          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Important</h3>
            <Link href="/disclaimer" className={styles.link}>
              Privacy
            </Link>
            <Link href="/disclaimer" className={styles.link}>
              Terms
            </Link>
            <Link href="/disclaimer" className={styles.link}>
              Disclaimer
            </Link>
          </div>
        </div>

        {/* Required verbatim: the advisor/corporate distinction (handoff README). */}
        <p className={styles.disclaimer}>
          This is the personal website of Jojo Cruzado, a Sun Life Financial Advisor. It is not the
          official corporate website of Sun Life Philippines. Product information, where discussed,
          should be verified against official Sun Life materials and applicable policy contracts,
          prospectuses or other governing documents.
        </p>
      </div>
    </footer>
  );
}
