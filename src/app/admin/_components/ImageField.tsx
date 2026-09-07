"use client";

import { useRef, useState } from "react";
import { resizeImageFile } from "@/lib/image/resizeImageFile";
import { dispatchImageProcessing } from "./SubmitButton";
import styles from "../admin.module.css";

type ImageFieldProps = {
  label: string;
  name: string;
  altName: string;
  currentUrl?: string | null;
  currentAlt?: string | null;
};

/* Plain <input type="file"> posted as part of the surrounding form's FormData.
   Before that happens, the selected file is downscaled/re-encoded in the
   browser (resizeImageFile) and swapped back into the input via DataTransfer —
   real phone photos are routinely 5-15MB+, which was crashing the Server
   Action with a 413 even after raising Next's body-size limit. Shrinking here
   fixes it at the source instead of chasing ever-larger limits, and also means
   the Server Action still receives a real file it can validate (magic-byte
   sniffing in src/lib/supabase/storage.ts), just a much smaller one. */
export default function ImageField({ label, name, altName, currentUrl, currentAlt }: ImageFieldProps) {
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const [processing, setProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setProcessing(true);
    dispatchImageProcessing(true);
    try {
      const resized = await resizeImageFile(file);
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(resized);
      if (inputRef.current) inputRef.current.files = dataTransfer.files;
      setPreview(URL.createObjectURL(resized));
    } catch {
      // Resize failed for some reason (e.g. an unsupported format) — fall back
      // to the original file as-is rather than blocking the upload entirely;
      // the Server Action's own validation still has the final say.
      setPreview(URL.createObjectURL(file));
    } finally {
      setProcessing(false);
      dispatchImageProcessing(false);
    }
  }

  return (
    <div className={styles.label}>
      <span>{label}</span>
      {preview && <img src={preview} alt="" className={styles.imagePreview} />}
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept="image/*"
        className={styles.input}
        onChange={handleChange}
      />
      <span className={styles.fileHint}>
        {processing ? "Compressing photo…" : "Leave empty to keep the current photo."}
      </span>
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
