import ArtcardForm from "@/app/admin/_components/ArtcardForm";
import { createArtcard } from "../_actions";
import styles from "../../../admin.module.css";

export default async function NewArtcardPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <>
      <h1 className={styles.title}>New artcard</h1>
      <ArtcardForm action={createArtcard} submitLabel="Create artcard" error={error} />
    </>
  );
}
