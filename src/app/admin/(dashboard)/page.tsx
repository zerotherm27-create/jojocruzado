import Link from "next/link";
import styles from "../admin.module.css";

export default function AdminDashboardPage() {
  return (
    <>
      <h1 className={styles.title}>Dashboard</h1>
      <div className={styles.list}>
        <Link href="/admin/articles" className={styles.row}>
          <div className={styles.rowBody}>
            <div className={styles.rowTitle}>Insights articles</div>
            <div className={styles.rowMeta}>Add, edit, or remove the articles shown on the homepage and /insights.</div>
          </div>
        </Link>
        <Link href="/admin/settings" className={styles.row}>
          <div className={styles.rowBody}>
            <div className={styles.rowTitle}>Site settings</div>
            <div className={styles.rowMeta}>Hero/story/about photos, booking link, Messenger, Viber, email, socials.</div>
          </div>
        </Link>
        <Link href="/admin/analytics" className={styles.row}>
          <div className={styles.rowBody}>
            <div className={styles.rowTitle}>Analytics</div>
            <div className={styles.rowMeta}>Page views, top pages/referrers, and chat engagement over the last 30 days.</div>
          </div>
        </Link>
      </div>
    </>
  );
}
