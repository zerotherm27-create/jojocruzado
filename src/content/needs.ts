export type Need = {
  id: string;
  title: string;
  body: string;
};

/* The eight need categories from /how-i-help, shared so /resources can label its
   artcards against the same categories rather than inventing its own taxonomy
   (strategy brief, section 21: "Do not structure around products. Use needs instead."). */
export const needs: Need[] = [
  {
    id: "financial-foundation",
    title: "Financial Foundation",
    body: "Cash flow, emergency reserves and priorities.",
  },
  {
    id: "income-family-protection",
    title: "Income & Family Protection",
    body: "Helping clients think through the financial impact of unexpected events.",
  },
  {
    id: "health-preparedness",
    title: "Health Preparedness",
    body: "Understanding existing HMO, health benefits and personal coverage gaps.",
  },
  {
    id: "education-planning",
    title: "Education Planning",
    body: "Preparing gradually for future education costs.",
  },
  {
    id: "retirement-planning",
    title: "Retirement Planning",
    body: "Turning long-term goals into structured preparation.",
  },
  {
    id: "business-continuity",
    title: "Business Continuity",
    body: "Planning around owners, key people, employees and family responsibilities.",
  },
  {
    id: "wealth-accumulation",
    title: "Wealth Accumulation",
    body: "Long-term investing and goal-based accumulation where suitable.",
  },
  {
    id: "legacy-planning",
    title: "Legacy Planning",
    body: "Helping clients think about asset transfer and family continuity, with proper legal and tax professionals involved where needed.",
  },
];
