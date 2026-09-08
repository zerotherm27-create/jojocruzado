import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SAFETY_MARGIN_URL } from "@/config/site";
import { getSiteSettings, resolveImage } from "@/lib/supabase/queries";
import styles from "./page.module.css";

// Revalidate so a new photo published in /admin shows up within a minute
// instead of needing a redeploy.
export const revalidate = 60;

export const metadata: Metadata = {
  title: "About",
  description:
    "I'm Jojo Cruzado, a Sun Life Financial Advisor. I help people organize the financial side of the life they're already working hard to build.",
};

const audiences = [
  "Business owners",
  "Doctors and licensed professionals",
  "Young families",
  "Young professionals",
];

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <main>
      <section className={`band-navy ${styles.heroSection}`}>
        {/* Falls back to the placeholder file until a real photo is uploaded in
            /admin -> Site Settings -> About page photo. */}
        <Image
          src={resolveImage(settings?.aboutImage, "/images/jojo-about.png", 1600, 900)}
          alt={settings?.aboutImageAlt || "Placeholder for a portrait of Jojo Cruzado"}
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
              About Jojo
            </span>
            <h1 className={`h1-sub ${styles.heroTitle}`}>
              Financial planning is personal. Your advice should be too.
            </h1>
            <p className={`lead ${styles.heroLead}`}>
              I&apos;m Jojo Cruzado, a Sun Life Financial Advisor. I help people organize the
              financial side of the life they&apos;re already working hard to build.
            </p>
          </div>
        </div>
      </section>

      <section className="band-white">
        <div className={`container autogrid ${styles.columns}`}>
          <div className={`stack ${styles.column}`}>
            <h2 className={styles.columnTitle}>How I got here</h2>
            {/* TODO(compliance): Jojo's real background. Credentials, awards, years of
                experience and client counts must not be published until confirmed. */}
            <p className={styles.prose}>
              Placeholder: Jojo&apos;s real background, professional experience and advisor journey
              go here. Nothing about credentials, awards or years of experience should be published
              until it is confirmed.
            </p>
            <p className={styles.prose}>
              Placeholder: entrepreneurship experience, family perspective and community
              involvement, if Jojo wants these public.
            </p>
          </div>

          <div className={`stack ${styles.column}`}>
            <h2 className={styles.columnTitle}>How I work with clients</h2>
            <p className={styles.prose}>
              We start with your situation, not a product. I ask about income, responsibilities,
              existing protection and what you want the next few years to look like.
            </p>
            <p className={styles.prose}>
              From there we sort priorities together. If a solution makes sense, we talk about it
              properly. If it can wait, I&apos;ll say so.
            </p>
            <p className={`pull-quote ${styles.quote}`}>The goal is clarity before commitment.</p>
          </div>
        </div>
      </section>

      <section className="band-surface-top">
        <div className={`container ${styles.band}`}>
          <h2 className="h2-band">Who I typically help</h2>
          <div className={`autogrid ${styles.chipGrid}`}>
            {audiences.map((audience) => (
              <div key={audience} className={styles.chip}>
                {audience}
              </div>
            ))}
          </div>

          {/* Required verbatim: the advisor/corporate distinction (handoff README). */}
          <div className={styles.disclosure}>
            <h3 className={styles.disclosureTitle}>Advisor disclosure</h3>
            <p className={styles.disclosureBody}>
              Jojo Cruzado is a Sun Life Financial Advisor. This is his personal advisor website and
              is not the official corporate website of Sun Life Philippines. Product information,
              where discussed, should be verified against official Sun Life materials and applicable
              policy contracts.
            </p>
          </div>

          <div className={styles.ctaRow}>
            <Link href={SAFETY_MARGIN_URL} className="btn btn-navy">
              Check My Safety Margin
            </Link>
            <Link href="/contact" className="btn btn-outline-light">
              Talk to Jojo
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
