import { NextResponse } from "next/server";
import { CARD_FULL_NAME } from "@/config/site";
import { getSiteSettings, resolveImage } from "@/lib/supabase/queries";

const DEFAULT_ORG = "Sun Life | Licensed Insurance Advisor";
const DEFAULT_BIO =
  "I help professionals, families, and business owners see their financial picture clearly and make practical decisions.";
const SITE_URL = "https://jojocruzado.safetymargin.app";

// vCard TEXT values need backslash/comma/semicolon/newline escaped per
// RFC 2426 — the bio is free text an admin can type, unlike the short
// fixed-format fields elsewhere in this file, so it's the one genuinely at
// risk of containing a comma or semicolon that would otherwise corrupt the
// line it's on.
function escapeVCardText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

/* Downloads a plain vCard 3.0 file — this alone is what makes "Save to
   Contacts" on /card work natively on iOS/Android, no client-side library
   needed. Never blank/broken: with no site_settings row at all, this still
   downloads a valid vCard with the name, a default org string, and the site
   URL; TEL/EMAIL lines are simply omitted (not emitted empty) when unset. */
export async function GET() {
  const settings = await getSiteSettings();

  const [firstName, ...rest] = CARD_FULL_NAME.split(" ");
  const lastName = rest.join(" ");
  const cardTitle = settings?.cardTitle || DEFAULT_ORG;
  // The admin's single "Card title line" field (placeholder: "Sun Life |
  // Licensed Insurance Advisor") doubles as both company and job title.
  // Split on the same "|" convention so a vCard reader shows two distinct
  // lines instead of the identical string twice under ORG and TITLE.
  const [org, title] = cardTitle.includes("|")
    ? cardTitle.split("|").map((part) => part.trim())
    : [cardTitle, null];
  const phone = settings?.cardPhone;
  const email = settings?.contactEmail;
  const bio = settings?.cardBio || DEFAULT_BIO;
  const photoPath = resolveImage(settings?.cardPhoto, "/images/jojo-about.png");
  const photoUrl = photoPath.startsWith("http") ? photoPath : `${SITE_URL}${photoPath}`;

  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${escapeVCardText(lastName)};${escapeVCardText(firstName)};;;`,
    `FN:${escapeVCardText(CARD_FULL_NAME)}`,
    `ORG:${escapeVCardText(org)}`,
    title ? `TITLE:${escapeVCardText(title)}` : null,
    phone ? `TEL;TYPE=CELL:${phone}` : null,
    email ? `EMAIL:${email}` : null,
    `NOTE:${escapeVCardText(bio)}`,
    `PHOTO;VALUE=URI:${photoUrl}`,
    `URL:${SITE_URL}`,
    "END:VCARD",
  ].filter((line): line is string => Boolean(line));

  const body = lines.join("\r\n") + "\r\n";

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": 'attachment; filename="jojo-cruzado.vcf"',
    },
  });
}
