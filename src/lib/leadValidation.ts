// Shared by client forms (inline feedback) and their server actions
// (the actual gate -- client checks can be bypassed).

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Philippine mobile numbers: 09XXXXXXXXX, 9XXXXXXXXX, or +63/63 9XXXXXXXXX.
const PH_MOBILE_PATTERN = /^(?:\+?63|0)9\d{9}$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

export function isValidPhMobile(value: string): boolean {
  return PH_MOBILE_PATTERN.test(value.trim().replace(/[\s-]/g, ""));
}
