"use server";

import { createServiceRoleClient } from "@/lib/supabase/client";
import { calculateProtectionGap, type ProtectionGapInputs } from "@/lib/protectionGap";
import { isValidEmail, isValidPhMobile } from "@/lib/leadValidation";

export type ProtectionGapLeadSubmission = {
  name: string;
  email: string;
  phone: string;
  inputs: ProtectionGapInputs;
};

/* Writes into the same shared funnel_leads table as /contact and /card,
   tagged source: "protection_gap_calculator". Deliberately its own action
   rather than reusing submitContactForm -- that one's role/topic dropdowns
   don't apply here, same reasoning submitCardLead's own comment gives for
   staying separate. Recomputes the result server-side (instead of trusting
   a client-sent number) so the summary saved for Jojo's follow-up stays
   trustworthy.

   TODO(compliance): same gap as ContactForm.tsx/CardExchangeForm.tsx -- this
   writes PII into funnel_leads and should link to a reviewed privacy notice
   before this is put in front of real people. */
export async function submitProtectionGapLead(
  data: ProtectionGapLeadSubmission,
): Promise<{ success: true } | { success: false; error: string }> {
  const name = data.name.trim();
  const phone = data.phone.trim();
  const email = data.email.trim();

  if (!name || (!phone && !email)) {
    return { success: false, error: "Enter your name and a phone number or email." };
  }

  if (email && !isValidEmail(email)) {
    return { success: false, error: "Enter a valid email address." };
  }

  if (phone && !isValidPhMobile(phone)) {
    return { success: false, error: "Enter a valid mobile number, e.g. 0917 123 4567." };
  }

  const result = calculateProtectionGap(data.inputs);
  const supabase = createServiceRoleClient();

  const { error } = await supabase.from("funnel_leads").insert({
    first_name: name,
    last_name: "",
    // mobile/email are NOT NULL on this shared table (confirmed via
    // submitCardLead's own comment) -- empty string is the "not provided"
    // sentinel already used there, not a real value.
    email: email || "",
    mobile: phone || "",
    role: "",
    topic: "",
    message:
      `Protection gap calc: income ₱${data.inputs.monthlyIncome.toLocaleString()}/mo, ` +
      `${data.inputs.dependents} dependent(s), existing coverage ₱${data.inputs.existingCoverage.toLocaleString()}, ` +
      `debts ₱${data.inputs.outstandingDebts.toLocaleString()}, estimated gap ₱${result.protectionGap.toLocaleString()}.`,
    consent_given_at: new Date().toISOString(),
    source: "protection_gap_calculator",
  });

  if (error) {
    console.error("submitProtectionGapLead: insert failed", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }

  return { success: true };
}
