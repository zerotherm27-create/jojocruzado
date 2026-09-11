import Link from "next/link";
import { logout } from "../actions";
import styles from "../admin.module.css";

export default function AdminNav() {
  return (
    <nav className={styles.nav}>
      <span className={styles.navBrand}>Jojo Cruzado — Admin</span>
      <Link href="/admin/articles" className={styles.navLink}>
        Articles
      </Link>
      <Link href="/admin/artcards" className={styles.navLink}>
        Sun Life Artcards
      </Link>
      <Link href="/admin/testimonials" className={styles.navLink}>
        Testimonials
      </Link>
      <Link href="/admin/settings" className={styles.navLink}>
        Site Settings
      </Link>
      <form action={logout}>
        <button type="submit" className={styles.navButton}>
          Log out
        </button>
      </form>
    </nav>
  );
}
