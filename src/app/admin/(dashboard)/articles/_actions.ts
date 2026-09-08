"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import DOMPurify from "isomorphic-dompurify";
import type { SupabaseClient } from "@supabase/supabase-js";
import { requireAdmin } from "@/lib/supabase/admin";
import { createServiceRoleClient } from "@/lib/supabase/client";
import { uploadImage } from "@/lib/supabase/storage";
import { slugify } from "@/lib/slug";

const ALLOWED_TAGS = ["p", "strong", "em", "h2", "h3", "ul", "ol", "li", "blockquote", "a", "br"];
const ALLOWED_ATTR = ["href", "target", "rel"];

// Sanitized once here, at the point admin-authored HTML enters storage --
// the same boundary-validation pattern this codebase already uses for image
// uploads (sniffImageType in src/lib/supabase/storage.ts) -- rather than at
// every future render site.
function sanitizeBody(html: string): string {
  return DOMPurify.sanitize(html, { ALLOWED_TAGS, ALLOWED_ATTR });
}

function revalidateArticles(slug?: string) {
  revalidatePath("/");
  revalidatePath("/insights");
  if (slug) revalidatePath(`/insights/${slug}`);
  revalidatePath("/admin/articles");
}

function readFields(formData: FormData) {
  return {
    category: String(formData.get("category") || ""),
    title: String(formData.get("title") || ""),
    dek: String(formData.get("dek") || ""),
    body: String(formData.get("body") || ""),
    readTime: String(formData.get("readTime") || ""),
    imageAlt: String(formData.get("imageAlt") || ""),
    file: formData.get("image"),
  };
}

// Generated once at creation and never changed afterward, so article URLs
// stay stable across later title edits.
async function generateUniqueSlug(supabase: SupabaseClient, title: string): Promise<string> {
  const base = slugify(title) || "article";
  const { data } = await supabase.from("articles").select("slug").ilike("slug", `${base}%`);
  const existing = new Set((data ?? []).map((row: { slug: string }) => row.slug));

  if (!existing.has(base)) return base;

  let suffix = 2;
  while (existing.has(`${base}-${suffix}`)) suffix++;
  return `${base}-${suffix}`;
}

export async function createArticle(formData: FormData) {
  await requireAdmin();
  const supabase = createServiceRoleClient();
  const { category, title, dek, body, readTime, imageAlt, file } = readFields(formData);

  if (!title.trim() || !dek.trim() || !body.trim() || !readTime.trim()) {
    redirect(`/admin/articles/new?error=${encodeURIComponent("Fill in title, dek, body, and read time.")}`);
  }

  let imageUrl: string | null = null;

  if (file instanceof File && file.size > 0) {
    try {
      imageUrl = await uploadImage(supabase, "articles", crypto.randomUUID(), file);
    } catch (uploadError) {
      console.error("Article image upload failed", uploadError);
      const message = uploadError instanceof Error ? uploadError.message : "Image upload failed.";
      redirect(`/admin/articles/new?error=${encodeURIComponent(message)}`);
    }
  }

  const slug = await generateUniqueSlug(supabase, title);

  const { error } = await supabase.from("articles").insert({
    category,
    title,
    dek,
    body: sanitizeBody(body),
    slug,
    read_time: readTime,
    image_url: imageUrl,
    image_alt: imageAlt,
  });

  if (error) {
    redirect(`/admin/articles/new?error=${encodeURIComponent(error.message)}`);
  }

  revalidateArticles(slug);
  redirect("/admin/articles");
}

export async function updateArticle(id: string, formData: FormData) {
  await requireAdmin();
  const supabase = createServiceRoleClient();
  const { category, title, dek, body, readTime, imageAlt, file } = readFields(formData);

  if (!title.trim() || !dek.trim() || !body.trim() || !readTime.trim()) {
    redirect(`/admin/articles/${id}/edit?error=${encodeURIComponent("Fill in title, dek, body, and read time.")}`);
  }

  const update: Record<string, unknown> = {
    category,
    title,
    dek,
    body: sanitizeBody(body),
    read_time: readTime,
    image_alt: imageAlt,
  };

  if (file instanceof File && file.size > 0) {
    try {
      update.image_url = await uploadImage(supabase, "articles", crypto.randomUUID(), file);
    } catch (uploadError) {
      console.error("Article image upload failed", uploadError);
      const message = uploadError instanceof Error ? uploadError.message : "Image upload failed.";
      redirect(`/admin/articles/${id}/edit?error=${encodeURIComponent(message)}`);
    }
  }

  const { error } = await supabase.from("articles").update(update).eq("id", id);

  if (error) {
    redirect(`/admin/articles/${id}/edit?error=${encodeURIComponent(error.message)}`);
  }

  const { data: existing } = await supabase.from("articles").select("slug").eq("id", id).maybeSingle();
  revalidateArticles(existing?.slug);
  redirect("/admin/articles");
}

export async function deleteArticle(id: string) {
  await requireAdmin();
  const supabase = createServiceRoleClient();
  const { data: existing } = await supabase.from("articles").select("slug").eq("id", id).maybeSingle();
  await supabase.from("articles").delete().eq("id", id);
  revalidateArticles(existing?.slug);
  redirect("/admin/articles");
}
