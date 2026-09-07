import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schema } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

/* Not embedded in the Next.js app — see handoff.md for why (Next's webpack build
   can't bundle sanity@5.x's use of React's useEffectEvent hook; Sanity's own Vite
   tooling handles it fine). Run with `npx sanity dev` for local editing, or
   `npx sanity deploy` (Jojo's own login required — the provisioned API token
   deliberately lacks the deployStudio grant) for a hosted *.sanity.studio URL.

   projectId/dataset are hardcoded rather than read from process.env: this file is
   built by Vite, not Next.js, and Vite doesn't reliably expose arbitrary
   process.env values to client bundles the way Next.js does. Neither value is a
   secret — both already appear in the NEXT_PUBLIC_-prefixed env vars the Next.js
   app uses (see src/sanity/lib/client.ts), which is Sanity's own convention for
   marking them public-safe. */
export default defineConfig({
  name: "default",
  title: "Jojo Cruzado — Advisor Site",

  projectId: "7i8w96gp",
  dataset: "production",

  plugins: [structureTool({ structure })],

  schema,
});
