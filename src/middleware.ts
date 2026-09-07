import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/* Gates /admin/* behind Supabase Auth, restricted to exactly the ADMIN_EMAIL
   account — not just "any authenticated user". Without the email check, a stray
   Supabase Auth sign-up (if ever left enabled in the dashboard) would grant full
   access to this dashboard to anyone who registers. Server Actions under /admin
   additionally call requireAdmin() themselves (see src/lib/supabase/admin.ts) as
   defense in depth, rather than relying on middleware alone. */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const isAdmin = Boolean(user && adminEmail && user.email?.trim().toLowerCase() === adminEmail);
  const isLoginPage = request.nextUrl.pathname === "/admin/login";

  if (!isAdmin && !isLoginPage) {
    // A signed-in-but-wrong-account session gets signed out too, not just
    // redirected — otherwise it would sit there until a page reload happened to
    // hit middleware again.
    if (user) await supabase.auth.signOut();
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (isAdmin && isLoginPage) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
