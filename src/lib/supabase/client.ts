import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr";
import { createServerClient as createSupabaseServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/* Browser-side client for the /admin/login form only — uses the anon key, which is
   safe to expose client-side (unlike the service-role key below). */
export function createBrowserClient() {
  return createSupabaseBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

/* Server-side, cookie-backed client for middleware and admin Server Actions that
   need to know who's signed in (as opposed to the service-role client below, which
   has no concept of a signed-in user and bypasses RLS entirely). */
export async function createServerClient() {
  const cookieStore = await cookies();
  return createSupabaseServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component render (not an action/middleware) where
          // cookies can't be mutated — safe to ignore since middleware refreshes
          // the session on every request anyway.
        }
      },
    },
  });
}

/* Same pattern already used in src/app/contact/actions.ts, extracted here so admin
   mutations and the public query layer share one implementation. Bypasses RLS —
   used only in server-only code that never runs in the browser. */
export function createServiceRoleClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set");
  }

  return createClient(url, key, { auth: { persistSession: false } });
}
