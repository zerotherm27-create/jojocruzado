import ImageField from "@/app/admin/_components/ImageField";
import SubmitButton from "@/app/admin/_components/SubmitButton";
import { createServiceRoleClient } from "@/lib/supabase/client";
import { updateSiteSettings } from "./actions";
import styles from "../../admin.module.css";

export const dynamic = "force-dynamic";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const { error, success } = await searchParams;
  const supabase = createServiceRoleClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", true)
    .maybeSingle();

  return (
    <>
      <h1 className={styles.title}>Site settings</h1>
      {success && (
        <div className={styles.bannerSuccess} role="status">
          Changes saved. Your live site now reflects this.
        </div>
      )}
      {error && (
        <div className={styles.bannerError} role="alert">
          {error}
        </div>
      )}
      <form action={updateSiteSettings} className={styles.form}>
        <ImageField
          label="Hero photo (homepage)"
          name="heroImage"
          altName="heroImageAlt"
          currentUrl={settings?.hero_image_url}
          currentAlt={settings?.hero_image_alt}
        />
        <ImageField
          label="Story photo (homepage)"
          name="storyImage"
          altName="storyImageAlt"
          currentUrl={settings?.story_image_url}
          currentAlt={settings?.story_image_alt}
        />
        <ImageField
          label="About photo (/about)"
          name="aboutImage"
          altName="aboutImageAlt"
          currentUrl={settings?.about_image_url}
          currentAlt={settings?.about_image_alt}
        />
        <ImageField
          label="Business card photo (square headshot, /card)"
          name="cardImage"
          altName="cardImageAlt"
          currentUrl={settings?.card_photo_url}
          currentAlt={settings?.card_photo_alt}
        />
        <ImageField
          label="How I Help photo (/how-i-help)"
          name="howIHelpImage"
          altName="howIHelpImageAlt"
          currentUrl={settings?.how_i_help_image_url}
          currentAlt={settings?.how_i_help_image_alt}
        />
        <label className={styles.label}>
          Card title line
          <input
            type="text"
            name="cardTitle"
            defaultValue={settings?.card_title ?? ""}
            placeholder="Sun Life | Licensed Insurance Advisor"
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          Card bio (1-2 sentences)
          <textarea
            name="cardBio"
            rows={3}
            defaultValue={settings?.card_bio ?? ""}
            className={styles.textarea}
          />
        </label>
        <label className={styles.label}>
          Card phone number (for call/text buttons on /card)
          <input
            type="tel"
            name="cardPhone"
            defaultValue={settings?.card_phone ?? ""}
            className={styles.input}
          />
        </label>

        <label className={styles.label}>
          Booking link
          <input
            type="url"
            name="bookingUrl"
            defaultValue={settings?.booking_url ?? ""}
            placeholder="https://calendly.com/..."
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          Messenger link
          <input
            type="url"
            name="messengerUrl"
            defaultValue={settings?.messenger_url ?? ""}
            placeholder="https://m.me/..."
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          Viber number
          <input
            type="text"
            name="viberNumber"
            defaultValue={settings?.viber_number ?? ""}
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          Contact email
          <input
            type="email"
            name="contactEmail"
            defaultValue={settings?.contact_email ?? ""}
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          Facebook URL
          <input
            type="url"
            name="facebookUrl"
            defaultValue={settings?.facebook_url ?? ""}
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          LinkedIn URL
          <input
            type="url"
            name="linkedinUrl"
            defaultValue={settings?.linkedin_url ?? ""}
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          Instagram URL
          <input
            type="url"
            name="instagramUrl"
            defaultValue={settings?.instagram_url ?? ""}
            className={styles.input}
          />
        </label>

        <SubmitButton>Save changes</SubmitButton>
      </form>
    </>
  );
}
