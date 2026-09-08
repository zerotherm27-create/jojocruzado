import Image from "next/image";
import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import { articles as fallbackArticles } from "@/content/insights";
import { getArticles, getSiteSettings, resolveImage } from "@/lib/supabase/queries";
import { siteConfig, SAFETY_MARGIN_URL } from "@/config/site";
import styles from "./page.module.css";

// Revalidate so a new article or photo published in /admin shows up within a
// minute instead of needing a redeploy.
export const revalidate = 60;

const audiences = [
  {
    title: "Business Owners",
    body: "Protect the life you've built while preparing your business, family and people for what comes next.",
    cta: "For Business Owners",
  },
  {
    title: "Professionals",
    body: "Turn strong income into a financial structure that supports your responsibilities, lifestyle and long-term goals.",
    cta: "For Professionals",
  },
  {
    title: "Families",
    body: "Build a practical safety net around your family's income, health, education and future plans.",
    cta: "For Families",
  },
  {
    title: "Young Professionals",
    body: "Start with the right financial foundation and build from there, one priority at a time.",
    cta: "Start Your Foundation",
  },
];

const frameworkLayers = [
  { number: "01", title: "Cash Flow", body: "Where your income actually goes each month." },
  {
    number: "02",
    title: "Emergency Fund",
    body: "The buffer that keeps a surprise from becoming a setback.",
  },
  {
    number: "03",
    title: "Health & Protection",
    body: "What is already covered, and what is still on you.",
  },
  {
    number: "04",
    title: "Long-Term Goals",
    body: "Education, retirement and the plans with a date on them.",
  },
  {
    number: "05",
    title: "Growth & Wealth",
    body: "Building on the foundation once it can hold weight.",
  },
  {
    number: "06",
    title: "Legacy / Estate",
    body: "How things pass on, with the right professionals involved.",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Understand",
    body: "We talk about your current situation, priorities and responsibilities.",
  },
  {
    number: "02",
    title: "Identify",
    body: "We look for gaps, overlaps and areas that may deserve more attention.",
  },
  {
    number: "03",
    title: "Plan",
    body: "We organize your priorities and discuss practical options that fit your situation.",
  },
  {
    number: "04",
    title: "Review",
    body: "As life changes, we revisit the plan and adjust where needed.",
  },
];

const reasons = [
  {
    title: "Practical",
    body: "Recommendations should make sense in real life and within your budget.",
  },
  { title: "Personal", body: "Your priorities come before a product recommendation." },
  {
    title: "Long-Term",
    body: "Good financial planning is an ongoing relationship, not a one-time transaction.",
  },
  {
    title: "Educational",
    body: "You should understand why you're making a financial decision before committing to it.",
  },
];

