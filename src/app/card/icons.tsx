import {
  ChatCircleTextIcon,
  EnvelopeSimpleIcon,
  MessengerLogoIcon,
  PhoneIcon as PhosphorPhoneIcon,
} from "@phosphor-icons/react/dist/ssr";

/* Phosphor Icons (per this project's design-system rule) covers every icon
   here except Viber — it's a general UI + well-known-brand icon set and
   doesn't include that specific regional app. Kept as one hand-drawn
   exception rather than pulling in a second icon package for a single glyph. */
type IconProps = { className?: string };

export function PhoneIcon({ className }: IconProps) {
  return <PhosphorPhoneIcon className={className} weight="regular" />;
}

export function MessageIcon({ className }: IconProps) {
  return <ChatCircleTextIcon className={className} weight="regular" />;
}

export function EmailIcon({ className }: IconProps) {
  return <EnvelopeSimpleIcon className={className} weight="regular" />;
}

export function MessengerIcon({ className }: IconProps) {
  return <MessengerLogoIcon className={className} weight="regular" />;
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
