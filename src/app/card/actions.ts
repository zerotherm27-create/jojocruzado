"use server";

import { createServiceRoleClient } from "@/lib/supabase/client";

export type CardLeadSubmission = {
  name: string;
  phone: string;
  email: string;
};

/* Writes into the same shared funnel_leads table as /contact's
   submitContactForm (src/app/(site)/contact/actions.ts), tagged
   source: "business_card" so this quick-tap intake path stays
   distinguishable from the full contact form and the Safety Margin quiz.
   Deliberately its own action rather than a parameterized submitContactForm
   — that function's role/topic dropdowns and full validation are wrong for
   a fast tap-and-go form, and reshaping it risks /contact, which this work
   explicitly leaves untouched. */
export async function submitCardLead(
  data: CardLeadSubmission,
): Promise<{ success: true } | { success: false; error: string }> {
  const name = data.name.trim();
  const phone = data.phone.trim();
  const email = data.email.trim();

  if (!name || (!phone && !email)) {
    return { success: false, error: "Enter your name and a phone number or email." };
  }

  const supabase = createServiceRoleClient();

  const { error } = await supabase.from("funnel_leads").insert({
    first_name: name,
    last_name: "",
    // mobile/email are NOT NULL on this shared table (confirmed via a live
    // insert error, not guessed) — empty string is the same "not provided"
    // sentinel already used for last_name above, not a real value.
    email: email || "",
    mobile: phone || "",
    role: "",
    topic: "",
    message: "",
    consent_given_at: new Date().toISOString(),
    source: "business_card",
  });

  if (error) {
    console.error("submitCardLead: insert failed", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }

  return { success: true };
}
