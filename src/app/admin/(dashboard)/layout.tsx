import type { ReactNode } from "react";
import AdminNav from "../_components/AdminNav";
import styles from "../admin.module.css";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.shell}>
      <AdminNav />
      <main className={styles.main}>{children}</main>
    </div>
  );
}
