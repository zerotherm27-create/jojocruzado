import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import SlotImage from "@/components/SlotImage";
import { SAFETY_MARGIN_URL } from "@/config/site";
import { getArticleBySlug } from "@/lib/supabase/queries";
import styles from "./page.module.css";

// Revalidate so an article published/edited in /admin shows up here within a
// minute instead of needing a redeploy.
export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Insights" };
  return { title: article.title, description: article.dek };
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  return (
    <main>
      <section className="band-surface-bottom">
        <div className={`container-prose ${styles.hero}`}>
          <Link href="/insights" className={styles.back}>
            &larr; All insights
          </Link>
          <span className="kicker">{article.category}</span>
          <h1 className={`h1-sub ${styles.title}`}>{article.title}</h1>
          <span className={styles.readTime}>{article.readTime}</span>
        </div>
      </section>

      {article.image && (
        <section className="band-white">
          <div className={`container-prose ${styles.imageWrap}`}>
            <SlotImage
              src={article.image}
              alt={article.imageAlt}
              ratio="16 / 9"
              radius={16}
              sizes="(max-width: 900px) 100vw, 820px"
              priority
            />
          </div>
        </section>
      )}

      <section className="band-white">
        <div className={`container-prose ${styles.body}`}>
          {/* article.body is sanitized server-side before it's ever stored
              (see admin _actions.ts) -- scoped to admin-authored,
              already-sanitized HTML only. */}
          <div
            className={styles.prose}
            dangerouslySetInnerHTML={{ __html: article.body ?? `<p>${article.dek}</p>` }}
          />
        </div>
      </section>

      <section className="band-navy">
        <div className={`container ${styles.closing}`}>
          <h2 className="h2-section">Ready to talk it through.</h2>
          <div className={styles.ctaRow}>
            <Link href={SAFETY_MARGIN_URL} target="_blank" rel="noopener noreferrer" className="btn btn-gold">
              Check My Safety Margin
            </Link>
            <Link href="/contact" className="btn btn-outline-dark">
              Talk to Jojo
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
