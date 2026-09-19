import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export const metadata = pageMetadata({
  title: "Terms of Use",
  description: "Terms governing use of this website.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <main className="band-white">
      <div className={`container-prose ${styles.prose}`}>
        <h1 className={styles.title}>Terms of use</h1>

        {/* DRAFT, written from this site's actual implementation (a marketing site with one
            contact form and no accounts, purchases or user-generated content beyond
            testimonials). Generic boilerplate only — deliberately does not assert anything
            that would need Jojo's or compliance's sign-off (license numbers, liability caps,
            registered business details). Not a substitute for legal review; see the note at
            the end of the page. */}
        <p className={styles.body}>
          By using this website, you agree to these terms. If you do not agree, please do not use
          this site.
        </p>

        <h2 className={styles.itemHeading}>About this site</h2>
        <p className={styles.body}>
          This site is the personal website of Jojo Cruzado, a Sun Life Financial Advisor. As
          explained on the <Link href="/disclaimer">disclaimer page</Link>, it is not the official
          corporate website of Sun Life Philippines, and nothing on it is formal financial advice or
          a guarantee of returns, claims acceptance, policy benefits, investment performance, future
          value or coverage eligibility.
        </p>

        <h2 className={styles.itemHeading}>Use of this site</h2>
        <p className={styles.body}>
          You may browse this site and use its forms for their intended purpose, such as requesting
          a conversation or submitting a testimonial. You agree not to use the site for any unlawful
          purpose, to attempt to disrupt or gain unauthorized access to it, or to submit false,
          misleading or infringing content through its forms.
        </p>

        <h2 className={styles.itemHeading}>Content and intellectual property</h2>
        <p className={styles.body}>
          The text, layout and design of this site belong to Jojo Cruzado unless otherwise noted.
          You may view and share pages of this site for personal, non-commercial purposes, but may
          not reproduce, republish or modify its content without permission.
        </p>

        <h2 className={styles.itemHeading}>Testimonials</h2>
        <p className={styles.body}>
          Testimonials published on this site reflect individual experiences and opinions. They are
          not a guarantee that you will have a similar experience or outcome.
        </p>

        <h2 className={styles.itemHeading}>Third-party links</h2>
        <p className={styles.body}>
          This site links to third-party resources, including the separate Safety Margin tool and
          official Sun Life materials. Those resources have their own terms and policies, which this
          site does not control and is not responsible for.
        </p>

        <h2 className={styles.itemHeading}>No warranty</h2>
        <p className={styles.body}>
          This site is provided as is. While reasonable care is taken to keep its content accurate
          and up to date, no warranty is made that it is complete, error-free or uninterrupted.
        </p>

        <h2 className={styles.itemHeading}>Privacy</h2>
        <p className={styles.body}>
          Use of this site is also governed by the <Link href="/privacy">privacy notice</Link>,
          which explains how information submitted through its forms is collected and used.
        </p>

        <h2 className={styles.itemHeading}>Changes to these terms</h2>
        <p className={styles.body}>
          These terms may be updated from time to time. Continuing to use the site after a change is
          posted means you accept the updated terms.
        </p>

        <h2 className={styles.itemHeading}>Governing law</h2>
        <p className={styles.body}>
          These terms are governed by the laws of the Republic of the Philippines.
        </p>

        <h2 className={styles.itemHeading}>Contact</h2>
        <p className={styles.body}>
          Questions about these terms can be sent using the same contact address listed on the{" "}
          <Link href="/privacy">privacy notice</Link>.
        </p>

        <p className={styles.note}>
          {/* TODO(compliance): generic boilerplate, not tailored legal advice. Have this
              reviewed against Philippine requirements and any applicable Sun Life requirements
              before relying on it. */}
          This is a first draft of general terms of use, not a substitute for legal review. Confirm
          it against Philippine requirements and any applicable Sun Life requirements before relying
          on it.
        </p>
      </div>
    </main>
  );
}
