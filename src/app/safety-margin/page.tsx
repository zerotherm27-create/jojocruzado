import type { Metadata } from "next";
import Link from "next/link";
import { SAFETY_MARGIN_URL } from "@/config/site";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Safety Margin",
  description:
    "Safety Margin is a simple way to look at the important parts of your financial foundation and identify areas that may deserve more attention.",
};

const explainers = [
  {
    title: "What you'll look at",
    body: "Cash flow, emergency reserves, health and protection, long-term goals and growth — the five parts of the framework.",
  },
  {
    title: "What happens after",
    body: "You get a snapshot of where things stand. If you'd like to talk it through, Jojo can follow up using the contact details you provide.",
  },
  {
    title: "What is collected",
    // TODO(compliance): confirm the exact fields, retention period and processors.
    body: "Placeholder: confirm the exact fields collected, retention period and processors before launch. No sensitive financial details are requested to begin.",
  },
  {
    title: "How it is treated",
    body: "This is an educational assessment and a starting point for a conversation — a financial snapshot, not a formal recommendation.",
  },
];

const faqs = [
  {
    question: "Do I need to buy anything after the consultation?",
    answer:
      "The conversation should focus first on understanding your situation. Any recommendation should only come after your needs and priorities are clearer.",
  },
  {
    question: "What is Safety Margin?",
    answer:
      "Safety Margin is an educational financial assessment designed to help you look at the important parts of your financial foundation and identify areas worth reviewing.",
  },
  {
    question: "Do you only work with existing Sun Life clients?",
    answer:
      "No. Jojo can speak with people who are exploring their financial priorities as well as existing clients, subject to applicable company processes.",
  },
  {
    question: "Can you review insurance I already have?",
    answer:
      "Jojo can help you organize and understand your current coverage and identify questions or potential gaps to review. Product-specific interpretation should rely on the actual policy contract and official documentation.",
  },
  {
    question: "Is the consultation free? Can we meet online?",
    // TODO(compliance): whether consultations are free and which meeting channels are
    // supported must be confirmed by Jojo before this answer is published.
    answer:
      "Placeholder: publish only after Jojo confirms current practice and the meeting channels he actually supports.",
  },
];

export default function SafetyMarginPage() {
  return (
    <main>
      <section className="band-navy">
        <div className={`container ${styles.hero}`}>
          <span className="eyebrow" style={{ color: "var(--accent)" }}>
            Safety Margin
          </span>
          <h1 className={`h1-sub ${styles.heroTitle}`}>
            Before choosing a financial solution, understand your financial picture.
          </h1>
          <p className={`lead ${styles.heroLead}`}>
            Safety Margin is a simple way to look at the important parts of your financial
            foundation and identify areas that may deserve more attention.
          </p>
          <Link href={SAFETY_MARGIN_URL} className={`btn btn-gold ${styles.heroCta}`}>
            Start My Safety Margin Check
          </Link>
          {/* Required verbatim: the Safety Margin educational framing (handoff README). */}
          <span className={styles.heroNote}>
            Educational assessment. Not formal financial advice.
          </span>
          {/* Not required by the handoff — added so the same-tab domain change on click
              isn't a surprise. Easy to remove if unwanted. */}
          <span className={styles.heroNote}>You&apos;ll continue at safetymargin.app.</span>
        </div>
      </section>

      <section className="band-white">
        <div className={`container autogrid ${styles.explainers}`}>
          {explainers.map((explainer) => (
            <div key={explainer.title} className={styles.explainer}>
              <h2 className="h2-column">{explainer.title}</h2>
              <p className={styles.explainerBody}>{explainer.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="band-surface-top">
        <div className={`container ${styles.faq}`}>
          <h2 className="h2-band">Common questions</h2>
          <div className={styles.faqList}>
            {faqs.map((faq) => (
              <details key={faq.question} className={styles.item}>
                <summary className={styles.question}>{faq.question}</summary>
                <p className={styles.answer}>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
