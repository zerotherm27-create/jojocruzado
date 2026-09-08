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

export function PhoneIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M6.6 3.5l3 3-1.6 2.4c1 1.9 2.6 3.5 4.5 4.5l2.4-1.6 3 3-1.3 1.6c-.6.7-1.5 1-2.4.8-3.4-.8-7.4-4.8-8.2-8.2-.2-.9.1-1.8.8-2.4l1.6-1.3z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MessageIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M4 5.5h16v10a1 1 0 0 1-1 1H9l-4 3.2v-3.2H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ViberIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 4C7.6 4 4 6.9 4 10.6c0 2.3 1.4 4.4 3.6 5.6l-.5 3.3 3.3-1.8c.5.1 1 .1 1.6.1 4.4 0 8-2.9 8-6.6C20 6.9 16.4 4 12 4z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M9.3 9c1.8 2.6 2.9 3.6 5.4 5l1-1c.2-.2.5-.3.8-.1.6.3 1.3.7 1.8 1.2.3.2.3.6.1.9-.6.9-1.7 1.4-2.7 1-2.8-1-5.8-4-6.8-6.8-.4-1 .1-2.1 1-2.7.3-.2.7-.2.9.1.5.5.9 1.2 1.2 1.8.2.3.1.6-.1.8l-.8.8z"
        fill="currentColor"
      />
    </svg>
  );
}

export function MessengerIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 4C6.9 4 3 7.6 3 12.3c0 2.6 1.2 4.9 3.2 6.4V22l3-1.6c.9.2 1.8.4 2.8.4 5.1 0 9-3.6 9-8.3S17.1 4 12 4z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M7 13.5l3.4-3.6 2.4 2 3.5-2.6-3.6 3.8-2.4-2-3.3 2.4z"
        fill="currentColor"
      />
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
