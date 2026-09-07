"use server";

import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/client";

export async function login(
  _prevState: { error: string | null },
  formData: FormData,
): Promise<{ error: string | null }> {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const supabase = await createServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Incorrect email or password." };
  }

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const signedInEmail = data.user?.email?.trim().toLowerCase();

  if (!adminEmail || signedInEmail !== adminEmail) {
    await supabase.auth.signOut();
    return { error: "This account isn't authorized for admin access." };
  }

  redirect("/admin");
}
