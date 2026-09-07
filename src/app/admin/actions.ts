"use server";

import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/client";

export async function logout() {
  const supabase = await createServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