export default async function HomePage() {
  const layers = siteConfig.showLegacyLayer ? frameworkLayers : frameworkLayers.slice(0, 5);
  const steps = siteConfig.showReviewStep ? processSteps : processSteps.slice(0, 3);

  const [sanityArticles, settings] = await Promise.all([getArticles(), getSiteSettings()]);
  const articles = (sanityArticles.length > 0 ? sanityArticles : fallbackArticles).slice(0, 3);

  return (
    <main>
      <section className={`band-navy ${styles.heroSection}`}>
        {/* Falls back to the placeholder file until a real photo is uploaded in
            /admin -> Site Settings -> Homepage hero photo. */}
        <Image
          src={resolveImage(settings?.heroImage, "/images/jojo-hero.png", 1600, 900)}
          alt={settings?.heroImageAlt || "Placeholder for a portrait of Jojo Cruzado"}
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
              Sun Life Financial Advisor
            </span>
            <h1 className={`h1-hero ${styles.heroTitle}`}>
              Clear Guidance.
              <br />
              Practical Protection.
            </h1>
            <p className={`lead ${styles.heroLead}`}>
              I help professionals, families, and business owners understand their financial
              picture, see what may need attention, and make practical decisions without feeling
              pressured.
            </p>
            <div className={styles.heroButtons}>
              <Link href={SAFETY_MARGIN_URL} className="btn btn-gold">
                Check My Safety Margin
              </Link>
              <Link href="/contact" className="btn btn-outline-dark">
                Talk to Jojo
              </Link>
            </div>
            <span className={styles.heroNote}>Start with clarity. No pressure to commit.</span>
          </div>
        </div>
      </section>

      <section className="band-white">
        <div className={`container autogrid ${styles.band} ${styles.intro}`}>
          <h2 className="h2-section">Financial advice should start with understanding you.</h2>
          <div className={`stack ${styles.introCopy}`}>
            <p className="lead" style={{ color: "var(--ink-500)" }}>
              Before talking about any solution, I prefer to understand the bigger picture first:
              your income, responsibilities, goals, existing protection and what matters most to
              you.
            </p>
            <p className="lead" style={{ color: "var(--ink-500)" }}>
              From there, we can see what is already working, what may need attention and which
              priorities actually make sense for your situation.
            </p>
            <p className={`pull-quote ${styles.introQuote}`}>
              Advice first. Solutions only when they make sense.
            </p>
          </div>
        </div>
      </section>

      <section className="band-surface">
        <div className={`container ${styles.band}`}>
          <span className="eyebrow" style={{ color: "var(--ink-500)" }}>
            Who I help
          </span>
          <h2 className={`h2-section ${styles.audienceHeading}`}>
            Different lives. Different financial priorities.
          </h2>
          <div className={`autogrid ${styles.gridTop} ${styles.audienceGrid}`}>
            {audiences.map((audience) => (
              <div
                key={audience.title}
                className={`card card-shadow ${styles.audienceCard}`}
              >
                <span className="rule-gold" />
                <h3 className="h3-card">{audience.title}</h3>
                <p className="body">{audience.body}</p>
                <Link href="/how-i-help" className="arrow-link">
                  {audience.cta} &rarr;
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="band-white">
        <div className={`container ${styles.band}`}>
          <div className={`stack ${styles.frameworkIntro}`}>
            {/* Gold eyebrow on a white band — needs the AA-safe gold, not --accent. */}
            <span className="eyebrow" style={{ color: "var(--accent-on-light)" }}>
              The Safety Margin framework
            </span>
            <h2 className="h2-section">How strong is your financial safety margin?</h2>
            <p className="lead" style={{ color: "var(--ink-500)" }}>
              A strong financial life isn&apos;t built around one product. It&apos;s built by
              understanding how the important pieces work together.
            </p>
          </div>
          <div className={`autogrid ${styles.gridTop} ${styles.frameworkGrid}`}>
            {layers.map((layer) => (
              <div key={layer.number} className={styles.tile}>
                <span className={styles.tileNumber}>{layer.number}</span>
                <h3 className={styles.tileTitle}>{layer.title}</h3>
                <p className={styles.tileBody}>{layer.body}</p>
              </div>
            ))}
          </div>
          <div className={styles.frameworkCta}>
            <Link href={SAFETY_MARGIN_URL} className="btn btn-navy">
              Check My Financial Picture
            </Link>
            <span className={styles.frameworkCtaNote}>
              Not every part applies to everyone. That&apos;s the point of looking first.
            </span>
          </div>
        </div>
      </section>

      <section className="band-surface">
        <div className={`container ${styles.band}`}>
          <h2 className="h2-section">A simpler way to start.</h2>
          <div className={`autogrid ${styles.gridTop} ${styles.processGrid}`}>
            {steps.map((step) => (
              <div key={step.number} className={styles.step}>
                <span className={styles.stepNumber}>{step.number}</span>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className="body">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="band-white">
        <div className={`container ${styles.band}`}>
          <h2 className="h2-section">More clarity. Less pressure.</h2>
          <div className={`autogrid ${styles.gridTop} ${styles.whyGrid}`}>
            {reasons.map((reason) => (
              <div key={reason.title} className={styles.whyCard}>
                <h3 className={styles.whyTitle}>{reason.title}</h3>
                <p className={`body ${styles.whyBody}`}>{reason.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`band-story ${styles.storySection}`}>
        {/* Falls back to the placeholder file until a real photo is uploaded in
            /admin -> Site Settings -> "Personal story" photo. */}
        <Image
          src={resolveImage(settings?.storyImage, "/images/jojo-story.png", 1600, 1000)}
          alt={settings?.storyImageAlt || "Placeholder for a photo of Jojo Cruzado at his desk"}
          fill
          sizes="100vw"
          className={styles.storyMedia}
          style={{ objectFit: "cover", objectPosition: "22% 35%" }}
        />
        <div
          className={`scrim-navy ${styles.storyScrim}`}
          style={{ "--scrim-angle": "270deg" } as React.CSSProperties}
        />
        <div className={`container ${styles.storyInner}`}>
          <div className={`stack ${styles.storyText}`}>
            <span className="eyebrow" style={{ color: "var(--accent)" }}>
              Personal
            </span>
            <h2 className={`h2-section ${styles.storyHeading}`}>
              Why I became a financial advisor.
            </h2>
            {/* Adapted from Jojo's own story on safetymargin.app's About section —
                real, already-published content, not invented. Condensed for this
                teaser; the fuller version lives on /about. */}
            <p className={`lead ${styles.storyBody}`}>
              When I moved to Singapore as a Field Service Engineer, I thought the hard part was
              over. Good salary, better life ahead. I was wrong. Like a lot of OFWs, the income
              went up, but the savings didn&apos;t.
            </p>
            <p className={`lead ${styles.storyBody}`}>
              That wake-up call led me to a community of Filipinos asking the same hard questions
              about money. We learned investing, business and personal development together, and
              slowly built things I&apos;m still proud of today.
            </p>
            <p className={`lead ${styles.storyBody}`}>
              In 2018, I came home to help run what we&apos;d built with my family. I joined Sun Life
              because insurance was the one piece I kept seeing missing, even in people who
              were already doing everything else right.
            </p>
            <Link href="/about" className="arrow-link arrow-link-gold">
              More About Jojo &rarr;
            </Link>
          </div>
        </div>
      </section>

      <section className="band-white">
        <div className={`container ${styles.band}`}>
          <div className={styles.insightsHead}>
            <h2 className="h2-section">Practical financial conversations.</h2>
            <Link href="/insights" className="arrow-link">
              All insights &rarr;
            </Link>
          </div>
          <div className={`autogrid ${styles.gridTop} ${styles.insightsGrid}`}>
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>

      <section className="band-navy">
        <div className={`container ${styles.band} ${styles.closing}`}>
          <h2 className={`h2-section ${styles.closingHeading}`}>
            You don&apos;t need to figure everything out today.
          </h2>
          <p className={`lead ${styles.closingLead}`}>
            Start by understanding where you are. From there, we can decide what deserves attention
            and what can wait.
          </p>
          <div className={styles.closingButtons}>
            <Link href={SAFETY_MARGIN_URL} className="btn btn-gold">
              Check My Safety Margin
            </Link>
            <Link href="/contact" className="btn btn-outline-dark">
              Talk to Jojo
            </Link>
          </div>
          <span className={styles.closingNote}>No pressure. Just a clearer financial picture.</span>
        </div>
      </section>
    </main>
  );
}
