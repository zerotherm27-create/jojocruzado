import type { Article } from "@/content/insights";
import { createServiceRoleClient } from "./client";

type ArticleRow = {
  id: string;
  category: string;
  title: string;
  dek: string;
  read_time: string;
  image_url: string | null;
  image_alt: string;
};

type SiteSettingsRow = {
  hero_image_url: string | null;
  hero_image_alt: string | null;
  story_image_url: string | null;
  story_image_alt: string | null;
  about_image_url: string | null;
  about_image_alt: string | null;
  booking_url: string | null;
  messenger_url: string | null;
  viber_number: string | null;
  contact_email: string | null;
  facebook_url: string | null;
  linkedin_url: string | null;
  instagram_url: string | null;
};

export type SiteSettings = {
  heroImage: string | null;
  heroImageAlt: string | null;
  storyImage: string | null;
  storyImageAlt: string | null;
  aboutImage: string | null;
  aboutImageAlt: string | null;
  bookingUrl: string | null;
  messengerUrl: string | null;
  viberNumber: string | null;
  contactEmail: string | null;
  facebookUrl: string | null;
  linkedinUrl: string | null;
  instagramUrl: string | null;
} | null;

function toArticle(row: ArticleRow): Article {
  return {
    id: row.id,
    category: row.category,
    title: row.title,
    dek: row.dek,
    readTime: row.read_time,
    image: row.image_url ?? "",
    imageAlt: row.image_alt,
  };
}

function toSiteSettings(row: SiteSettingsRow): SiteSettings {
  return {
    heroImage: row.hero_image_url,
    heroImageAlt: row.hero_image_alt,
    storyImage: row.story_image_url,
    storyImageAlt: row.story_image_alt,
    aboutImage: row.about_image_url,
    aboutImageAlt: row.about_image_alt,
    bookingUrl: row.booking_url,
    messengerUrl: row.messenger_url,
    viberNumber: row.viber_number,
    contactEmail: row.contact_email,
    facebookUrl: row.facebook_url,
    linkedinUrl: row.linkedin_url,
    instagramUrl: row.instagram_url,
  };
}

/* Both fetches fail soft (empty array / null) rather than throwing — a Supabase
   outage or an empty, freshly-created table shouldn't take the whole site down.
   Callers fall back to the placeholder content that shipped before the dashboard
   existed. Returns the site's existing `Article` shape directly, so page code and
   ArticleCard need no changes regardless of where the data came from. */
export async function getArticles(): Promise<Article[]> {
  try {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("articles")
      .select("id, category, title, dek, read_time, image_url, image_alt")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data as ArticleRow[]).map(toArticle);
  } catch (error) {
    console.error("getArticles failed", error);
    return [];
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select(
        "hero_image_url, hero_image_alt, story_image_url, story_image_alt, about_image_url, about_image_alt, booking_url, messenger_url, viber_number, contact_email, facebook_url, linkedin_url, instagram_url",
      )
      .eq("id", true)
      .maybeSingle();

    if (error) throw error;
    return data ? toSiteSettings(data as SiteSettingsRow) : null;
  } catch (error) {
    console.error("getSiteSettings failed", error);
    return null;
  }
}

/* Resolves a stored image URL to itself, or the given local placeholder path if
   empty — covers both "Supabase is down" and "Jojo hasn't uploaded a photo yet", so
   pages never render a broken image. width/height are vestigial (kept only so the
   five existing call sites — resolveImage(x, fallback, 1000, 1250) etc. — need no
   edits); Supabase Storage image transforms are a paid add-on and out of scope. */
export function resolveImage(
  image: string | null | undefined,
  fallbackPath: string,
  _width?: number,
  _height?: number,
): string {
  return image || fallbackPath;
}
