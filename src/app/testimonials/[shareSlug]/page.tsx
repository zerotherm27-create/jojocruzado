import { notFound } from "next/navigation";
import { TESTIMONIAL_SHARE_SLUG } from "@/config/testimonials";
import TestimonialForm from "@/components/TestimonialForm";
import styles from "./page.module.css";

export default async function TestimonialSubmitPage({
  params,
}: {
  params: Promise<{ shareSlug: string }>;
}) {
  const { shareSlug } = await params;
  if (shareSlug !== TESTIMONIAL_SHARE_SLUG) notFound();

  return (
    <main className={styles.wrap}>
      <div className={styles.intro}>
        <span className="rule-gold" />
        <h1 className={`h2-section ${styles.title}`}>Share your experience</h1>
        <p className="body">
          Thank you for taking a moment to leave a review — it helps other people understand what
          it&apos;s like to work with Jojo.
        </p>
      </div>
      <TestimonialForm />
    </main>
  );
}
