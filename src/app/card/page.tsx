import Image from "next/image";
import Link from "next/link";
import CardExchangeForm from "./CardExchangeForm";
import { EmailIcon, FacebookIcon, MessageIcon, PhoneIcon, ViberIcon, WebsiteIcon } from "./icons";
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
        className={`${styles.avatar} ${styles.enter}`}
        priority
      />
      <h1 className={`${styles.name} ${styles.enter}`} style={{ animationDelay: "45ms" }}>
        {CARD_FULL_NAME}
      </h1>
      <p className={`${styles.title} ${styles.enter}`} style={{ animationDelay: "90ms" }}>
        {title}
      </p>
      <p className={`${styles.bio} ${styles.enter}`} style={{ animationDelay: "135ms" }}>
        {bio}
      </p>

      <div className={`${styles.socialRow} ${styles.enter}`} style={{ animationDelay: "180ms" }}>
        {phone && (
          <a href={`tel:${phone}`} className={styles.socialButton} aria-label="Call Jojo">
            <PhoneIcon className={styles.socialIcon} />
          </a>
        )}
        {phone && (
          <a href={`sms:${phone}`} className={styles.socialButton} aria-label="Text Jojo">
            <MessageIcon className={styles.socialIcon} />
          </a>
        )}
        {viber && (
          <a
            href={`viber://chat?number=${encodeURIComponent(sanitizeForViber(viber))}`}
            className={styles.socialButton}
            aria-label="Message Jojo on Viber"
          >
            <ViberIcon className={styles.socialIcon} />
          </a>
        )}
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

      <a
        href="/card/vcard"
        className={`${styles.saveButton} ${styles.enter}`}
        style={{ animationDelay: "225ms" }}
      >
        Save to Contacts
      </a>

      <CardExchangeForm />

      <nav className={`${styles.links} ${styles.enter}`} style={{ animationDelay: "315ms" }}>
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

      <a
        href={settings?.bookingUrl || CALENDLY_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.footerCta} ${styles.enter}`}
        style={{ animationDelay: "360ms" }}
      >
        Prefer to talk? Book a free 30-minute call
      </a>
    </main>
  );
}
