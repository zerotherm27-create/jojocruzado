import { notFound } from "next/navigation";
import ArtcardForm from "@/app/admin/_components/ArtcardForm";
import { createServiceRoleClient } from "@/lib/supabase/client";
import { updateArtcard } from "../../_actions";
import styles from "../../../../admin.module.css";

export default async function EditArtcardPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;

  const supabase = createServiceRoleClient();
  const { data: artcard } = await supabase
    .from("artcards")
    .select("need_id, product_name, issued_on, image_url, image_alt")
    .eq("id", id)
    .maybeSingle();

  if (!artcard) notFound();

  return (
    <>
      <h1 className={styles.title}>Edit artcard</h1>
      <ArtcardForm
        action={updateArtcard.bind(null, id)}
        submitLabel="Save changes"
        error={error}
        initial={{
          needId: artcard.need_id,
          productName: artcard.product_name,
          issuedOn: artcard.issued_on,
          imageUrl: artcard.image_url,
          imageAlt: artcard.image_alt,
        }}
      />
    </>
  );
}
