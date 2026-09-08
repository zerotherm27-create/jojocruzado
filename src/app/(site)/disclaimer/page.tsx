import type { Metadata } from "next";
import Link from "next/link";
import { SAFETY_MARGIN_URL } from "@/config/site";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Disclaimer & Privacy",
  description:
    "This is the personal website of Jojo Cruzado, a Sun Life Financial Advisor. It is not the official corporate website of Sun Life Philippines.",
};

export default function DisclaimerPage() {
  return (
    <main className="band-white">
      <div className={`container-prose ${styles.prose}`}>
        <h1 className={styles.title}>Disclaimer &amp; privacy notice</h1>

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

        <h2 className={styles.subheading}>Privacy</h2>

        {/* DRAFT, written at Jojo's request from this site's actual implementation —
            not copied from Safety Margin's policy (handoff brief, section 46: "Do not
            copy a privacy policy from another website"). Two facts here are carried
            over from Safety Margin's own published policy because they are genuinely
            true of this form too, not because they were copied for convenience:
            retention (same data store) and the privacy contact address (same operator).
            Both are flagged inline below — confirm or change them before this counts as
            reviewed. This notice covers ONLY this site's own /contact form. The Safety
            Margin check has its own, separately linked, policy below. */}
        <p className={styles.body}>
          This notice covers the &quot;Book a Conversation&quot; form on this page. It does not cover
          the Safety Margin check, which has its own privacy policy, linked below.
        </p>

        <h3 className={styles.itemHeading}>Who collects it</h3>
        <p className={styles.body}>
          Jojo Cruzado collects the information submitted through this form, in his capacity as a
          Sun Life Financial Advisor operating this personal website.
        </p>

        <h3 className={styles.itemHeading}>What is collected</h3>
        <p className={styles.body}>
          First name, last name, email address, mobile number, the category you select under
          &quot;I am a,&quot; the topic you select under &quot;What would you like help with,&quot; and
          the optional message you write. The time you give consent is recorded alongside your
          submission.
        </p>

        <h3 className={styles.itemHeading}>Purpose</h3>
        <p className={styles.body}>
          Solely to let Jojo review your message and contact you back using the details you
          provided. It is not used for advertising, and it is not sold or shared for marketing
          purposes.
        </p>

        <h3 className={styles.itemHeading}>Consent</h3>
        <p className={styles.body}>
          Submitting this form requires checking the consent box above it. Nothing is collected or
          stored unless that box is checked at the time of submission.
        </p>

        <h3 className={styles.itemHeading}>Retention</h3>
        <p className={styles.body}>
          {/* TODO(compliance): carried over from Safety Margin's stated retention period for
              consistency, since this form writes into the same underlying database — not
              independently confirmed for contact-form submissions specifically. Confirm or
              adjust before treating this as final. */}
          Submissions are kept for 24 months from the date sent, after which they are deleted. You
          may request earlier deletion at any time. See &quot;Your rights,&quot; below.
        </p>

        <h3 className={styles.itemHeading}>Third-party processors</h3>
        <p className={styles.body}>
          Submissions are stored using Supabase, a cloud database provider, strictly to operate this
          form. Supabase does not receive your information for any purpose of its own.
        </p>

        <h3 className={styles.itemHeading}>Cookies &amp; analytics</h3>
        <p className={styles.body}>
          This site does not use cookies, analytics or cross-site tracking of any kind.
        </p>

        <h3 className={styles.itemHeading}>Cross-border processing</h3>
        <p className={styles.body}>
          Because Supabase operates cloud infrastructure, your information may be processed on
          servers located outside the Philippines.
        </p>

        <h3 className={styles.itemHeading}>Your rights</h3>
        <p className={styles.body}>
          Under the Philippine Data Privacy Act of 2012 (Republic Act No. 10173), you may request
          access to the data held about you, ask for corrections, request its deletion or blocking,
          object to its processing, request a portable copy of it, or withdraw your consent at any
          time. You may also lodge a complaint with the National Privacy Commission at
          privacy.gov.ph.
        </p>

        <h3 className={styles.itemHeading}>Contact</h3>
        <p className={styles.body}>
          {/* TODO(compliance): reusing Safety Margin's real, working privacy inbox since Jojo
              operates both — confirm this is the address he wants published here specifically,
              since this site is nominally distinct from safetymargin.app. */}
          For any request under &quot;Your rights,&quot; or any question about this notice, email{" "}
          <Link href="mailto:support@safetymargin.app">support@safetymargin.app</Link>. Expect a
          response within 15 business days.
        </p>

        {/* Scoped cross-reference — Safety Margin's own policy covers only that tool's own
            data (name, mobile, email, quiz answers) and explicitly excludes free-text
            responses, so it does not describe this form's fields (last name, role, topic,
            message). Kept separate rather than merged for that reason. */}
        <p className={styles.body}>
          If you completed the Safety Margin check, that separate submission is covered by Safety
          Margin&apos;s own{" "}
          <Link href={`${SAFETY_MARGIN_URL}/privacy`} target="_blank" rel="noopener noreferrer">
            privacy policy
          </Link>
          , <Link href={`${SAFETY_MARGIN_URL}/terms`} target="_blank" rel="noopener noreferrer">terms of use</Link>, and{" "}
          <Link
            href={`${SAFETY_MARGIN_URL}/data-deletion`}
            target="_blank"
            rel="noopener noreferrer"
          >
            data deletion policy
          </Link>
          .
        </p>

        <p className={styles.note}>
          This notice was drafted from the site&apos;s actual implementation, not copied from
          another site. It is a first draft, not a substitute for legal review — confirm the two
          items flagged above and have it reviewed against Philippine privacy requirements and any
          applicable Sun Life requirements before relying on it.
        </p>
      </div>
    </main>
  );
}
