import "server-only";
import { redirect } from "next/navigation";
import { createServerClient } from "./client";

/* Second layer of defense beyond "there's only one Supabase Auth user": if public
   sign-up is ever left enabled in the Supabase dashboard, this stops anyone but
   the configured admin email from reaching an /admin action — even if middleware
   were somehow bypassed. Every mutating Server Action calls this directly rather
   than trusting middleware alone.

   Deliberately returns only `user`, not a Supabase client — the cookie-backed
   client used here runs as the authenticated user, and articles/site_settings
   have no write RLS policy for that role (only service-role bypasses RLS, per
   supabase/migrations/0001_articles_and_site_settings.sql). Callers that need to
   write must create their own createServiceRoleClient() after this check passes. */
export async function requireAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const email = user?.email?.trim().toLowerCase();

  if (!user || !adminEmail || email !== adminEmail) {
    redirect("/admin/login");
  }

  return { user };
}
