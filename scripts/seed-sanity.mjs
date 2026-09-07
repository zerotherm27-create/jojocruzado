// One-time seed: pushes the site's existing placeholder content into Sanity so
// the site doesn't go blank the moment it starts reading from the CMS instead of
// the hardcoded files. Run once with:
//   node --env-file=.env.local scripts/seed-sanity.mjs
// Safe to re-run — it replaces (createOrReplace) rather than duplicating.
import { createClient } from "@sanity/client";
import { readFile } from "node:fs/promises";
import path from "node:path";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  console.error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET / SANITY_API_WRITE_TOKEN.",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-01-01",
  useCdn: false,
});

const IMAGES_DIR = path.join(process.cwd(), "public", "images");

async function uploadImage(filename) {
  const buffer = await readFile(path.join(IMAGES_DIR, filename));
  const asset = await client.assets.upload("image", buffer, { filename });
  console.log(`  uploaded ${filename} -> ${asset._id}`);
  return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
}

async function main() {
  console.log("Uploading images...");
  const heroImage = await uploadImage("jojo-hero.png");
  const storyImage = await uploadImage("jojo-story.png");
  const aboutImage = await uploadImage("jojo-about.png");
  const insight1 = await uploadImage("insight-1.png");
  const insight2 = await uploadImage("insight-2.png");
  const insight3 = await uploadImage("insight-3.png");

  console.log("Writing Site Settings...");
  await client.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    heroImage,
    heroImageAlt: "Placeholder for a portrait of Jojo Cruzado",
    storyImage,
    storyImageAlt: "Placeholder for a photo of Jojo Cruzado at his desk",
    aboutImage,
    aboutImageAlt: "Placeholder for a portrait of Jojo Cruzado",
    // bookingUrl / messengerUrl left unset on purpose — the site already falls
    // back to the real CALENDLY_URL / MESSENGER_URL constants when these are
    // empty, so leaving them blank here avoids two sources of truth for the
    // same real values.
  });

  console.log("Writing Insights articles...");
  const articles = [
    {
      _id: "article-company-insurance",
      title: '"May insurance na ako sa company. Enough na ba?"',
      category: "Protection",
      dek: "What company coverage usually includes, and where the gaps tend to sit.",
      readTime: "5 min read",
      image: insight1,
      imageAlt: "Article image placeholder",
    },
    {
      _id: "article-business-is-an-asset",
      title: "Your business is an asset. So are you.",
      category: "Business",
      dek: "Why owner dependency is worth planning around while things are going well.",
      readTime: "6 min read",
      image: insight2,
      imageAlt: "Article image placeholder",
    },
    {
      _id: "article-strong-income",
      title: "Strong income doesn't always mean strong financial protection.",
      category: "Professionals",
      dek: "A simple way to check whether your structure has kept up with your earnings.",
      readTime: "4 min read",
      image: insight3,
      imageAlt: "Article image placeholder",
    },
  ];

  for (const article of articles) {
    await client.createOrReplace({ _type: "article", ...article });
    console.log(`  wrote ${article._id}`);
  }

  console.log("Done.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
