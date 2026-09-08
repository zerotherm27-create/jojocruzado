"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/admin";
import { createServiceRoleClient } from "@/lib/supabase/client";
import { uploadImage } from "@/lib/supabase/storage";

function revalidateArtcards() {
  revalidatePath("/resources");
  revalidatePath("/admin/artcards");
}

function readFields(formData: FormData) {
  return {
    needId: String(formData.get("needId") || ""),
    productName: String(formData.get("productName") || "").trim() || null,
    issuedOn: String(formData.get("issuedOn") || "").trim() || null,
    imageAlt: String(formData.get("imageAlt") || ""),
    file: formData.get("image"),
  };
}

export async function createArtcard(formData: FormData) {
  await requireAdmin();
  const supabase = createServiceRoleClient();
  const { needId, productName, issuedOn, imageAlt, file } = readFields(formData);

  if (!(file instanceof File) || file.size === 0) {
    redirect(`/admin/artcards/new?error=${encodeURIComponent("Upload an artcard image.")}`);
  }

  let imageUrl: string;
  try {
    imageUrl = await uploadImage(supabase, "artcards", crypto.randomUUID(), file as File);
  } catch (uploadError) {
    console.error("Artcard image upload failed", uploadError);
    const message = uploadError instanceof Error ? uploadError.message : "Image upload failed.";
    redirect(`/admin/artcards/new?error=${encodeURIComponent(message)}`);
  }

  const { error } = await supabase.from("artcards").insert({
    need_id: needId,
    image_url: imageUrl,
    image_alt: imageAlt,
    product_name: productName,
    issued_on: issuedOn,
  });

  if (error) {
    redirect(`/admin/artcards/new?error=${encodeURIComponent(error.message)}`);
  }

  revalidateArtcards();
  redirect("/admin/artcards");
}

export async function updateArtcard(id: string, formData: FormData) {
  await requireAdmin();
  const supabase = createServiceRoleClient();
  const { needId, productName, issuedOn, imageAlt, file } = readFields(formData);

  const update: Record<string, unknown> = {
    need_id: needId,
    image_alt: imageAlt,
    product_name: productName,
    issued_on: issuedOn,
  };

  if (file instanceof File && file.size > 0) {
    try {
      update.image_url = await uploadImage(supabase, "artcards", crypto.randomUUID(), file);
    } catch (uploadError) {
      console.error("Artcard image upload failed", uploadError);
      const message = uploadError instanceof Error ? uploadError.message : "Image upload failed.";
      redirect(`/admin/artcards/${id}/edit?error=${encodeURIComponent(message)}`);
    }
  }

  const { error } = await supabase.from("artcards").update(update).eq("id", id);

  if (error) {
    redirect(`/admin/artcards/${id}/edit?error=${encodeURIComponent(error.message)}`);
  }

  revalidateArtcards();
  redirect("/admin/artcards");
}

export async function deleteArtcard(id: string) {
  await requireAdmin();
  const supabase = createServiceRoleClient();
  await supabase.from("artcards").delete().eq("id", id);
  revalidateArtcards();
  redirect("/admin/artcards");
}
