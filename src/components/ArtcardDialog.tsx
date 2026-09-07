"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import type { Need } from "@/content/needs";
import SlotImage from "./SlotImage";
import styles from "./ArtcardDialog.module.css";

export type Artcard = {
  id: string;
  image: string;
  need: Need;
  /* TODO(compliance): populate once Jojo supplies the real files — see the gate
     comment in src/app/resources/page.tsx. */
  productName?: string;
  issuedOn?: string;
};

/* Client leaf: the grid tiles and the enlarged view need interactivity (open state,
   <dialog> imperative API), so this is isolated here rather than making the whole
   /resources page a Client Component. */
export default function ArtcardGrid({ cards }: { cards: Artcard[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState<Artcard | null>(null);

  function open(card: Artcard) {
    setActive(card);
    dialogRef.current?.showModal();
  }

  function close() {
    dialogRef.current?.close();
  }

  return (
    <>
      <div className={`autogrid ${styles.grid}`}>
        {cards.map((card) => (
          <button
            key={card.id}
            type="button"
            className={styles.tile}
            onClick={() => open(card)}
          >
            <SlotImage
              src={card.image}
              alt={
                card.productName
                  ? `${card.productName} — Sun Life artcard, tap to enlarge`
                  : "Placeholder slot awaiting a Sun Life-approved artcard"
              }
              ratio="1 / 1"
              radius={12}
              sizes="(max-width: 900px) 100vw, 33vw"
            />
            <span className={styles.caption}>
              <span className={styles.captionName}>{card.need.title}</span>
              <span className={styles.captionMeta}>
                {card.productName ?? "Product name — to be supplied"}
              </span>
            </span>
          </button>
        ))}
      </div>

      {/* Native <dialog>: focus trap, Esc-to-dismiss and background inerting come for
          free, no library needed. */}
      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-labelledby="artcard-dialog-title"
        onClose={() => setActive(null)}
        onClick={(event) => {
          if (event.target === dialogRef.current) close();
        }}
      >
        {active && (
          <div className={styles.body}>
            <div className={styles.head}>
              <h2 id="artcard-dialog-title" className={styles.title}>
                {active.need.title}
              </h2>
              <button
                type="button"
                className={styles.closeButton}
                aria-label="Close"
                onClick={close}
              >
                &times;
              </button>
            </div>

            <SlotImage
              src={active.image}
              alt={
                active.productName
                  ? `${active.productName} — Sun Life artcard`
                  : "Placeholder slot awaiting a Sun Life-approved artcard"
              }
              ratio="1 / 1"
              radius={12}
              sizes="600px"
            />

            {/* The need's own description, not a product claim authored here. */}
            <p className={styles.needBody}>{active.need.body}</p>

            <span className={styles.attribution}>
              {active.productName ?? "Product name — to be supplied"}
              {active.issuedOn ? ` · Issued ${active.issuedOn}` : " · Issue date to be supplied"}
              {" · Issued by Sun Life Philippines"}
            </span>

            {/* No quote/proposal CTA — see plan. */}
            <Link href="/contact" className={`btn btn-navy ${styles.dialogCta}`}>
              Talk to Jojo
            </Link>
          </div>
        )}
      </dialog>
    </>
  );
}
