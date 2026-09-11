"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { PROTECTION_GAP_URL } from "@/config/site";
import {
  calculateProtectionGap,
  recommendationCopy,
  type ProtectionGapInputs,
  type ProtectionGapResult,
} from "@/lib/protectionGap";
import { submitProtectionGapLead } from "@/app/protection-gap/actions";
import styles from "./ProtectionGapCalculator.module.css";

type Answers = {
  monthlyIncome: number | null;
  dependents: 0 | 1 | 2 | 3 | null;
  existingCoverage: number;
  outstandingDebts: number;
};

type Stage =
  | { name: "question"; step: 0 | 1 | 2 | 3 }
  | { name: "capture" }
  | { name: "revealed" };

const INITIAL_ANSWERS: Answers = {
  monthlyIncome: null,
  dependents: null,
  existingCoverage: 0,
  outstandingDebts: 0,
};

const STAGE_TITLES: Record<Stage["name"], string> = {
  question: "Estimate your protection gap",
  capture: "Almost there",
  revealed: "Your protection gap",
};

function formatPeso(amount: number): string {
  return `₱${Math.round(amount).toLocaleString()}`;
}

function isStepValid(answers: Answers, step: 0 | 1 | 2 | 3): boolean {
  if (step === 0) return answers.monthlyIncome !== null && answers.monthlyIncome > 0;
  if (step === 1) return answers.dependents !== null;
  return true; // existing coverage / debts default to 0, always valid
}

/* Client leaf, matching ArtcardDialog.tsx's pattern: a trigger + a native
   <dialog> (free focus trap, Esc-to-dismiss, backdrop-click-to-close), so
   only this small island needs to be a Client Component. */
