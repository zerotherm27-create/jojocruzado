import Link from "next/link";
import { createServiceRoleClient } from "@/lib/supabase/client";
import { TESTIMONIAL_SHARE_SLUG } from "@/config/testimonials";
import { approveTestimonial, rejectTestimonial, deleteTestimonial } from "./_actions";
import styles from "../../admin.module.css";

export const dynamic = "force-dynamic";

type TestimonialRow = {
  id: string;
  client_name: string;
  relationship: string | null;
  review_body: string;
  rating: number;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

function Stars({ rating }: { rating: number }) {
  return <span aria-label={`Rated ${rating} out of 5`}>{"★".repeat(rating)}{"☆".repeat(5 - rating)}</span>;
}

export default async function TestimonialsListPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error: errorMessage } = await searchParams;
  const supabase = createServiceRoleClient();
  const { data } = await supabase
    .from("testimonials")
    .select("id, client_name, relationship, review_body, rating, status, created_at")
    .order("created_at", { ascending: false });

  const all = (data ?? []) as TestimonialRow[];
  const pending = all.filter((t) => t.status === "pending");
  const decided = all.filter((t) => t.status !== "pending");
  const shareHref = `/testimonials/${TESTIMONIAL_SHARE_SLUG}`;

  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Testimonials</h1>
      </div>

      <p className={styles.fileHint} style={{ marginBottom: 24 }}>
        Share this link with clients so they can leave a review:{" "}
        <Link href={shareHref} target="_blank" rel="noopener noreferrer">
          {shareHref}
        </Link>
      </p>

      {errorMessage && <div className={styles.bannerError}>{errorMessage}</div>}

      <div className={styles.pageHeader}>
        <h2 className={styles.title}>
          Needs review{pending.length > 0 ? ` (${pending.length})` : ""}
        </h2>
      </div>

      {pending.length === 0 ? (
        <div className={styles.empty}>No testimonials waiting for review.</div>
      ) : (
        <div className={styles.list}>
          {pending.map((t) => (
            <div key={t.id} className={styles.row}>
              <div className={styles.rowBody}>
                <div className={styles.rowTitle}>
                  {t.client_name} · <Stars rating={t.rating} />
                </div>
                {t.relationship && <div className={styles.rowMeta}>{t.relationship}</div>}
                <div className={styles.rowMeta}>{t.review_body}</div>
              </div>
              <div className={styles.rowActions}>
                <form action={approveTestimonial.bind(null, t.id)}>
                  <button type="submit" className={styles.button}>
                    Approve
                  </button>
                </form>
                <form action={rejectTestimonial.bind(null, t.id)}>
                  <button type="submit" className={styles.buttonSecondary}>
                    Reject
                  </button>
                </form>
                <form action={deleteTestimonial.bind(null, t.id)}>
                  <button type="submit" className={styles.buttonDanger}>
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={styles.pageHeader} style={{ marginTop: 40 }}>
        <h2 className={styles.title}>Approved &amp; rejected</h2>
      </div>

      {decided.length === 0 ? (
        <div className={styles.empty}>Nothing here yet.</div>
      ) : (
        <div className={styles.list}>
          {decided.map((t) => (
            <div key={t.id} className={styles.row}>
              <div className={styles.rowBody}>
                <div className={styles.rowTitle}>
                  {t.client_name} · <Stars rating={t.rating} />{" "}
                  <span className={styles.rowMeta}>({t.status})</span>
                </div>
                {t.relationship && <div className={styles.rowMeta}>{t.relationship}</div>}
                <div className={styles.rowMeta}>{t.review_body}</div>
              </div>
              <div className={styles.rowActions}>
                {t.status === "rejected" && (
                  <form action={approveTestimonial.bind(null, t.id)}>
                    <button type="submit" className={styles.buttonSecondary}>
                      Approve
                    </button>
                  </form>
                )}
                {t.status === "approved" && (
                  <form action={rejectTestimonial.bind(null, t.id)}>
                    <button type="submit" className={styles.buttonSecondary}>
                      Unpublish
                    </button>
                  </form>
                )}
                <form action={deleteTestimonial.bind(null, t.id)}>
                  <button type="submit" className={styles.buttonDanger}>
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
