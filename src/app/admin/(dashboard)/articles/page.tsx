import Link from "next/link";
import { createServiceRoleClient } from "@/lib/supabase/client";
import { deleteArticle } from "./_actions";
import styles from "../../admin.module.css";

export const dynamic = "force-dynamic";

type ArticleRow = {
  id: string;
  title: string;
  category: string;
  read_time: string;
  image_url: string | null;
};

export default async function ArticlesListPage() {
  const supabase = createServiceRoleClient();
  const { data } = await supabase
    .from("articles")
    .select("id, title, category, read_time, image_url")
    .order("created_at", { ascending: false });

  const articles = (data ?? []) as ArticleRow[];

  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Insights articles</h1>
        <Link href="/admin/articles/new" className={styles.button}>
          New article
        </Link>
      </div>

      {articles.length === 0 ? (
        <div className={styles.empty}>
          No articles yet — the site is showing its built-in placeholder articles instead.
        </div>
      ) : (
        <div className={styles.list}>
          {articles.map((article) => (
            <div key={article.id} className={styles.row}>
              {article.image_url && (
                <img src={article.image_url} alt="" className={styles.rowThumb} />
              )}
              <div className={styles.rowBody}>
                <div className={styles.rowTitle}>{article.title}</div>
                <div className={styles.rowMeta}>
                  {article.category} · {article.read_time}
                </div>
              </div>
              <div className={styles.rowActions}>
                <Link href={`/admin/articles/${article.id}/edit`} className={styles.buttonSecondary}>
                  Edit
                </Link>
                <form action={deleteArticle.bind(null, article.id)}>
                  <button type="submit" className={styles.buttonDanger}>
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
