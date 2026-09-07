"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_ITEMS } from "@/config/site";
import styles from "./SiteHeader.module.css";

export default function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.row}`}>
        <Link href="/" className={styles.identity}>
          <span className={styles.identityName}>JOJO CRUZADO</span>
          <span className={styles.identityRole}>Sun Life Financial Advisor</span>
        </Link>

        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`${styles.navLink} ${active ? styles.navLinkActive : ""}`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/contact"
            aria-current={pathname === "/contact" ? "page" : undefined}
            className="btn btn-navy btn-compact"
          >
            Talk to Jojo
          </Link>
        </nav>

        <button
          type="button"
          className={styles.burger}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className={styles.burgerBar} />
          <span className={styles.burgerBar} />
          <span className={styles.burgerBar} />
        </button>
      </div>

      {menuOpen && (
        <nav className={styles.panel}>
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`${styles.panelLink} ${active ? styles.panelLinkActive : ""}`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/contact"
            aria-current={pathname === "/contact" ? "page" : undefined}
            className={styles.panelCta}
          >
            Talk to Jojo
          </Link>
        </nav>
      )}
    </header>
  );
}
