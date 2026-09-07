import { defineField, defineType } from "sanity";

/* Singleton — see sanity.config.ts for the Studio structure that pins this to a
   single editable document instead of a list. Covers the site-wide photos and
   general contact channels. Deliberately excludes the /disclaimer page's privacy
   contact address — that's tied to specific, carefully-worded legal text, not
   general contact info, and stays hardcoded in that page's source. */
export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  groups: [
    { name: "photos", title: "Photos" },
    { name: "contact", title: "Contact details" },
  ],
  fields: [
    defineField({
      name: "heroImage",
      title: "Homepage hero photo",
      description: "4:5 portrait, shown at the top of the homepage.",
      type: "image",
      options: { hotspot: true },
      group: "photos",
    }),
    defineField({
      name: "heroImageAlt",
      title: "Hero photo description (for accessibility)",
      type: "string",
      group: "photos",
    }),
    defineField({
      name: "storyImage",
      title: "\"Personal story\" photo",
      description: "5:4 landscape, shown on the homepage's story section.",
      type: "image",
      options: { hotspot: true },
      group: "photos",
    }),
    defineField({
      name: "storyImageAlt",
      title: "Story photo description (for accessibility)",
      type: "string",
      group: "photos",
    }),
    defineField({
      name: "aboutImage",
      title: "About page photo",
      description: "4:5 portrait, shown on the About page.",
      type: "image",
      options: { hotspot: true },
      group: "photos",
    }),
    defineField({
      name: "aboutImageAlt",
      title: "About photo description (for accessibility)",
      type: "string",
      group: "photos",
    }),
    defineField({
      name: "bookingUrl",
      title: "Booking link (Calendly, etc.)",
      type: "url",
      group: "contact",
    }),
    defineField({
      name: "messengerUrl",
      title: "Messenger link",
      type: "url",
      group: "contact",
    }),
    defineField({
      name: "viberNumber",
      title: "Viber number",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "contactEmail",
      title: "Contact email",
      description: "General inquiries — not the /disclaimer privacy contact.",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "facebookUrl",
      title: "Facebook",
      type: "url",
      group: "contact",
    }),
    defineField({
      name: "linkedinUrl",
      title: "LinkedIn",
      type: "url",
      group: "contact",
    }),
    defineField({
      name: "instagramUrl",
      title: "Instagram",
      type: "url",
      group: "contact",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site Settings" }),
  },
});
