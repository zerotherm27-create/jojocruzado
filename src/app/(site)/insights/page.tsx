import type { Metadata } from "next";
import ArticleCard from "@/components/ArticleCard";
import { articles as fallbackArticles } from "@/content/insights";
import { getArticles } from "@/lib/supabase/queries";
import Reveal from "@/components/Reveal";
import styles from "./page.module.css";

// Revalidate so a new article published in the Studio shows up within a minute
// instead of needing a redeploy.
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Insights",
  description: "Practical financial conversations.",
};

const categories = [
  "Financial Foundation",
  "Protection",
  "Business",
  "Professionals",
  "Family",
  "Retirement",
];

export default async function InsightsPage() {
  const sanityArticles = await getArticles();
  const articles = sanityArticles.length > 0 ? sanityArticles : fallbackArticles;

  return (
    <main>
      <section className="band-surface-bottom">
        <div className={`container ${styles.hero}`}>
          <span className="eyebrow" style={{ color: "var(--ink-500)" }}>
            Insights
          </span>
          <h1 className={`h1-sub ${styles.heroTitle}`}>Practical financial conversations.</h1>
          {/* TODO: category pills are display-only — filtering itself isn't built yet,
              only content storage (the CMS) is. */}
          <div className={styles.pills}>
            {categories.map((category) => (
              <span key={category} className={styles.pill}>
                {category}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="band-white">
        <Reveal className={`container ${styles.body}`}>
          <div className={`autogrid ${styles.grid}`}>
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} headingLevel="h2" />
            ))}
          </div>
          <p className={styles.note}>More practical financial conversations are coming soon.</p>
        </Reveal>
      </section>
    </main>
  );
}
