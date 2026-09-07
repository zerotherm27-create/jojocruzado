"use client";

import { useState } from "react";
import styles from "../admin.module.css";

type ImageFieldProps = {
  label: string;
  name: string;
  altName: string;
  currentUrl?: string | null;
  currentAlt?: string | null;
};

/* Plain <input type="file"> posted as part of the surrounding form's FormData —
   the preview here is a client-only convenience, not required for submission to
   work (the Server Action reads the file straight off formData regardless). */
export default function ImageField({ label, name, altName, currentUrl, currentAlt }: ImageFieldProps) {
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);

  return (
    <div className={styles.label}>
      <span>{label}</span>
      {preview && <img src={preview} alt="" className={styles.imagePreview} />}
      <input
        type="file"
        name={name}
        accept="image/*"
        className={styles.input}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) setPreview(URL.createObjectURL(file));
        }}
      />
      <span className={styles.fileHint}>Leave empty to keep the current photo.</span>
      <label className={styles.label}>
        Alt text
        <input
          type="text"
          name={altName}
          defaultValue={currentAlt ?? ""}
          className={styles.input}
        />
      </label>
    </div>
  );
}
