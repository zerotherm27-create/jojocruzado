import Link from "next/link";
import { needs } from "@/content/needs";
import { createServiceRoleClient } from "@/lib/supabase/client";
import { deleteArtcard } from "./_actions";
import styles from "../../admin.module.css";

export const dynamic = "force-dynamic";

type ArtcardRow = {
  id: string;
  need_id: string;
  image_url: string;
  product_name: string | null;
  issued_on: string | null;
};

export default async function ArtcardsListPage() {
  const supabase = createServiceRoleClient();
  const { data } = await supabase
    .from("artcards")
    .select("id, need_id, image_url, product_name, issued_on")
    .order("created_at", { ascending: false });

  const artcards = (data ?? []) as ArtcardRow[];

  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Sun Life artcards</h1>
        <Link href="/admin/artcards/new" className={styles.button}>
          New artcard
        </Link>
      </div>

      {artcards.length === 0 ? (
        <div className={styles.empty}>
          No artcards yet — /resources shows nothing until you add one here.
        </div>
      ) : (
        <div className={styles.list}>
          {artcards.map((card) => {
            const need = needs.find((candidate) => candidate.id === card.need_id);
            return (
              <div key={card.id} className={styles.row}>
                <img src={card.image_url} alt="" className={styles.rowThumb} />
                <div className={styles.rowBody}>
                  <div className={styles.rowTitle}>{card.product_name || "Untitled product"}</div>
                  <div className={styles.rowMeta}>
                    {need?.title ?? "Unknown need"}
                    {card.issued_on ? ` · Issued ${card.issued_on}` : " · Issue date not set"}
                  </div>
                </div>
                <div className={styles.rowActions}>
                  <Link href={`/admin/artcards/${card.id}/edit`} className={styles.buttonSecondary}>
                    Edit
                  </Link>
                  <form action={deleteArtcard.bind(null, card.id)}>
                    <button type="submit" className={styles.buttonDanger}>
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
