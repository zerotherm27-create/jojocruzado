import Link from "next/link";
import type { Article } from "@/content/insights";
import SlotImage from "./SlotImage";
import styles from "./ArticleCard.module.css";

type Props = {
  article: Article;
  /* h2 where the card is the page's main content (/insights), h3 under a section heading (home). */
  headingLevel?: "h2" | "h3";
};

export default function ArticleCard({ article, headingLevel = "h3" }: Props) {
  const Heading = headingLevel;

  return (
    <Link href={`/insights/${article.slug}`} className={styles.card}>
      <SlotImage
        src={article.image}
        alt={article.imageAlt}
        ratio="16 / 10"
        sizes="(max-width: 900px) 100vw, 33vw"
      />
      <div className={styles.body}>
        <span className="kicker">{article.category}</span>
        <Heading className={styles.title}>{article.title}</Heading>
        <p className={styles.dek}>{article.dek}</p>
        <span className={styles.readTime}>{article.readTime}</span>
      </div>
    </Link>
  );
}
