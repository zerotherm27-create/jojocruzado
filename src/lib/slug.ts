// Mirrors the backfill rule in supabase/migrations/0005_article_body_and_slug.sql
// exactly, so application-generated slugs and DB-backfilled slugs follow one rule.
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
