"use client";

import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import styles from "../admin.module.css";

const EVENT = "admin:image-processing";

/* Disables itself while any ImageField on the page is still compressing a
   photo — without this, a fast click could submit before the resized file
   replaces the original in the input, sending the full-size original straight
   into the same 413 this whole compression step exists to prevent. Tracks a
   counter rather than a boolean since a form (e.g. Site Settings) can have
   multiple ImageFields compressing at once. Also shows a spinner + "Saving…"
   via useFormStatus while the Server Action itself is in flight (photo
   uploads can take a few seconds), so the button never looks unresponsive
   after a click. useFormStatus only works because this renders inside the
   <form> it reports on. */
export default function SubmitButton({ children }: { children: React.ReactNode }) {
  const [pendingCount, setPendingCount] = useState(0);
  const { pending } = useFormStatus();

  useEffect(() => {
    function onProcessing(event: Event) {
      const { processing } = (event as CustomEvent<{ processing: boolean }>).detail;
      setPendingCount((count) => Math.max(0, count + (processing ? 1 : -1)));
    }
    window.addEventListener(EVENT, onProcessing);
    return () => window.removeEventListener(EVENT, onProcessing);
  }, []);

  const label = pendingCount > 0 ? "Compressing photo…" : pending ? "Saving…" : children;

  return (
    <button type="submit" className={styles.button} disabled={pendingCount > 0 || pending}>
      {pending && <span className={styles.spinner} aria-hidden="true" />}
      {label}
    </button>
  );
}

export function dispatchImageProcessing(processing: boolean) {
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { processing } }));
}
