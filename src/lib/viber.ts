// Viber's deep link wants just digits and an optional leading "+" -- admins
// may type the stored number with spaces or dashes, so strip those first.
function sanitizeForViber(raw: string): string {
  return raw.replace(/(?!^\+)[^\d]/g, "");
}

export function viberDeepLink(number: string): string {
  return `viber://chat?number=${encodeURIComponent(sanitizeForViber(number))}`;
}
