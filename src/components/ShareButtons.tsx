"use client";

import { useState } from "react";
import type { ShareGroupLink } from "@/lib/shareGroups";
import styles from "./ShareButtons.module.css";

// Matches the canonical origin used by sitemap.ts / robots.ts / the vCard
// route -- share links need an absolute URL, not the relative article path.
const SITE_URL = "https://jojocruzado.safetymargin.app";

type Props = {
  /** Article path, e.g. "/insights/some-slug". */
  path: string;
  title: string;
  /** Article dek, reused as the ready-made social caption. */
  caption: string;
  /** Jojo's own Facebook/LinkedIn groups, set in /admin/settings. */
  groupLinks?: ShareGroupLink[];
};

type Copied = { kind: "facebook" | "linkedin" | "link" } | { kind: "group"; label: string } | null;

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export default function ShareButtons({ path, title, caption, groupLinks = [] }: Props) {
  const [copied, setCopied] = useState<Copied>(null);
  const url = `${SITE_URL}${path}`;

  // Neither platform lets a share link pre-fill the actual post text anymore
  // (both dropped it years ago as an anti-spam measure), so the caption is
  // handed over via clipboard instead and pasted in by hand.
  async function handleFacebook() {
    await copyText(caption);
    setCopied({ kind: "facebook" });
    // A fresh status post, not the link-share dialog: pasting the caption
    // here keeps the post as plain text, which Facebook's algorithm favors
    // over a post whose body already contains an outbound link.
    window.open("https://www.facebook.com/", "_blank", "noopener,noreferrer");
  }

  async function handleLinkedin() {
    await copyText(`${caption}\n\n${url}`);
    setCopied({ kind: "linkedin" });
    const linkedinHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedinHref, "_blank", "noopener,noreferrer");
  }

  async function handleCopyLink() {
    await copyText(url);
    setCopied({ kind: "link" });
  }

  // Same "caption now, link later" flow as the Facebook button -- these are
  // mostly Facebook groups too, and pasting the caption alone still works
  // fine as an opening line on a LinkedIn group post.
  async function handleGroup(group: ShareGroupLink) {
    await copyText(caption);
    setCopied({ kind: "group", label: group.label });
    window.open(group.url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className={styles.share}>
      <div className={styles.row}>
        <span className={styles.label}>Share</span>
        <button
          type="button"
          onClick={handleFacebook}
          aria-label={`Copy a ready-made caption for "${title}" and open Facebook`}
          className={styles.button}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="currentColor">
            <path d="M13.5 21v-7.5h2.52l.38-2.93h-2.9v-1.87c0-.85.24-1.43 1.45-1.43h1.55V4.63c-.27-.04-1.18-.12-2.24-.12-2.22 0-3.74 1.36-3.74 3.85v2.15H8.06v2.93h2.46V21h2.98Z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={handleLinkedin}
          aria-label={`Copy a ready-made caption for "${title}" and open LinkedIn`}
          className={styles.button}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="currentColor">
            <path d="M6.94 8.5H4.06V20h2.88V8.5ZM5.5 4a1.67 1.67 0 1 0 0 3.34A1.67 1.67 0 0 0 5.5 4ZM20 13.4c0-3.1-1.66-4.54-3.87-4.54-1.78 0-2.58.98-3.02 1.67V8.5H10.2c.04.85 0 12 0 12h2.9v-6.7c0-.36.02-.72.13-.98.28-.72.93-1.46 2.02-1.46 1.43 0 2 1.08 2 2.68V20H20v-6.6Z" />
          </svg>
        </button>
      </div>

      {groupLinks.length > 0 && (
        <div className={styles.groupRow}>
          {groupLinks.map((group) => (
            <button
              key={group.url}
              type="button"
              onClick={() => handleGroup(group)}
              aria-label={`Copy a ready-made caption for "${title}" and open ${group.label}`}
              className={styles.groupButton}
            >
              {group.label}
            </button>
          ))}
        </div>
      )}

      <div role="status" className={styles.hint}>
        {copied?.kind === "facebook" && (
          <>
            Caption copied. Paste it as a new Facebook post, publish it, then{" "}
            <button type="button" onClick={handleCopyLink} className={styles.hintLink}>
              copy the link
            </button>{" "}
            and add it as your first comment.
          </>
        )}
        {copied?.kind === "linkedin" && <>Caption and link copied. Paste them in as your LinkedIn post.</>}
        {copied?.kind === "group" && (
          <>
            Caption copied. Paste it as a new post in {copied.label}, publish it, then{" "}
            <button type="button" onClick={handleCopyLink} className={styles.hintLink}>
              copy the link
            </button>{" "}
            and add it as your first comment.
          </>
        )}
        {copied?.kind === "link" && <>Link copied.</>}
      </div>
    </div>
  );
}
