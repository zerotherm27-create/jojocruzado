import { defineField, defineType } from "sanity";

/* Matches the existing Article shape in src/content/insights.ts exactly — no new
   fields (like a body or a slug) beyond what the site already renders, since
   there's no per-article detail page to point them at. Category options mirror
   the filter pills already on /insights, not the 8 "How I Help" need categories
   (those are a different, broader taxonomy). */
const CATEGORIES = [
  "Financial Foundation",
  "Protection",
  "Business",
  "Professionals",
  "Family",
  "Retirement",
];

export const articleType = defineType({
  name: "article",
  title: "Insights Article",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: { list: CATEGORIES },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "dek",
      title: "Description",
      description: "One sentence summarizing the article, shown under the title.",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "readTime",
      title: "Read time",
      description: 'e.g. "5 min read"',
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "imageAlt",
      title: "Image description (for accessibility)",
      description: "Describe what the image shows — read aloud by screen readers.",
      type: "string",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "category", media: "image" },
  },
});
