import type { Metadata } from "next";
import ArticleCard from "@/components/ArticleCard";
import { articles } from "@/content/insights";
import styles from "./page.module.css";

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

export default function InsightsPage() {
  return (
    <main>
      <section className="band-surface-bottom">
        <div className={`container ${styles.hero}`}>
          <span className="eyebrow" style={{ color: "var(--ink-500)" }}>
            Insights
          </span>
          <h1 className={`h1-sub ${styles.heroTitle}`}>Practical financial conversations.</h1>
          {/* TODO: category pills are display-only — wire to real filters when the CMS exists. */}
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
        <div className={`container ${styles.body}`}>
          <div className={`autogrid ${styles.grid}`}>
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} headingLevel="h2" />
            ))}
          </div>
          <p className={styles.note}>More practical financial conversations are coming soon.</p>
        </div>
      </section>
    </main>
  );
}
