import ImageField from "./ImageField";
import SubmitButton from "./SubmitButton";
import styles from "../admin.module.css";

const CATEGORIES = ["Financial Foundation", "Protection", "Business", "Professionals", "Family", "Retirement"];

export type ArticleFormInitial = {
  category: string;
  title: string;
  dek: string;
  readTime: string;
  imageUrl?: string | null;
  imageAlt?: string | null;
};

type ArticleFormProps = {
  action: (formData: FormData) => void;
  submitLabel: string;
  error?: string;
  initial?: ArticleFormInitial;
};

export default function ArticleForm({ action, submitLabel, error, initial }: ArticleFormProps) {
  return (
    <form action={action} className={styles.form}>
      <label className={styles.label}>
        Category
        <select name="category" defaultValue={initial?.category ?? CATEGORIES[0]} className={styles.select}>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.label}>
        Title
        <input type="text" name="title" defaultValue={initial?.title} required className={styles.input} />
      </label>

      <label className={styles.label}>
        Dek (short summary)
        <textarea name="dek" rows={3} defaultValue={initial?.dek} required className={styles.textarea} />
      </label>

      <label className={styles.label}>
        Read time
        <input
          type="text"
          name="readTime"
          defaultValue={initial?.readTime ?? "5 min read"}
          placeholder="5 min read"
          required
          className={styles.input}
        />
      </label>

      <ImageField
        label="Article image"
        name="image"
        altName="imageAlt"
        currentUrl={initial?.imageUrl}
        currentAlt={initial?.imageAlt}
      />

      {error && (
        <span role="alert" className={styles.error}>
          {error}
        </span>
      )}

      <SubmitButton>{submitLabel}</SubmitButton>
    </form>
  );
}
