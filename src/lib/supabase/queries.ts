import type { Article } from "@/content/insights";
import { articles as fallbackArticles } from "@/content/insights";
import type { Artcard } from "@/components/ArtcardDialog";
import { needs } from "@/content/needs";
import { createServiceRoleClient } from "./client";

type ArtcardRow = {
  id: string;
  need_id: string;
  image_url: string;
  image_alt: string;
  product_name: string | null;
  issued_on: string | null;
};

type ArticleRow = {
  id: string;
  category: string;
  title: string;
  dek: string;
  body: string | null;
  read_time: string;
  image_url: string | null;
  image_alt: string;
  slug: string;
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
  card_photo_url: string | null;
  card_photo_alt: string | null;
  card_title: string | null;
  card_bio: string | null;
  card_phone: string | null;
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
  cardPhoto: string | null;
  cardPhotoAlt: string | null;
  cardTitle: string | null;
  cardBio: string | null;
  cardPhone: string | null;
} | null;

// Rows whose need_id no longer matches an id in content/needs.ts (a need was
// renamed/removed after the card was uploaded) are dropped rather than shown
// with a broken/blank category.
function toArtcard(row: ArtcardRow): Artcard | null {
  const need = needs.find((candidate) => candidate.id === row.need_id);
  if (!need) return null;
  return {
    id: row.id,
    image: row.image_url,
    imageAlt: row.image_alt,
    need,
    productName: row.product_name ?? undefined,
    issuedOn: row.issued_on ?? undefined,
  };
}

function toArticle(row: ArticleRow): Article {
  return {
    id: row.id,
    slug: row.slug,
    category: row.category,
    title: row.title,
    dek: row.dek,
    body: row.body ?? undefined,
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
    cardPhoto: row.card_photo_url,
    cardPhotoAlt: row.card_photo_alt,
    cardTitle: row.card_title,
    cardBio: row.card_bio,
    cardPhone: row.card_phone,
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
      .select("id, category, title, dek, body, read_time, image_url, image_alt, slug")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data as ArticleRow[]).map(toArticle);
  } catch (error) {
    console.error("getArticles failed", error);
    return [];
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("articles")
      .select("id, category, title, dek, body, read_time, image_url, image_alt, slug")
      .eq("slug", slug)
      .maybeSingle();

    if (error) throw error;
    if (data) return toArticle(data as ArticleRow);
    return fallbackArticles.find((article) => article.slug === slug) ?? null;
  } catch (error) {
    console.error("getArticleBySlug failed", error);
    return fallbackArticles.find((article) => article.slug === slug) ?? null;
  }
}

export async function getArtcards(): Promise<Artcard[]> {
  try {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("artcards")
      .select("id, need_id, image_url, image_alt, product_name, issued_on")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data as ArtcardRow[]).map(toArtcard).filter((card): card is Artcard => card !== null);
  } catch (error) {
    console.error("getArtcards failed", error);
    return [];
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select(
        "hero_image_url, hero_image_alt, story_image_url, story_image_alt, about_image_url, about_image_alt, booking_url, messenger_url, viber_number, contact_email, facebook_url, linkedin_url, instagram_url, card_photo_url, card_photo_alt, card_title, card_bio, card_phone",
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
