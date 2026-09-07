import "server-only";
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "./client";

/* Server-only: uses the write token, which must never reach the browser. Used by
   the one-time seed script and any future authoring code that isn't the Studio
   itself (the embedded Studio authenticates as the logged-in Sanity user, not
   via this token). */
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});
