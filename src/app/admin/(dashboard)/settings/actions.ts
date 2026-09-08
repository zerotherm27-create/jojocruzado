"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/admin";
import { createServiceRoleClient } from "@/lib/supabase/client";
import { uploadImage } from "@/lib/supabase/storage";
import type { SupabaseClient } from "@supabase/supabase-js";

/* Fixed filenames (hero/story/about) + upsert:true in uploadImage keep the stored
   URL stable across re-uploads, so replacing a photo never leaves an orphaned old
   file in the bucket and never requires updating the URL anywhere else. Throws
   (caught by the caller) if the uploaded file isn't a real image. */
async function resolveImage(
  supabase: SupabaseClient,
  formData: FormData,
  fileField: string,
  currentUrl: string | null | undefined,
  fixedName: string,
): Promise<string | null> {
  const file = formData.get(fileField);
  if (file instanceof File && file.size > 0) {
    return uploadImage(supabase, "site-settings", fixedName, file);
  }
  return currentUrl ?? null;
}

export async function updateSiteSettings(formData: FormData) {
  await requireAdmin();
  const supabase = createServiceRoleClient();

  const { data: current } = await supabase
    .from("site_settings")
    .select("hero_image_url, story_image_url, about_image_url, card_photo_url, how_i_help_image_url")
    .eq("id", true)
    .maybeSingle();

  let heroImageUrl: string | null;
  let storyImageUrl: string | null;
  let aboutImageUrl: string | null;
  let cardImageUrl: string | null;
  let howIHelpImageUrl: string | null;

  try {
    heroImageUrl = await resolveImage(supabase, formData, "heroImage", current?.hero_image_url, "hero");
    storyImageUrl = await resolveImage(supabase, formData, "storyImage", current?.story_image_url, "story");
    aboutImageUrl = await resolveImage(supabase, formData, "aboutImage", current?.about_image_url, "about");
    cardImageUrl = await resolveImage(supabase, formData, "cardImage", current?.card_photo_url, "card");
    howIHelpImageUrl = await resolveImage(
      supabase,
      formData,
      "howIHelpImage",
      current?.how_i_help_image_url,
      "how-i-help",
    );
  } catch (uploadError) {
    const message = uploadError instanceof Error ? uploadError.message : "Image upload failed.";
    redirect(`/admin/settings?error=${encodeURIComponent(message)}`);
  }

  const orNull = (name: string) => String(formData.get(name) || "").trim() || null;

  const { error } = await supabase.from("site_settings").upsert(
    {
      id: true,
      hero_image_url: heroImageUrl,
      hero_image_alt: String(formData.get("heroImageAlt") || ""),
      story_image_url: storyImageUrl,
      story_image_alt: String(formData.get("storyImageAlt") || ""),
      about_image_url: aboutImageUrl,
      about_image_alt: String(formData.get("aboutImageAlt") || ""),
      card_photo_url: cardImageUrl,
      card_photo_alt: String(formData.get("cardImageAlt") || ""),
      how_i_help_image_url: howIHelpImageUrl,
      how_i_help_image_alt: String(formData.get("howIHelpImageAlt") || ""),
      card_title: orNull("cardTitle"),
      card_bio: orNull("cardBio"),
      card_phone: orNull("cardPhone"),
      booking_url: orNull("bookingUrl"),
      messenger_url: orNull("messengerUrl"),
      viber_number: orNull("viberNumber"),
      contact_email: orNull("contactEmail"),
      facebook_url: orNull("facebookUrl"),
      linkedin_url: orNull("linkedinUrl"),
      instagram_url: orNull("instagramUrl"),
    },
    { onConflict: "id" },
  );

  if (error) {
    redirect(`/admin/settings?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  revalidatePath("/card");
  revalidatePath("/how-i-help");
  redirect("/admin/settings?success=1");
}
