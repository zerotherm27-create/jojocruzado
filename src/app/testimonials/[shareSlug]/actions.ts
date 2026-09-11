"use server";

import { createServiceRoleClient } from "@/lib/supabase/client";

export type TestimonialSubmission = {
  clientName: string;
  relationship: string;
  reviewBody: string;
  rating: number;
  consent: boolean;
  company: string; // honeypot — real users never fill this in
};

export async function submitTestimonial(
  data: TestimonialSubmission,
): Promise<{ success: true } | { success: false; error: string }> {
  // Bots fill every field including hidden ones. Return a success-shaped
  // response rather than an error, so a bot gets no signal anything was
  // rejected, and skip the insert entirely.
  if (data.company.trim() !== "") {
    return { success: true };
  }

  const clientName = data.clientName.trim();
  const reviewBody = data.reviewBody.trim();

  if (!clientName || !reviewBody || !data.consent) {
    return {
      success: false,
      error: "Please fill in your name, a short review, and confirm consent.",
    };
  }
  if (!Number.isInteger(data.rating) || data.rating < 1 || data.rating > 5) {
    return { success: false, error: "Please select a rating." };
  }

  const supabase = createServiceRoleClient();
  const { error } = await supabase.from("testimonials").insert({
    client_name: clientName,
    relationship: data.relationship.trim() || null,
    review_body: reviewBody,
    rating: data.rating,
    status: "pending",
  });

  if (error) {
    console.error("submitTestimonial: insert failed", error);
    return { success: false, error: "Something went wrong submitting your review. Please try again." };
  }

  return { success: true };
}
