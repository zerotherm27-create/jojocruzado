"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/admin";
import { createServiceRoleClient } from "@/lib/supabase/client";

function revalidateTestimonials() {
  revalidatePath("/"); // homepage displays approved ones
  revalidatePath("/admin/testimonials");
}

export async function approveTestimonial(id: string) {
  await requireAdmin();
  const supabase = createServiceRoleClient();
  const { error } = await supabase.from("testimonials").update({ status: "approved" }).eq("id", id);

  if (error) {
    redirect(`/admin/testimonials?error=${encodeURIComponent(error.message)}`);
  }
  revalidateTestimonials();
  redirect("/admin/testimonials");
}

export async function rejectTestimonial(id: string) {
  await requireAdmin();
  const supabase = createServiceRoleClient();
  const { error } = await supabase.from("testimonials").update({ status: "rejected" }).eq("id", id);

  if (error) {
    redirect(`/admin/testimonials?error=${encodeURIComponent(error.message)}`);
  }
  revalidateTestimonials();
  redirect("/admin/testimonials");
}

export async function deleteTestimonial(id: string) {
  await requireAdmin();
  const supabase = createServiceRoleClient();
  await supabase.from("testimonials").delete().eq("id", id);
  revalidateTestimonials();
  redirect("/admin/testimonials");
}
