// One-time seed: pushes the site's existing placeholder content into the new
// Supabase tables so the admin dashboard starts with real, editable rows matching
// what's live today. Run once with:
//   node --env-file=.env.local scripts/seed-supabase.mjs
// Safe to re-run — it upserts site_settings and skips article inserts if the
// table is already non-empty (article ids are fresh uuids each run, so a blind
// re-insert would duplicate rows).
import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";
import path from "node:path";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

const IMAGES_DIR = path.join(process.cwd(), "public", "images");
const BUCKET = "site-media";

async function uploadImage(filename, destPath) {
  const buffer = await readFile(path.join(IMAGES_DIR, filename));
  const contentType = filename.endsWith(".png") ? "image/png" : "image/jpeg";

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(destPath, buffer, { contentType, upsert: true });

  if (error) throw new Error(`upload ${filename} failed: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(destPath);
  console.log(`  uploaded ${filename} -> ${data.publicUrl}`);
  return data.publicUrl;
}

async function main() {
  console.log("Uploading images...");
  const heroImageUrl = await uploadImage("jojo-hero.png", "site-settings/hero.png");
  const storyImageUrl = await uploadImage("jojo-story.png", "site-settings/story.png");
  const aboutImageUrl = await uploadImage("jojo-about.png", "site-settings/about.png");
  const insight1Url = await uploadImage("insight-1.png", "articles/seed-insight-1.png");
  const insight2Url = await uploadImage("insight-2.png", "articles/seed-insight-2.png");
  const insight3Url = await uploadImage("insight-3.png", "articles/seed-insight-3.png");

  console.log("Writing site_settings...");
  const { error: settingsError } = await supabase.from("site_settings").upsert(
    {
      id: true,
      hero_image_url: heroImageUrl,
      hero_image_alt: "Placeholder for a portrait of Jojo Cruzado",
      story_image_url: storyImageUrl,
      story_image_alt: "Placeholder for a photo of Jojo Cruzado at his desk",
      about_image_url: aboutImageUrl,
      about_image_alt: "Placeholder for a portrait of Jojo Cruzado",
      // booking_url / messenger_url left null on purpose — the site already falls
      // back to the real CALENDLY_URL / MESSENGER_URL constants when these are
      // empty, so leaving them blank here avoids two sources of truth.
    },
    { onConflict: "id" },
  );
  if (settingsError) throw new Error(`site_settings upsert failed: ${settingsError.message}`);

  console.log("Writing articles...");
  const { count } = await supabase.from("articles").select("*", { count: "exact", head: true });

  if (count && count > 0) {
    console.log(`  articles table already has ${count} row(s), skipping insert.`);
  } else {
    const articles = [
      {
        category: "Protection",
        title: '"May insurance na ako sa company. Enough na ba?"',
        dek: "What company coverage usually includes, and where the gaps tend to sit.",
        read_time: "5 min read",
        image_url: insight1Url,
        image_alt: "Article image placeholder",
      },
      {
        category: "Business",
        title: "Your business is an asset. So are you.",
        dek: "Why owner dependency is worth planning around while things are going well.",
        read_time: "6 min read",
        image_url: insight2Url,
        image_alt: "Article image placeholder",
      },
      {
        category: "Professionals",
        title: "Strong income doesn't always mean strong financial protection.",
        dek: "A simple way to check whether your structure has kept up with your earnings.",
        read_time: "4 min read",
        image_url: insight3Url,
        image_alt: "Article image placeholder",
      },
    ];

    const { error: articlesError } = await supabase.from("articles").insert(articles);
    if (articlesError) throw new Error(`articles insert failed: ${articlesError.message}`);
    console.log(`  inserted ${articles.length} articles`);
  }

  console.log("Done.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
