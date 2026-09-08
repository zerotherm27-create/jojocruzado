import { NextResponse } from "next/server";
import { CARD_FULL_NAME } from "@/config/site";
import { getSiteSettings } from "@/lib/supabase/queries";

const DEFAULT_ORG = "Sun Life Financial Advisor";
const SITE_URL = "https://jojocruzado.safetymargin.app";

/* Downloads a plain vCard 3.0 file — this alone is what makes "Save to
   Contacts" on /card work natively on iOS/Android, no client-side library
   needed. Never blank/broken: with no site_settings row at all, this still
   downloads a valid vCard with the name, a default org string, and the site
   URL; TEL/EMAIL lines are simply omitted (not emitted empty) when unset. */
export async function GET() {
  const settings = await getSiteSettings();

  const [firstName, ...rest] = CARD_FULL_NAME.split(" ");
  const lastName = rest.join(" ");
  const org = settings?.cardTitle || DEFAULT_ORG;
  const phone = settings?.cardPhone;
  const email = settings?.contactEmail;

  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${lastName};${firstName};;;`,
    `FN:${CARD_FULL_NAME}`,
    `ORG:${org}`,
    `TITLE:${org}`,
    phone ? `TEL;TYPE=CELL:${phone}` : null,
    email ? `EMAIL:${email}` : null,
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
