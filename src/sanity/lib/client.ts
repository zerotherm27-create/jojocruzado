import { createClient } from "next-sanity";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID as string;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET as string;

/* apiVersion pinned to a fixed date per Sanity's own convention — locks the API
   shape so a future Sanity API change can't silently alter query results. */
export const apiVersion = "2024-01-01";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // CDN is fine for this site: content changes are infrequent (an advisor manually
  // publishing an article or updating a photo), not high-frequency data.
  useCdn: process.env.NODE_ENV === "production",
});
