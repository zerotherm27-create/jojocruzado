"use server";

import { createClient } from "@supabase/supabase-js";

export type ContactSubmission = {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  role: string;
  topic: string;
  message: string;
};

/* Writes into the same `funnel_leads` table the Safety Margin quiz uses, tagged
   source: 'contact_form' so the two intake paths stay distinguishable. Requires
   SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY as server-only env vars — see
   .env.example. Never import this from a Client Component; "use server" keeps it
   server-only, but the service-role key must never reach client code regardless. */
export async function submitContactForm(
  data: ContactSubmission,
): Promise<{ success: true } | { success: false; error: string }> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error("submitContactForm: SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set");
    return { success: false, error: "Contact form is not yet configured." };
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false },
  });

  const { error } = await supabase.from("funnel_leads").insert({
    first_name: data.firstName,
    last_name: data.lastName,
    email: data.email,
    mobile: data.mobile,
    role: data.role,
    topic: data.topic,
    message: data.message || null,
    consent_given_at: new Date().toISOString(),
    source: "contact_form",
  });

  if (error) {
    console.error("submitContactForm: insert failed", error);
    return { success: false, error: "Something went wrong sending your message." };
  }

  return { success: true };
}
