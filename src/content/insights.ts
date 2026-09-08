export type Article = {
  id: string;
  slug: string;
  category: string;
  title: string;
  dek: string;
  body?: string;
  readTime: string;
  image: string;
  imageAlt: string;
};

export const articles: Article[] = [
  {
    id: "company-insurance",
    slug: "company-insurance",
    category: "Protection",
    title: '"May insurance na ako sa company. Enough na ba?"',
    dek: "What company coverage usually includes, and where the gaps tend to sit.",
    body: "<p>What company coverage usually includes, and where the gaps tend to sit.</p>",
    readTime: "5 min read",
    image: "/images/insight-1.png",
    imageAlt: "Article image placeholder",
  },
  {
    id: "business-is-an-asset",
    slug: "business-is-an-asset",
    category: "Business",
    title: "Your business is an asset. So are you.",
    dek: "Why owner dependency is worth planning around while things are going well.",
    body: "<p>Why owner dependency is worth planning around while things are going well.</p>",
    readTime: "6 min read",
    image: "/images/insight-2.png",
    imageAlt: "Article image placeholder",
  },
  {
    id: "strong-income",
    slug: "strong-income",
    category: "Professionals",
    title: "Strong income doesn't always mean strong financial protection.",
    dek: "A simple way to check whether your structure has kept up with your earnings.",
    body: "<p>A simple way to check whether your structure has kept up with your earnings.</p>",
    readTime: "4 min read",
    image: "/images/insight-3.png",
    imageAlt: "Article image placeholder",
  },
];
