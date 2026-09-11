"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import { submitTestimonial } from "@/app/testimonials/[shareSlug]/actions";
import styles from "./TestimonialForm.module.css";

const RATINGS = [5, 4, 3, 2, 1];

const PROFESSIONS = [
  "Business Owner",
  "Entrepreneur",
  "Engineer",
  "Doctor",
  "Nurse",
  "Teacher",
  "Lawyer",
  "Accountant",
  "IT Professional",
  "OFW",
  "Employee",
  "Other",
];

export default function TestimonialForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    const clientName = String(form.get("clientName") || "").trim();
    const reviewBody = String(form.get("reviewBody") || "").trim();
    const rating = Number(form.get("rating") || 0);
    const consent = form.get("consent") === "on";

    if (!clientName || !reviewBody) {
      setError("Please fill in your name and a short review.");
      return;
    }
    if (!rating) {
      setError("Please select a rating.");
      return;
    }
    if (!consent) {
      setError("Please confirm you're okay with this being posted on the site.");
      return;
    }

    setError(null);
    setSubmitting(true);

    const result = await submitTestimonial({
      clientName,
      relationship: String(form.get("relationship") || ""),
      reviewBody,
      rating,
      consent,
      company: String(form.get("company") || ""),
    });

    setSubmitting(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className={styles.card}>
        <div className={styles.success}>
          <span className="rule-gold" />
          <h2 className={styles.title}>Thank you.</h2>
          <p className={styles.successBody}>
            Your review has been submitted and will appear on the site once Jojo has reviewed it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {/* Honeypot: hidden from real users (visually and via tabIndex/aria),
            most simple bots fill every field they find. Checked server-side. */}
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className={styles.honeypot}
        />

        <label className={styles.label}>
          Your name *
          <input type="text" name="clientName" autoComplete="name" required className={styles.input} />
        </label>

        <label className={styles.label}>
          Profession (optional)
          <select name="relationship" defaultValue="" className={styles.select}>
            <option value="" disabled>
              Select your profession
            </option>
            {PROFESSIONS.map((profession) => (
              <option key={profession} value={profession}>
                {profession}
              </option>
            ))}
          </select>
        </label>

        <div className={styles.label}>
          Overall, how was your experience working with Jojo? *
          <div className={styles.stars}>
            {/* Radios and labels are flat siblings (not nested) so the
                ":checked ~ label" CSS sibling-combinator below can reach
                every label after the checked input, not just its own. */}
            {RATINGS.map((value) => (
              <Fragment key={value}>
                <input type="radio" id={`rating-${value}`} name="rating" value={value} required />
                <label htmlFor={`rating-${value}`} className={styles.star}>
                  <span aria-hidden="true">★</span>
                  <span className="sr-only">{value} out of 5</span>
                </label>
              </Fragment>
            ))}
          </div>
        </div>

        <label className={styles.label}>
          Your review *
          <textarea
            name="reviewBody"
            rows={5}
            maxLength={600}
            placeholder="How was your experience working with Jojo?"
            required
            className={styles.textarea}
          />
        </label>

        <div className={styles.consentBlock}>
          <label className={styles.consent}>
            <input type="checkbox" name="consent" required className={styles.checkbox} />
            <span>
              I agree that this review, along with my name, may be posted publicly on Jojo&apos;s
              website. I have read the{" "}
              <Link href="/disclaimer" target="_blank" rel="noopener noreferrer">
                privacy notice
                <span className="sr-only"> (opens in a new tab)</span>
              </Link>
              . *
            </span>
          </label>
        </div>

        {error && (
          <span role="alert" className={styles.error}>
            {error}
          </span>
        )}

        <button type="submit" className={styles.submit} disabled={submitting}>
          {submitting ? "Submitting…" : "Submit review"}
        </button>
      </form>
    </div>
  );
}
