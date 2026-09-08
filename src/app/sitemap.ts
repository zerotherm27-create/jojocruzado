import type { MetadataRoute } from "next";
import { getArticles } from "@/lib/supabase/queries";

const BASE_URL = "https://jojocruzado.safetymargin.app";

const STATIC_ROUTES = [
  "",
  "/about",
  "/how-i-help",
  "/insights",
  "/safety-margin",
  "/contact",
  "/disclaimer",
  "/resources",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getArticles();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
  }));

  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${BASE_URL}/insights/${article.slug}`,
    lastModified: new Date(),
  }));

  return [...staticEntries, ...articleEntries];
}
