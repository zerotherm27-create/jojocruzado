import type { Metadata } from "next";

const SITE_NAME = "Jojo Cruzado";

// Builds a page's full Metadata object (plain title/description plus matching
// Open Graph and Twitter Card fields, and a canonical URL) from just the
// three things every page already had to decide anyway. Next.js's root
// title template ("%s: Jojo Cruzado") only applies to the plain <title> tag,
// not to openGraph.title/twitter.title, so those need the full brand suffix
// spelled out here to stay self-explanatory when a link is shared out of
// context. Colon, not em dash, per this site's standing style rule.
export function pageMetadata({
  title,
  description,
  path,
  images,
}: {
  title: string;
  description: string;
  path: string;
  images?: string[];
}): Metadata {
  const fullTitle = `${title}: ${SITE_NAME}`;
  // Next.js only auto-attaches the file-convention opengraph-image.tsx to a
  // route that has NO page-level `openGraph` object of its own -- since every
  // page using this helper declares one (for title/description/url), that
  // inheritance never kicks in and the image silently disappears unless
  // referenced explicitly here.
  const resolvedImages = images ?? ["/opengraph-image"];

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      siteName: SITE_NAME,
      type: "website",
      images: resolvedImages,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: resolvedImages,
    },
  };
}
