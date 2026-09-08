"use client";

import { useState } from "react";
import { submitCardLead } from "./actions";
import styles from "./page.module.css";

/* TODO(compliance): same gap as src/components/ContactForm.tsx — this also
   writes PII into funnel_leads, and should link to a reviewed privacy notice
   before this form is put in front of real people. */
export default function CardExchangeForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    setSubmitting(true);
    setError(null);

    const result = await submitCardLead({
      name: String(form.get("name") || ""),
      phone: String(form.get("phone") || ""),
      email: String(form.get("email") || ""),
    });

    setSubmitting(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    setSubmitted(true);
  }

  return (
    <div className={styles.exchangeCard}>
      <p className={styles.exchangeTitle}>Let&apos;s stay in touch</p>
      {submitted ? (
        <p className={styles.exchangeSuccess}>Thanks. I&apos;ll reach out soon.</p>
      ) : (
        <form className={styles.exchangeForm} onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="card-exchange-name">
            Your name
          </label>
          <input
            id="card-exchange-name"
            type="text"
            name="name"
            placeholder="Your name"
            required
            className={styles.exchangeInput}
          />
          <span className={styles.exchangeNote}>Phone or email (at least one)</span>
          <label className="sr-only" htmlFor="card-exchange-phone">
            Your phone number
          </label>
          <input
            id="card-exchange-phone"
            type="tel"
            name="phone"
            placeholder="Phone number"
            className={styles.exchangeInput}
          />
          <label className="sr-only" htmlFor="card-exchange-email">
            Your email
          </label>
          <input
            id="card-exchange-email"
            type="email"
            name="email"
            placeholder="Email address"
            className={styles.exchangeInput}
          />
          {error && (
            <span role="alert" className={styles.exchangeError}>
              {error}
            </span>
          )}
          <button type="submit" className={styles.exchangeButton} disabled={submitting}>
            {submitting ? "Sending…" : "Send me your info"}
          </button>
          <span className={styles.exchangeNote}>
            Your details are used only so Jojo can follow up with you directly.
          </span>
        </form>
      )}
    </div>
  );
}
