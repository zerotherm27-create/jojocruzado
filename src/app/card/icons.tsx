/* Minimal hand-drawn line icons — no icon library is installed elsewhere in
   this codebase (confirmed: no lucide/phosphor/heroicons dependency), and
   pulling one in just for 3 icons isn't worth the added dependency. Plain
   emoji glyphs are avoided per this project's style rules. */

type IconProps = { className?: string };

export function WebsiteIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <ellipse cx="12" cy="12" rx="4" ry="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 12h18" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function EmailIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="5.5" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function FacebookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M13.5 9h1.5V6.8h-1.7c-1.7 0-2.6 1-2.6 2.6V11H9v2.2h2.2V18h2.3v-4.8H15l.4-2.2h-2v-1.3c0-.5.2-.7.6-.7z"
        fill="currentColor"
      />
    </svg>
  );
}
