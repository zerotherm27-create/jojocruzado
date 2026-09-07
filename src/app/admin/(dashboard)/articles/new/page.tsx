import ArticleForm from "@/app/admin/_components/ArticleForm";
import { createArticle } from "../_actions";
import styles from "../../../admin.module.css";

export default async function NewArticlePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <>
      <h1 className={styles.title}>New article</h1>
      <ArticleForm action={createArticle} submitLabel="Create article" error={error} />
    </>
  );
}
