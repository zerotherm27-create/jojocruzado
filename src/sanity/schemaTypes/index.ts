import type { SchemaTypeDefinition } from "sanity";
import { articleType } from "./article";
import { siteSettingsType } from "./siteSettings";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [articleType, siteSettingsType],
};
