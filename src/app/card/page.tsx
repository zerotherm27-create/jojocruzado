import Image from "next/image";
import Link from "next/link";
import CardExchangeForm from "./CardExchangeForm";
import { EmailIcon, FacebookIcon, WebsiteIcon } from "./icons";
import { CALENDLY_URL, CARD_FULL_NAME, SAFETY_MARGIN_URL } from "@/config/site";
import { getSiteSettings, resolveImage } from "@/lib/supabase/queries";
import styles from "./page.module.css";

// Revalidate so a photo/detail edited in /admin -> Site Settings shows up
// here within a minute instead of needing a redeploy.
export const revalidate = 60;

const DEFAULT_TITLE = "Sun Life | Licensed Insurance Advisor";
const DEFAULT_BIO =
  "I help professionals, families, and business owners see their financial picture clearly and make practical decisions.";

// Viber's deep link wants just digits and an optional leading "+" — admins
// may type the stored number with spaces or dashes, so strip those first.
function sanitizeForViber(raw: string): string {
  return raw.replace(/(?!^\+)[^\d]/g, "");
}

export default async function CardPage() {
  const settings = await getSiteSettings();

  const photo = resolveImage(settings?.cardPhoto, "/images/jojo-about.png");
  const title = settings?.cardTitle || DEFAULT_TITLE;
  const bio = settings?.cardBio || DEFAULT_BIO;
  const phone = settings?.cardPhone;
  const email = settings?.contactEmail;
  const viber = settings?.viberNumber;
  const messenger = settings?.messengerUrl;

  return (
    <main className={styles.card}>
      <Image
        src={photo}
        alt={settings?.cardPhotoAlt || CARD_FULL_NAME}
        width={128}
        height={128}
        className={styles.avatar}
        priority
      />
      <h1 className={styles.name}>{CARD_FULL_NAME}</h1>
      <p className={styles.title}>{title}</p>
      <p className={styles.bio}>{bio}</p>

      <div className={styles.iconRow}>
        {phone && (
          <a href={`tel:${phone}`} className={styles.iconButton} aria-label="Call Jojo">
            Call
          </a>
        )}
        {phone && (
          <a href={`sms:${phone}`} className={styles.iconButton} aria-label="Text Jojo">
            Text
          </a>
        )}
        {viber && (
          <a
            href={`viber://chat?number=${encodeURIComponent(sanitizeForViber(viber))}`}
            className={styles.iconButton}
            aria-label="Message Jojo on Viber"
          >
            Viber
          </a>
        )}
      </div>

      <div className={styles.socialRow}>
        <Link href="/" className={styles.socialButton} aria-label="Visit Jojo's website">
          <WebsiteIcon className={styles.socialIcon} />
        </Link>
        {email && (
          <a href={`mailto:${email}`} className={styles.socialButton} aria-label="Email Jojo">
            <EmailIcon className={styles.socialIcon} />
          </a>
        )}
        {messenger && (
          <a
            href={messenger}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialButton}
            aria-label="Message Jojo on Facebook"
          >
            <FacebookIcon className={styles.socialIcon} />
          </a>
        )}
      </div>

      <a href="/card/vcard" className={styles.saveButton}>
        Save to Contacts
      </a>

      <CardExchangeForm />

      <nav className={styles.links}>
        <Link href="/">Main site</Link>
        <a href={SAFETY_MARGIN_URL}>Safety Margin</a>
        {settings?.facebookUrl && (
          <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer">
            Facebook
          </a>
        )}
        {settings?.linkedinUrl && (
          <a href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        )}
        {settings?.instagramUrl && (
          <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
        )}
      </nav>

      <a href={settings?.bookingUrl || CALENDLY_URL} className={styles.footerCta}>
        Prefer to talk? Book a free 30-minute call
      </a>
    </main>
  );
}
