"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/admin";
import { createServiceRoleClient } from "@/lib/supabase/client";
import { uploadImage } from "@/lib/supabase/storage";

function revalidateArticles() {
  revalidatePath("/");
  revalidatePath("/insights");
  revalidatePath("/admin/articles");
}

function readFields(formData: FormData) {
  return {
    category: String(formData.get("category") || ""),
    title: String(formData.get("title") || ""),
    dek: String(formData.get("dek") || ""),
    readTime: String(formData.get("readTime") || ""),
    imageAlt: String(formData.get("imageAlt") || ""),
    file: formData.get("image"),
  };
}

export async function createArticle(formData: FormData) {
  await requireAdmin();
  const supabase = createServiceRoleClient();
  const { category, title, dek, readTime, imageAlt, file } = readFields(formData);

  if (!title.trim() || !dek.trim() || !readTime.trim()) {
    redirect(`/admin/articles/new?error=${encodeURIComponent("Fill in title, dek, and read time.")}`);
  }

  let imageUrl: string | null = null;

  if (file instanceof File && file.size > 0) {
    try {
      imageUrl = await uploadImage(supabase, "articles", crypto.randomUUID(), file);
    } catch (uploadError) {
      const message = uploadError instanceof Error ? uploadError.message : "Image upload failed.";
      redirect(`/admin/articles/new?error=${encodeURIComponent(message)}`);
    }
  }

  const { error } = await supabase.from("articles").insert({
    category,
    title,
    dek,
    read_time: readTime,
    image_url: imageUrl,
    image_alt: imageAlt,
  });

  if (error) {
    redirect(`/admin/articles/new?error=${encodeURIComponent(error.message)}`);
  }

  revalidateArticles();
  redirect("/admin/articles");
}

export async function updateArticle(id: string, formData: FormData) {
  await requireAdmin();
  const supabase = createServiceRoleClient();
  const { category, title, dek, readTime, imageAlt, file } = readFields(formData);

  if (!title.trim() || !dek.trim() || !readTime.trim()) {
    redirect(`/admin/articles/${id}/edit?error=${encodeURIComponent("Fill in title, dek, and read time.")}`);
  }

  const update: Record<string, unknown> = {
    category,
    title,
    dek,
    read_time: readTime,
    image_alt: imageAlt,
  };

  if (file instanceof File && file.size > 0) {
    try {
      update.image_url = await uploadImage(supabase, "articles", crypto.randomUUID(), file);
    } catch (uploadError) {
      const message = uploadError instanceof Error ? uploadError.message : "Image upload failed.";
      redirect(`/admin/articles/${id}/edit?error=${encodeURIComponent(message)}`);
    }
  }

  const { error } = await supabase.from("articles").update(update).eq("id", id);

  if (error) {
    redirect(`/admin/articles/${id}/edit?error=${encodeURIComponent(error.message)}`);
  }

  revalidateArticles();
  redirect("/admin/articles");
}

export async function deleteArticle(id: string) {
  await requireAdmin();
  const supabase = createServiceRoleClient();
  await supabase.from("articles").delete().eq("id", id);
  revalidateArticles();
  redirect("/admin/articles");
}