export default function ProtectionGapCalculator() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [stage, setStage] = useState<Stage>({ name: "question", step: 0 });
  const [answers, setAnswers] = useState<Answers>(INITIAL_ANSWERS);
  const [result, setResult] = useState<ProtectionGapResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function open() {
    setStage({ name: "question", step: 0 });
    setAnswers(INITIAL_ANSWERS);
    setResult(null);
    setError(null);
    dialogRef.current?.showModal();
  }

  function close() {
    dialogRef.current?.close();
  }

  function goNext() {
    if (stage.name !== "question") return;
    if (stage.step < 3) {
      setStage({ name: "question", step: (stage.step + 1) as 1 | 2 | 3 });
      return;
    }
    const inputs: ProtectionGapInputs = {
      monthlyIncome: answers.monthlyIncome ?? 0,
      dependents: answers.dependents ?? 0,
      existingCoverage: answers.existingCoverage,
      outstandingDebts: answers.outstandingDebts,
    };
    setResult(calculateProtectionGap(inputs));
    setStage({ name: "capture" });
  }

  function goBack() {
    if (stage.name === "capture") {
      setStage({ name: "question", step: 3 });
      return;
    }
    if (stage.name === "question" && stage.step > 0) {
      setStage({ name: "question", step: (stage.step - 1) as 0 | 1 | 2 });
    }
  }

  async function handleCaptureSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const phone = String(form.get("phone") || "").trim();

    if (!name || (!email && !phone)) {
      setError("Enter your name and a phone number or email.");
      return;
    }

    setError(null);
    setSubmitting(true);

    const submission = await submitProtectionGapLead({
      name,
      email,
      phone,
      inputs: {
        monthlyIncome: answers.monthlyIncome ?? 0,
        dependents: answers.dependents ?? 0,
        existingCoverage: answers.existingCoverage,
        outstandingDebts: answers.outstandingDebts,
      },
    });

    setSubmitting(false);

    if (!submission.success) {
      setError(submission.error);
      return;
    }

    setStage({ name: "revealed" });
  }

  return (
    <>
      <button type="button" className={`arrow-link ${styles.trigger}`} onClick={open}>
        Estimate my gap &rarr;
      </button>

      {/* Native <dialog>, same mechanism as ArtcardDialog.tsx. */}
      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-labelledby="protection-gap-dialog-title"
        onClose={() => setStage({ name: "question", step: 0 })}
        onClick={(event) => {
          if (event.target === dialogRef.current) close();
        }}
      >
        <div className={styles.body}>
          <div className={styles.head}>
            <h2 id="protection-gap-dialog-title" className={styles.title}>
              {STAGE_TITLES[stage.name]}
            </h2>
            <button type="button" className={styles.closeButton} aria-label="Close" onClick={close}>
              &times;
            </button>
          </div>

          {stage.name === "question" && (
            <div className={styles.questionStage}>
              <div className={styles.progressRow}>
                <span className={styles.progressLabel}>Step {stage.step + 1} of 4</span>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${((stage.step + 1) / 4) * 100}%` }}
                  />
                </div>
              </div>

              {stage.step === 0 && (
                <label className={styles.label}>
                  What&apos;s your monthly household income you&apos;d want protected?
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    placeholder="e.g. 50000"
                    className={styles.input}
                    value={answers.monthlyIncome ?? ""}
                    onChange={(event) =>
                      setAnswers((prev) => ({
                        ...prev,
                        monthlyIncome: event.target.value === "" ? null : Number(event.target.value),
                      }))
                    }
                  />
                </label>
              )}

              {stage.step === 1 && (
                <div className={styles.label}>
                  How many dependents rely on that income?
                  <div className={styles.segmented}>
                    {([0, 1, 2, 3] as const).map((value) => (
                      <button
                        key={value}
                        type="button"
                        className={
                          answers.dependents === value ? styles.segmentActive : styles.segment
                        }
                        onClick={() => setAnswers((prev) => ({ ...prev, dependents: value }))}
                      >
                        {value === 3 ? "3+" : value}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {stage.step === 2 && (
                <label className={styles.label}>
                  How much life insurance coverage do you already have?
                  <span className={styles.hint}>Add up all policies.</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    placeholder="e.g. 500000"
                    className={styles.input}
                    value={answers.existingCoverage || ""}
                    onChange={(event) =>
                      setAnswers((prev) => ({
                        ...prev,
                        existingCoverage: event.target.value === "" ? 0 : Number(event.target.value),
                      }))
                    }
                  />
                  <button
                    type="button"
                    className={styles.quickFill}
                    onClick={() => {
                      setAnswers((prev) => ({ ...prev, existingCoverage: 0 }));
                      goNext();
                    }}
                  >
                    I don&apos;t have any yet
                  </button>
                </label>
              )}

              {stage.step === 3 && (
                <label className={styles.label}>
                  Any major outstanding debts, including mortgage?
                  <span className={styles.hint}>Personal loans, car loan, mortgage balance.</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    placeholder="e.g. 1000000"
                    className={styles.input}
                    value={answers.outstandingDebts || ""}
                    onChange={(event) =>
                      setAnswers((prev) => ({
                        ...prev,
                        outstandingDebts: event.target.value === "" ? 0 : Number(event.target.value),
                      }))
                    }
                  />
                  <button
                    type="button"
                    className={styles.quickFill}
                    onClick={() => {
                      setAnswers((prev) => ({ ...prev, outstandingDebts: 0 }));
                      goNext();
                    }}
                  >
                    None
                  </button>
                </label>
              )}

              <div className={styles.stepActions}>
                {stage.step > 0 && (
                  <button type="button" className={styles.backButton} onClick={goBack}>
                    Back
                  </button>
                )}
                <button
                  type="button"
                  className={styles.nextButton}
                  disabled={!isStepValid(answers, stage.step)}
                  onClick={goNext}
                >
                  {stage.step < 3 ? "Next" : "See My Estimate"}
                </button>
              </div>
            </div>
          )}

          {stage.name === "capture" && (
            <form className={styles.captureForm} onSubmit={handleCaptureSubmit} noValidate>
              <p className={styles.captureSubhead}>
                Enter your details to see your protection gap estimate.
              </p>

              <label className="sr-only" htmlFor="pgc-name">
                Your name
              </label>
              <input
                id="pgc-name"
                type="text"
                name="name"
                placeholder="Your name"
                required
                className={styles.input}
              />
              <span className={styles.hint}>Email or phone (at least one)</span>
              <label className="sr-only" htmlFor="pgc-email">
                Your email
              </label>
              <input
                id="pgc-email"
                type="email"
                name="email"
                placeholder="Email address"
                className={styles.input}
              />
              <label className="sr-only" htmlFor="pgc-phone">
                Your phone number
              </label>
              <input
                id="pgc-phone"
                type="tel"
                name="phone"
                placeholder="Phone number"
                className={styles.input}
              />

              {error && (
                <span role="alert" className={styles.error}>
                  {error}
                </span>
              )}

              <div className={styles.stepActions}>
                <button type="button" className={styles.backButton} onClick={goBack}>
                  Back
                </button>
                <button type="submit" className={styles.nextButton} disabled={submitting}>
                  {submitting ? "Submitting…" : "See My Estimate"}
                </button>
              </div>

              <span className={styles.footnote}>
                Your details are used only so Jojo can follow up with you directly.
              </span>
            </form>
          )}

          {stage.name === "revealed" && result && (
            <div className={styles.revealed}>
              <span className={styles.resultLabel}>Your estimated protection gap</span>
              <span className={styles.resultAmount}>{formatPeso(result.protectionGap)}</span>

              <div className={styles.breakdown}>
                <div className={styles.breakdownRow}>
                  <span>
                    Income replacement ({result.incomeReplacementYears} years)
                  </span>
                  <span>{formatPeso(result.incomeReplacementNeed)}</span>
                </div>
                <div className={styles.breakdownRow}>
                  <span>+ Outstanding debts</span>
                  <span>{formatPeso(answers.outstandingDebts)}</span>
                </div>
                <div className={styles.breakdownRow}>
                  <span>&minus; Existing coverage</span>
                  <span>{formatPeso(answers.existingCoverage)}</span>
                </div>
                <div className={styles.breakdownRowTotal}>
                  <span>= Estimated protection gap</span>
                  <span>{formatPeso(result.protectionGap)}</span>
                </div>
              </div>

              <p className={styles.methodNote}>
                This uses a simplified DIME method (Debt, Income replacement, Mortgage,
                Education), the same approach behind Jojo&apos;s full Safety Margin protection
                gap check, focused on your income and debts.
              </p>

              <p className={styles.recommendation}>
                {recommendationCopy(result.protectionGap, answers.monthlyIncome ?? 0)}
              </p>

              <p className={styles.disclaimer}>Educational estimate. Not formal financial advice.</p>

              <div className={styles.resultCtas}>
                <Link href="/contact" className="btn btn-navy">
                  Talk to Jojo About This
                </Link>
                <Link
                  href={PROTECTION_GAP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.secondaryLink}
                >
                  See my full Safety Margin report &rarr;
                </Link>
              </div>
            </div>
          )}
        </div>
      </dialog>
    </>
  );
}
