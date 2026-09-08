import type { Article } from "@/content/insights";
import { client } from "./client";
import { urlFor } from "./image";

type SanityArticle = {
  _id: string;
  title: string;
  category: string;
  dek: string;
  readTime: string;
  image: { asset?: { _ref: string } } | null;
  imageAlt: string;
};

export type SiteSettings = {
  heroImage: { asset?: { _ref: string } } | null;
  heroImageAlt: string | null;
  storyImage: { asset?: { _ref: string } } | null;
  storyImageAlt: string | null;
  aboutImage: { asset?: { _ref: string } } | null;
  aboutImageAlt: string | null;
  bookingUrl: string | null;
  messengerUrl: string | null;
  viberNumber: string | null;
  contactEmail: string | null;
  facebookUrl: string | null;
  linkedinUrl: string | null;
  instagramUrl: string | null;
} | null;

const ARTICLES_QUERY = `*[_type == "article"] | order(_createdAt desc){
  _id, title, category, dek, readTime, image, imageAlt
}`;

const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0]{
  heroImage, heroImageAlt, storyImage, storyImageAlt, aboutImage, aboutImageAlt,
  bookingUrl, messengerUrl, viberNumber, contactEmail,
  facebookUrl, linkedinUrl, instagramUrl
}`;

function toArticle(a: SanityArticle): Article {
  return {
    id: a._id,
    slug: a._id,
    category: a.category,
    title: a.title,
    dek: a.dek,
    readTime: a.readTime,
    image: a.image ? urlFor(a.image).width(800).height(500).url() : "",
    imageAlt: a.imageAlt,
  };
}

/* Both fetches fail soft (empty array / null) rather than throwing — a Sanity
   outage or an empty, freshly-created dataset shouldn't take the whole site down.
   Callers fall back to the placeholder content that shipped before the CMS existed.
   Returns the site's existing `Article` shape directly, so page code and
   ArticleCard need no changes regardless of where the data came from. */
export async function getArticles(): Promise<Article[]> {
  try {
    const results: SanityArticle[] = await client.fetch(ARTICLES_QUERY);
    return results.map(toArticle);
  } catch (error) {
    console.error("getArticles failed", error);
    return [];
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    return await client.fetch(SITE_SETTINGS_QUERY);
  } catch (error) {
    console.error("getSiteSettings failed", error);
    return null;
  }
}

/* Resolves a Sanity image field to a URL, or the given local placeholder path if
   the field is empty — covers both "Sanity is down" and "Jojo hasn't uploaded a
   photo yet", so pages never render a broken image. */
export function resolveImage(
  image: { asset?: { _ref: string } } | null | undefined,
  fallbackPath: string,
  width: number,
  height: number,
): string {
  return image ? urlFor(image).width(width).height(height).url() : fallbackPath;
}
