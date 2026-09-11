// Shared by src/app/opengraph-image.tsx and src/app/twitter-image.tsx. Runs
// through Satori (no CSS custom properties, browser fonts, or external
// stylesheets), so every value below is a literal, matching the tokens in
// src/styles/tokens.css and the scrim-navy gradient in primitives.css.
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getSiteSettings } from "@/lib/supabase/queries";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const NAVY_900 = "#0b1220";
const GOLD = "#f5a623";
const WHITE = "#ffffff";
const DARK_BODY = "#c7cedb";

// Resolves the photo to composite into the card: whatever photo is currently
// set as the site's hero image (so this stays in sync with what's live on
// the homepage), falling back to the checked-in placeholder read straight
// off disk and inlined as a data URI -- Satori fetches remote <img src>
// URLs itself, so a Supabase URL just works, but a local /public path
// wouldn't resolve without a host to fetch it from.
export async function resolveCardImageSrc(): Promise<string> {
  const settings = await getSiteSettings();
  if (settings?.heroImage) return settings.heroImage;

  const file = await readFile(path.join(process.cwd(), "public/images/jojo-hero.png"));
  return `data:image/png;base64,${file.toString("base64")}`;
}

export function BrandCard({ imageSrc }: { imageSrc: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        display: "flex",
        background: NAVY_900,
        fontFamily: "sans-serif",
      }}
    >
      <img
        src={imageSrc}
        width={size.width}
        height={size.height}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "78% 30%",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          background:
            "linear-gradient(90deg, rgba(11,18,32,0.97) 0%, rgba(11,18,32,0.94) 45%, rgba(11,18,32,0.8) 62%, rgba(11,18,32,0.4) 82%, rgba(11,18,32,0.12) 100%)",
        }}
      />
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 96px",
          maxWidth: 720,
        }}
      >
        <div style={{ display: "flex", width: 56, height: 4, background: GOLD, borderRadius: 2 }} />
        <div
          style={{
            display: "flex",
            marginTop: 32,
            fontSize: 28,
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
            fontSize: 76,
            fontWeight: 700,
            color: WHITE,
          }}
        >
          Jojo Cruzado
        </div>
        <div style={{ display: "flex", marginTop: 28, fontSize: 28, color: DARK_BODY, maxWidth: 520 }}>
          Clear guidance. Practical protection.
        </div>
      </div>
    </div>
  );
}
