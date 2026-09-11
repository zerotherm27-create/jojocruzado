// Simplified DIME-method (Debt, Income replacement, Mortgage, Education)
// protection gap estimate, used by ProtectionGapCalculator. Folds Mortgage
// into the general "outstanding debts" input and excludes Education (a
// separate need category in content/needs.ts this tool doesn't cover) so a
// quick 4-question tool doesn't need the full method's 7 separate inputs.
export type ProtectionGapInputs = {
  monthlyIncome: number;
  dependents: 0 | 1 | 2 | 3; // 3 means "3+"
  existingCoverage: number;
  outstandingDebts: number;
};

export type ProtectionGapResult = {
  incomeReplacementYears: number;
  incomeReplacementNeed: number;
  totalProtectionNeed: number;
  protectionGap: number;
};

// Years of income replacement scale with dependents on a simple lookup, not
// a formula — a standard, explainable rule of thumb (more dependents, a
// longer income-replacement horizon), not a derived/invented weighting.
const INCOME_REPLACEMENT_YEARS: Record<ProtectionGapInputs["dependents"], number> = {
  0: 5,
  1: 10,
  2: 12,
  3: 15,
};

export function calculateProtectionGap(inputs: ProtectionGapInputs): ProtectionGapResult {
  const years = INCOME_REPLACEMENT_YEARS[inputs.dependents];
  const incomeReplacementNeed = inputs.monthlyIncome * 12 * years;
  const totalProtectionNeed = incomeReplacementNeed + inputs.outstandingDebts;
  const protectionGap = Math.max(0, totalProtectionNeed - inputs.existingCoverage);

  return { incomeReplacementYears: years, incomeReplacementNeed, totalProtectionNeed, protectionGap };
}

export type ProtectionStatus = {
  percent: number; // 0-100, how much of the estimated need existing coverage meets
  label: string;
  tone: "good" | "neutral" | "attention";
};

// How much of the total estimated need existing coverage already meets,
// tiered into three plain-language statuses. Kept in the site's own
// navy/gold/danger palette rather than a traffic-light scheme (see
// tokens.css's own note on why this project avoids alarm colors).
export function protectionStatus(result: ProtectionGapResult, existingCoverage: number): ProtectionStatus {
  const percent =
    result.totalProtectionNeed > 0
      ? Math.min(100, Math.round((existingCoverage / result.totalProtectionNeed) * 100))
      : 100;

  if (percent >= 90) return { percent, label: "Well protected", tone: "good" };
  if (percent >= 50) return { percent, label: "Partially protected", tone: "neutral" };
  return { percent, label: "Needs attention", tone: "attention" };
}

// Rule-based, not invented per visitor: three fixed, hedged paragraphs
// picked by protection tier, never a specific dollar promise or guarantee.
export function analysisCopy(status: ProtectionStatus): string {
  switch (status.tone) {
    case "good":
      return "Your existing coverage and the income replacement need you shared are closely matched. Based on these numbers, there's little to no estimated gap.";
    case "neutral":
      return "Your existing coverage covers a meaningful portion of the estimated need, but there's still a gap worth understanding between what's covered and what your family might need.";
    case "attention":
      return "Your existing coverage covers only a small portion of the estimated need, based on what you shared. That leaves a significant gap between what's covered and what your family might need.";
  }
}

export function recommendationCopy(status: ProtectionStatus): string {
  switch (status.tone) {
    case "good":
      return "Since you're already close to fully covered, the main thing worth doing is reviewing your policy periodically, especially after a major change like a new dependent, a new loan, or a change in income.";
    case "neutral":
      return "Gaps like this are usually closed gradually, for example by adding supplemental coverage or adjusting an existing policy. Talking to Jojo can help you figure out what fits your budget and goals.";
    case "attention":
      return "A gap this size is worth prioritizing. Sun Life has options that can help close it in a way that fits your budget. Talking to Jojo is a good next step to see what makes sense for your situation.";
  }
}
