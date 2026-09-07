import type { StructureResolver } from "sanity/structure";

/* Pins Site Settings as a true singleton — no list, no "create new", just the one
   document. Everything else (Insights Articles) gets the default list view. */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site Settings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => item.getId() !== "siteSettings"),
    ]);
