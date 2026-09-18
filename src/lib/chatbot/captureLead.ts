import { createServiceRoleClient } from "@/lib/supabase/client";
import { isValidEmail, isValidPhMobile } from "@/lib/leadValidation";

/* Writes into the same shared funnel_leads table as /contact, /card, and the
   protection gap calculator (src/app/(site)/contact/actions.ts,
   src/app/card/actions.ts, src/app/protection-gap/actions.ts), tagged
   source: "chatbot". Called from src/app/api/chat/route.ts when the model
   invokes the capture_lead tool (src/lib/chatbot/tools.ts) — args is
   `unknown` and every field is re-validated here rather than trusted as
   pre-shaped, since it's JSON.parse'd model output, not a form a human typed
   and submitted. Same defensive posture the form-backed actions take toward
   client input, just applied to an even less trustworthy source.

   TODO(compliance): same gap as ContactForm.tsx/CardExchangeForm.tsx/
   ProtectionGapCalculator.tsx -- this writes PII into funnel_leads and
   /disclaimer's privacy notice currently only covers the /contact form; it
   should be extended to cover this intake path too before this is put in
   front of real visitors. */
export async function captureLead(args: unknown): Promise<{ success: boolean }> {
  if (typeof args !== "object" || args === null) {
    return { success: false };
  }
  const raw = args as Record<string, unknown>;

  const name = typeof raw.name === "string" ? raw.name.trim() : "";
  const email = typeof raw.email === "string" ? raw.email.trim() : "";
  const mobile = typeof raw.mobile === "string" ? raw.mobile.trim() : "";
  const consent = raw.consent === true;
  const summary = typeof raw.summary === "string" ? raw.summary.trim() : "";

  if (!name || !consent || (!email && !mobile)) {
    return { success: false };
  }
  if (email && !isValidEmail(email)) {
    return { success: false };
  }
  if (mobile && !isValidPhMobile(mobile)) {
    return { success: false };
  }

  let supabase;
  try {
    supabase = createServiceRoleClient();
  } catch (configError) {
    // Same "not yet configured" soft-fail every other lead action takes when
    // SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY aren't set, rather than a 500.
    console.error("captureLead: Supabase not configured", configError);
    return { success: false };
  }

  const { error } = await supabase.from("funnel_leads").insert({
    first_name: name,
    last_name: "",
    // mobile/email are NOT NULL on this shared table (confirmed via
    // submitCardLead's own comment) -- empty string is the "not provided"
    // sentinel already used there, not a real value.
    email: email || "",
    mobile: mobile || "",
    role: "",
    topic: "",
    // Model-generated, not free text a human typed and reviewed -- bounded
    // so a runaway summary can't write an oversized row.
    message: summary.slice(0, 1000),
    consent_given_at: new Date().toISOString(),
    source: "chatbot",
  });

  if (error) {
    console.error("captureLead: insert failed", error);
    return { success: false };
  }

  return { success: true };
}
