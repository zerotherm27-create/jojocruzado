import styles from "./ShareButtons.module.css";

// Matches the canonical origin used by sitemap.ts / robots.ts / the vCard
// route -- share links need an absolute URL, not the relative article path.
const SITE_URL = "https://jojocruzado.safetymargin.app";

type Props = {
  /** Article path, e.g. "/insights/some-slug". */
  path: string;
  title: string;
};

export default function ShareButtons({ path, title }: Props) {
  const url = `${SITE_URL}${path}`;
  const facebookHref = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  const linkedinHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  return (
    <div className={styles.share}>
      <span className={styles.label}>Share</span>
      <a
        href={facebookHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Share "${title}" on Facebook`}
        className={styles.button}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="currentColor">
          <path d="M13.5 21v-7.5h2.52l.38-2.93h-2.9v-1.87c0-.85.24-1.43 1.45-1.43h1.55V4.63c-.27-.04-1.18-.12-2.24-.12-2.22 0-3.74 1.36-3.74 3.85v2.15H8.06v2.93h2.46V21h2.98Z" />
        </svg>
      </a>
      <a
        href={linkedinHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Share "${title}" on LinkedIn`}
        className={styles.button}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="currentColor">
          <path d="M6.94 8.5H4.06V20h2.88V8.5ZM5.5 4a1.67 1.67 0 1 0 0 3.34A1.67 1.67 0 0 0 5.5 4ZM20 13.4c0-3.1-1.66-4.54-3.87-4.54-1.78 0-2.58.98-3.02 1.67V8.5H10.2c.04.85 0 12 0 12h2.9v-6.7c0-.36.02-.72.13-.98.28-.72.93-1.46 2.02-1.46 1.43 0 2 1.08 2 2.68V20H20v-6.6Z" />
        </svg>
      </a>
    </div>
  );
}
