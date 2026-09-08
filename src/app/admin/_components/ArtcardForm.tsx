import { needs } from "@/content/needs";
import ImageField from "./ImageField";
import SubmitButton from "./SubmitButton";
import styles from "../admin.module.css";

export type ArtcardFormInitial = {
  needId: string;
  productName?: string | null;
  issuedOn?: string | null;
  imageUrl?: string | null;
  imageAlt?: string | null;
};

type ArtcardFormProps = {
  action: (formData: FormData) => void;
  submitLabel: string;
  error?: string;
  initial?: ArtcardFormInitial;
};

export default function ArtcardForm({ action, submitLabel, error, initial }: ArtcardFormProps) {
  return (
    <form action={action} className={styles.form}>
      <label className={styles.label}>
        Need category
        <select name="needId" defaultValue={initial?.needId ?? needs[0].id} className={styles.select}>
          {needs.map((need) => (
            <option key={need.id} value={need.id}>
              {need.title}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.label}>
        Product name
        <input
          type="text"
          name="productName"
          defaultValue={initial?.productName ?? ""}
          placeholder="As shown on the artcard"
          className={styles.input}
        />
      </label>

      <label className={styles.label}>
        Issued on
        <input
          type="text"
          name="issuedOn"
          defaultValue={initial?.issuedOn ?? ""}
          placeholder="e.g. January 2026"
          className={styles.input}
        />
      </label>

      <ImageField
        label="Artcard image"
        name="image"
        altName="imageAlt"
        currentUrl={initial?.imageUrl}
        currentAlt={initial?.imageAlt}
      />

      {/* Not a code-level gate (Jojo has confirmed general web-display approval)
         but still worth surfacing at the point where a new card actually gets
         published — a stale rate/payout figure on a website is his exposure,
         not a code bug. */}
      <p className={styles.fileHint}>
        Before publishing: confirm this specific card, and any rate/payout figure it
        shows, is still current and cleared by Sun Life for website display (not only
        social).
      </p>

      {error && (
        <span role="alert" className={styles.error}>
          {error}
        </span>
      )}

      <SubmitButton>{submitLabel}</SubmitButton>
    </form>
  );
}
