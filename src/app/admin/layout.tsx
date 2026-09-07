import type { ReactNode } from "react";

export const metadata = {
  // `absolute` bypasses the root layout's "%s — Jojo Cruzado" title template —
  // without it, this became the doubled-up "Admin — Jojo Cruzado — Jojo Cruzado".
  title: { absolute: "Admin — Jojo Cruzado" },
  robots: { index: false, follow: false },
};

/* Just a metadata/robots wrapper — the nav chrome lives in (dashboard)/layout.tsx
   so /admin/login (outside that route group) renders without it. Route groups
   don't affect the URL, so /admin, /admin/articles, /admin/settings are unchanged. */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
