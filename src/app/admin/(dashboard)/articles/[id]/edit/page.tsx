import { notFound } from "next/navigation";
import ArticleForm from "@/app/admin/_components/ArticleForm";
import { createServiceRoleClient } from "@/lib/supabase/client";
import { updateArticle } from "../../_actions";
import styles from "../../../../admin.module.css";

export default async function EditArticlePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;

  const supabase = createServiceRoleClient();
  const { data: article } = await supabase
    .from("articles")
    .select("category, title, dek, body, read_time, image_url, image_alt")
    .eq("id", id)
    .maybeSingle();

  if (!article) notFound();

  return (
    <>
      <h1 className={styles.title}>Edit article</h1>
      <ArticleForm
        action={updateArticle.bind(null, id)}
        submitLabel="Save changes"
        error={error}
        initial={{
          category: article.category,
          title: article.title,
          dek: article.dek,
          body: article.body ?? undefined,
          readTime: article.read_time,
          imageUrl: article.image_url,
          imageAlt: article.image_alt,
        }}
      />
    </>
  );
}
