import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export const metadata = pageMetadata({
  title: "Disclaimer",
  description:
    "This is the personal website of Jojo Cruzado, a Sun Life Financial Advisor. It is not the official corporate website of Sun Life Philippines.",
  path: "/disclaimer",
});

export default function DisclaimerPage() {
  return (
    <main className="band-white">
      <div className={`container-prose ${styles.prose}`}>
        <h1 className={styles.title}>Disclaimer</h1>

        {/* Required verbatim: the advisor/corporate distinction (handoff README). */}
        <p className={styles.body}>
          This is the personal website of Jojo Cruzado, a Sun Life Financial Advisor. It is not the
          official corporate website of Sun Life Philippines. Product information, where discussed,
          should be verified against official Sun Life materials and applicable policy contracts,
          prospectuses or other governing documents.
        </p>

        {/* Required verbatim: the Safety Margin educational framing (handoff README). */}
        <p className={styles.body}>
          Nothing on this site guarantees returns, claims acceptance, policy benefits, investment
          performance, future value or coverage eligibility. The Safety Margin check is an
          educational assessment and a starting point for a conversation, not formal financial
          advice.
        </p>

        <p className={styles.body}>
          See the separate <Link href="/privacy">privacy notice</Link> for how information submitted
          through this site is collected and used, and the <Link href="/terms">terms of use</Link>{" "}
          for the rules governing use of this site.
        </p>
      </div>
    </main>
  );
}
