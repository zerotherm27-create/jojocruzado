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

// Rule-based, not invented per visitor: three fixed, hedged sentences picked
// by where the result lands, never a specific dollar promise or guarantee.
export function recommendationCopy(protectionGap: number, monthlyIncome: number): string {
  if (protectionGap <= 0) {
    return "Based on what you shared, your current coverage may already meet this estimate. It's still worth reviewing periodically as your income and obligations change.";
  }
  const monthsOfIncome = monthlyIncome > 0 ? protectionGap / monthlyIncome : 0;
  if (monthsOfIncome > 60) {
    return "Based on what you shared, there may be a significant gap between what's already covered and what your family might need.";
  }
  return "Based on what you shared, there may be a gap worth reviewing between what's already covered and what your family might need.";
}
