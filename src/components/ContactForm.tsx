"use client";

import { useState } from "react";
import Link from "next/link";
import { submitContactForm } from "@/app/(site)/contact/actions";
import styles from "./ContactForm.module.css";

const roles = ["Business Owner", "Professional", "Employee", "OFW", "Parent", "Other"];

const topics = [
  "Financial Foundation",
  "Protection",
  "Health Planning",
  "Education",
  "Retirement",
  "Business Planning",
  "Investment / Wealth Building",
  "Not Sure Yet",
];

const VALIDATED = ["firstName", "lastName", "email", "mobile", "consent"] as const;
type FieldName = (typeof VALIDATED)[number];
type Errors = Partial<Record<FieldName, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* Messages say what is wrong and what to do about it — "Invalid input" tells
   nobody anything. Kept plain so they read the same as the rest of the page. */
function validate(name: FieldName, value: string): string | undefined {
  switch (name) {
    case "firstName":
      return value.trim() ? undefined : "Enter your first name.";
    case "lastName":
      return value.trim() ? undefined : "Enter your last name.";
    case "email":
      if (!value.trim()) return "Enter your email address.";
      return EMAIL_PATTERN.test(value.trim())
        ? undefined
        : "Enter an email address in the format name@example.com.";
    case "mobile":
      if (!value.trim()) return "Enter your mobile number.";
      return value.replace(/\D/g, "").length >= 7
        ? undefined
        : "Enter a mobile number Jojo can reach you on.";
    case "consent":
      return value === "true" ? undefined : "Please confirm Jojo may contact you.";
  }
}

