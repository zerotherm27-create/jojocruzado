import type { MetadataRoute } from "next";

const BASE_URL = "https://jojocruzado.safetymargin.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /card and /admin already set their own noindex via layout metadata;
        // disallowing the crawl path here too keeps crawlers from wasting
        // budget on the gated admin dashboard specifically.
        disallow: ["/admin"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
