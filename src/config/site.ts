// Sibling product: the actual Safety Margin quiz/funnel lives here, not on this site.
// This site's stated primary conversion is routing visitors into it (strategy brief:
// "Primary conversion is the Safety Margin check"). www.safetymargin.app 301s to this
// bare domain, so link to the canonical form directly.
export const SAFETY_MARGIN_URL = "https://safetymargin.app";

// Jojo's real, live contact channels, confirmed on safetymargin.app. Viber and a
// personal email remain unconfirmed — see the TODO(compliance) on /contact.
export const CALENDLY_URL = "https://calendly.com/jojocruzado/30min";
export const MESSENGER_URL = "https://m.me/safetymarginph";

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
