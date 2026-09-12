import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { TESTIMONIAL_SHARE_SLUG } from "@/config/testimonials";
import { CARD_FULL_NAME } from "@/config/site";
import { getSiteSettings, resolveImage } from "@/lib/supabase/queries";
import { pageMetadata } from "@/lib/seo";
import TestimonialForm from "@/components/TestimonialForm";
import styles from "./page.module.css";

// Revalidate so a photo updated in /admin -> Site Settings shows up here
// within a minute instead of needing a redeploy.
export const revalidate = 60;

// The testimonials/layout.tsx metadata had no page-specific openGraph/twitter
// object, so every share of this link inherited the ROOT layout's generic
// homepage title/description/url/image wholesale (Next.js metadata merging
// takes the whole parent openGraph object when a child declares none of its
// own) -- confirmed live via curl. Declaring it here, with the actual dynamic
// path, fixes the wrong og:url and gives the share card its own description
// and photo-based image (opengraph-image.tsx / twitter-image.tsx in this
// same route folder) instead of reusing the homepage's.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ shareSlug: string }>;
}): Promise<Metadata> {
  const { shareSlug } = await params;
  const path = `/testimonials/${shareSlug}`;
  return pageMetadata({
    title: "Share a Review",
    description:
      "Share a short review of your experience working with Jojo Cruzado, Sun Life Financial Advisor.",
    path,
    images: [`${path}/opengraph-image`],
  });
}

export default async function TestimonialSubmitPage({
  params,
}: {
  params: Promise<{ shareSlug: string }>;
}) {
  const { shareSlug } = await params;
  if (shareSlug !== TESTIMONIAL_SHARE_SLUG) notFound();

  const settings = await getSiteSettings();
  // Same photo + crop already established on the About page hero -- reusing
  // it here keeps this page visually consistent with the rest of the site's
  // full-bleed hero treatment instead of introducing a new photo/crop.
  const photo = resolveImage(settings?.aboutImage, "/images/jojo-about.png");

  return (
    <main className={styles.page}>
      {/* Fixed so it covers the viewport as one continuous backdrop behind
          the whole page, not just a band at the top -- content below
          scrolls over it instead of the photo stretching/cropping to
          match the page's (variable, form-dependent) content height. */}
      <div className={styles.backdrop}>
        <Image
          src={photo}
          alt={settings?.aboutImageAlt || CARD_FULL_NAME}
          fill
          sizes="100vw"
          priority
          style={{ objectFit: "cover", objectPosition: "78% 30%" }}
        />
        <div className={styles.scrim} />
      </div>

      <div className={styles.content}>
        <div className={styles.intro}>
          <span className="rule-gold" />
          <h1 className={`h1-sub ${styles.title}`}>Share your experience</h1>
          <p className={`lead ${styles.body}`}>
            Thank you for taking a moment to leave a review. It helps other people understand
            what it&apos;s like to work with Jojo.
          </p>
        </div>
        <TestimonialForm />
      </div>
    </main>
  );
}
