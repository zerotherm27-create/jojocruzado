import Image from "next/image";
import Link from "next/link";
import { needs } from "@/content/needs";
import { SAFETY_MARGIN_URL } from "@/config/site";
import { getSiteSettings, resolveImage } from "@/lib/supabase/queries";
import Reveal from "@/components/Reveal";
import { pageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

// Revalidate so a new photo published in /admin shows up within a minute
// instead of needing a redeploy.
export const revalidate = 60;

export const metadata = pageMetadata({
  title: "How I Help",
  description:
    "These are the areas we usually look at together. Which ones matter most depends entirely on where you are right now.",
  path: "/how-i-help",
});

export default async function HowIHelpPage() {
  const settings = await getSiteSettings();

  return (
    <main>
      <section className={`band-navy ${styles.heroSection}`}>
        {/* Falls back to the placeholder file until a real photo is uploaded in
            /admin -> Site Settings -> How I Help photo. */}
        <Image
          src={resolveImage(settings?.howIHelpImage, "/images/jojo-about.png", 1600, 900)}
          alt={settings?.howIHelpImageAlt || "Placeholder for a portrait of Jojo Cruzado"}
          fill
          sizes="100vw"
          priority
          className={styles.heroMedia}
          style={{ objectFit: "cover", objectPosition: "78% 30%" }}
        />
        <div className={`scrim-navy ${styles.heroScrim}`} />
        <div className={`container ${styles.heroInner}`}>
          <div className={`stack ${styles.heroText}`}>
            <span className="eyebrow" style={{ color: "var(--accent)" }}>
              How I help
            </span>
            <h1 className={`h1-sub ${styles.heroTitle}`}>Organized around needs, not products.</h1>
            <p className={`lead ${styles.heroLead}`}>
              These are the areas we usually look at together. Which ones matter most depends entirely
              on where you are right now.
            </p>
          </div>
        </div>
      </section>

      <section className="band-white">
        <Reveal className={`container autogrid ${styles.cards}`}>
          {needs.map((need) => (
            <div key={need.id} className={styles.card}>
              <h2 className={styles.cardTitle}>{need.title}</h2>
              <p className={`body ${styles.cardBody}`}>{need.body}</p>
              <span className={styles.cardNote}>
                The right priority depends on your current situation.
              </span>
            </div>
          ))}
        </Reveal>
      </section>

      <section className="band-surface-top">
        <Reveal className={`container ${styles.closing}`}>
          <p className={styles.closingText}>
            Not sure which of these applies to you? That&apos;s what the check is for.
          </p>
          <Link href={SAFETY_MARGIN_URL} target="_blank" rel="noopener noreferrer" className="btn btn-gold">
            Check My Safety Margin
          </Link>
          {/* Quiet reference only. The eight need-categories above stay the structure of
              this page; product material sits one link away, never in front of it. */}
          <p className={styles.materialNote}>
            If you would rather read Sun Life&apos;s own product material first, you can{" "}
            <Link href="/resources">read it here</Link>.
          </p>
        </Reveal>
      </section>
    </main>
  );
}
