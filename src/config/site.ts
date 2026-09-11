// Sibling product: the actual Safety Margin quiz/funnel lives here, not on this site.
// This site's stated primary conversion is routing visitors into it (strategy brief:
// "Primary conversion is the Safety Margin check"). www.safetymargin.app 301s to this
// bare domain, so link to the canonical form directly.
export const SAFETY_MARGIN_URL = "https://safetymargin.app";

// The specific deep link to Safety Margin's own protection-gap calculator
// step (confirmed live: a real route, not just client-side state), used
// where a CTA is specifically about coverage gaps rather than the general
// "check my whole picture" link above.
export const PROTECTION_GAP_URL = "https://safetymargin.app/protection-gap";

// Jojo's real, live contact channels, confirmed on safetymargin.app. Viber and a
// personal email remain unconfirmed — see the TODO(compliance) on /contact.
export const CALENDLY_URL = "https://calendly.com/jojocruzado/30min";
export const MESSENGER_URL = "https://m.me/safetymarginph";

// Used by /card (the digital business card an NFC tap opens) and its vCard
// download. Kept as a constant, not a site_settings column — this is a
// single-owner site, and Jojo's name already appears as literal copy
// everywhere else (e.g. /about), so this matches that convention.
export const CARD_FULL_NAME = "Jojo Cruzado";

export const NAV_ITEMS = [
  { href: "/about", label: "About" },
  { href: "/how-i-help", label: "How I Help" },
  { href: "/insights", label: "Insights" },
  // Deliberately labeled "Sun Life", not "Products" or "Resources" — names the
  // source plainly without reading as a product catalog entry point.
  { href: "/resources", label: "Sun Life" },
  { href: SAFETY_MARGIN_URL, label: "Safety Margin" },
] as const;

// Themeable flags carried over from the design prototype. Turn these into CMS
// values or delete them once the content is final (handoff README, "State").
export const siteConfig = {
  accent: "#F5A623",
  showReviewStep: true,
  showLegacyLayer: true,
  stickyMobileCta: true,
} as const;
