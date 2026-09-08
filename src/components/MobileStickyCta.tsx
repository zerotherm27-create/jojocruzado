"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig, SAFETY_MARGIN_URL } from "@/config/site";
import styles from "./MobileStickyCta.module.css";

export default function MobileStickyCta() {
  const pathname = usePathname();

  if (!siteConfig.stickyMobileCta || pathname === "/contact") return null;

  return (
    <>
      <div className={styles.spacer} />
      <div className={styles.bar}>
        <Link href={SAFETY_MARGIN_URL} target="_blank" rel="noopener noreferrer" className={styles.cta}>
          Check My Safety Margin
        </Link>
      </div>
    </>
  );
}