function readValue(el: HTMLElement): string {
  const input = el as HTMLInputElement;
  return input.type === "checkbox" ? String(input.checked) : input.value;
}

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function isValidated(name: string): name is FieldName {
    return (VALIDATED as readonly string[]).includes(name);
  }

  /* Validate on blur, never on keystroke — flagging an email as malformed while
     someone is still typing it is noise, not help. */
  function handleBlur(event: React.FocusEvent<HTMLFormElement>) {
    // Widened to EventTarget so instanceof can narrow it; the event is declared on
    // the form, but it is delegated from whichever child actually blurred.
    const target: EventTarget = event.target;
    if (!(target instanceof HTMLInputElement) || !isValidated(target.name)) return;
    const message = validate(target.name, readValue(target));
    setErrors((prev) => ({ ...prev, [target.name]: message }));
  }

  /* Once a field is already flagged, clear it as soon as it becomes valid. */
  function handleChange(event: React.ChangeEvent<HTMLFormElement>) {
    const target: EventTarget = event.target;
    if (!(target instanceof HTMLInputElement) || !isValidated(target.name)) return;
    if (!errors[target.name]) return;
    const message = validate(target.name, readValue(target));
    setErrors((prev) => ({ ...prev, [target.name]: message }));
  }

  // TODO(compliance): the write path itself is wired (see src/app/contact/actions.ts),
  // but it must stay switched off in front of real users until the privacy notice on
  // /disclaimer is actually published — the placeholder there is what has been gating
  // this, not the missing backend.
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const next: Errors = {};

    for (const name of VALIDATED) {
      const el = form.elements.namedItem(name);
      if (el instanceof HTMLElement) next[name] = validate(name, readValue(el));
    }
    setErrors(next);

    const firstInvalid = VALIDATED.find((name) => next[name]);
    if (firstInvalid) {
      const el = form.elements.namedItem(firstInvalid);
      if (el instanceof HTMLElement) el.focus();
      return;
    }

    const getValue = (name: string) => {
      const el = form.elements.namedItem(name);
      return el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement
        ? el.value
        : "";
    };

    setSubmitError(null);
    setSubmitting(true);

    const result = await submitContactForm({
      firstName: getValue("firstName"),
      lastName: getValue("lastName"),
      email: getValue("email"),
      mobile: getValue("mobile"),
      role: getValue("role"),
      topic: getValue("topic"),
      message: getValue("message"),
    });

    setSubmitting(false);

    if (!result.success) {
      setSubmitError(result.error);
      return;
    }

    setSubmitted(true);
  }

  function fieldProps(name: FieldName) {
    const invalid = Boolean(errors[name]);
    return {
      "aria-invalid": invalid || undefined,
      "aria-describedby": invalid ? `${name}-error` : undefined,
    };
  }

  function ErrorText({ name }: { name: FieldName }) {
    if (!errors[name]) return null;
    return (
      <span id={`${name}-error`} role="alert" className={styles.error}>
        {errors[name]}
      </span>
    );
  }

  function inputClass(name: FieldName, base: string) {
    return errors[name] ? `${base} ${styles.invalid}` : base;
  }

  if (submitted) {
    return (
      <div className={styles.card}>
        <div className={styles.success}>
          <span className="rule-gold" />
          <h2 className={styles.title}>Thanks.</h2>
          <p className={styles.successBody}>
            I received your message and will get back to you through the contact details you
            provided.
          </p>
          <button
            type="button"
            className={styles.successButton}
            onClick={() => {
              setSubmitted(false);
              setErrors({});
            }}
          >
            Send another message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      {/* noValidate so the messages below replace the browser's transient bubble,
          which is first-error-only and styled differently in every browser. The
          `required` attributes stay for assistive technology. */}
      <form
        className={styles.form}
        onSubmit={handleSubmit}
        onBlur={handleBlur}
        onChange={handleChange}
        noValidate
      >
        <h2 className={styles.title}>Send a message</h2>

        <div className={styles.pair}>
          <label className={styles.label}>
            First name *
            <input
              type="text"
              name="firstName"
              autoComplete="given-name"
              required
              className={inputClass("firstName", styles.input)}
              {...fieldProps("firstName")}
            />
            <ErrorText name="firstName" />
          </label>
          <label className={styles.label}>
            Last name *
            <input
              type="text"
              name="lastName"
              autoComplete="family-name"
              required
              className={inputClass("lastName", styles.input)}
              {...fieldProps("lastName")}
            />
            <ErrorText name="lastName" />
          </label>
        </div>

        <div className={styles.pair}>
          <label className={styles.label}>
            Email *
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              className={inputClass("email", styles.input)}
              {...fieldProps("email")}
            />
            <ErrorText name="email" />
          </label>
          <label className={styles.label}>
            Mobile number *
            <input
              type="tel"
              name="mobile"
              autoComplete="tel"
              required
              className={inputClass("mobile", styles.input)}
              {...fieldProps("mobile")}
            />
            <ErrorText name="mobile" />
          </label>
        </div>

        <label className={styles.label}>
          I am a
          <select name="role" className={styles.select} defaultValue={roles[0]}>
            {roles.map((role) => (
              <option key={role}>{role}</option>
            ))}
          </select>
        </label>

        <label className={styles.label}>
          What would you like help with?
          <select name="topic" className={styles.select} defaultValue={topics[0]}>
            {topics.map((topic) => (
              <option key={topic}>{topic}</option>
            ))}
          </select>
        </label>

        <label className={styles.label}>
          Message (optional)
          <textarea name="message" rows={4} className={styles.textarea} />
        </label>

        {/* TODO(compliance): "the privacy notice" must link to a published notice reviewed
            against Philippine data-privacy requirements before any lead is captured. */}
        <div className={styles.consentBlock}>
          {/* Opens in a new tab: this is the link a user is most likely to follow while
              filling the form, and navigating away would discard everything typed. */}
          <label className={styles.consent}>
            <input
              type="checkbox"
              name="consent"
              required
              className={inputClass("consent", styles.checkbox)}
              {...fieldProps("consent")}
            />
            <span>
              I agree that Jojo may contact me using the details above, and I have read the{" "}
              <Link href="/disclaimer" target="_blank" rel="noopener noreferrer">
                privacy notice
                <span className="sr-only"> (opens in a new tab)</span>
              </Link>
              . *
            </span>
          </label>
          <ErrorText name="consent" />
        </div>

        {submitError && (
          <span role="alert" className={styles.error}>
            {submitError}
          </span>
        )}

        <button type="submit" className={styles.submit} disabled={submitting}>
          {submitting ? "Sending…" : "Send message"}
        </button>

        <span className={styles.footnote}>
          Please don&apos;t include sensitive financial details in this first message.
        </span>
      </form>
    </div>
  );
}
