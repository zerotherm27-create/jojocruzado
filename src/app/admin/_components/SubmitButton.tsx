"use client";

import { useEffect, useState } from "react";
import styles from "../admin.module.css";

const EVENT = "admin:image-processing";

/* Disables itself while any ImageField on the page is still compressing a
   photo — without this, a fast click could submit before the resized file
   replaces the original in the input, sending the full-size original straight
   into the same 413 this whole compression step exists to prevent. Tracks a
   counter rather than a boolean since a form (e.g. Site Settings) can have
   multiple ImageFields compressing at once. */
export default function SubmitButton({ children }: { children: React.ReactNode }) {
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    function onProcessing(event: Event) {
      const { processing } = (event as CustomEvent<{ processing: boolean }>).detail;
      setPendingCount((count) => Math.max(0, count + (processing ? 1 : -1)));
    }
    window.addEventListener(EVENT, onProcessing);
    return () => window.removeEventListener(EVENT, onProcessing);
  }, []);

  return (
    <button type="submit" className={styles.button} disabled={pendingCount > 0}>
      {pendingCount > 0 ? "Compressing photo…" : children}
    </button>
  );
}

export function dispatchImageProcessing(processing: boolean) {
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { processing } }));
}
