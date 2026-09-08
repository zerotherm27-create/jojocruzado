// Shared by src/app/opengraph-image.tsx and src/app/twitter-image.tsx. A
// clean text/brand card, not a photo -- no existing site photo is close to
// the 1200x630 ratio without cutting off the subject, and generating a fake
// AI photo of a real, named person to represent him isn't something this
// project does (see memory.md's "never invent" rule). Runs through Satori
// (no CSS custom properties, browser fonts, or external stylesheets), so
// every value below is a literal, matching the tokens in src/styles/tokens.css.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const NAVY_900 = "#0b1220";
const NAVY_800 = "#172033";
const GOLD = "#f5a623";
const WHITE = "#ffffff";
const DARK_BODY = "#c7cedb";

export function BrandCard() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px 96px",
        background: `linear-gradient(135deg, ${NAVY_900} 0%, ${NAVY_800} 100%)`,
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", width: 56, height: 4, background: GOLD, borderRadius: 2 }} />
      <div
        style={{
          display: "flex",
          marginTop: 32,
          fontSize: 30,
          fontWeight: 600,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: GOLD,
        }}
      >
        Sun Life Financial Advisor
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 20,
          fontSize: 84,
          fontWeight: 700,
          color: WHITE,
        }}
      >
        Jojo Cruzado
      </div>
      <div style={{ display: "flex", marginTop: 28, fontSize: 30, color: DARK_BODY, maxWidth: 900 }}>
        Clear guidance. Practical protection.
      </div>
    </div>
  );
}
