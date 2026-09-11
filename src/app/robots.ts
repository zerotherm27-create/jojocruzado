import type { MetadataRoute } from "next";

const BASE_URL = "https://jojocruzado.safetymargin.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /card, /admin, and /testimonials already set their own noindex via
        // layout metadata; disallowing the crawl path here too keeps
        // crawlers from wasting budget on the gated admin dashboard and the
        // unlisted client review-submission link specifically.
        disallow: ["/admin", "/testimonials"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
