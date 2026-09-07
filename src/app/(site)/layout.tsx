import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import MobileStickyCta from "@/components/MobileStickyCta";

// Footer reads Supabase data (Connect column) on every public page — revalidate
// so an edit in /admin shows up within a minute instead of needing a redeploy.
export const revalidate = 60;

/* Holds the public site's chrome (nav, footer, sticky CTA) — split out of the
   true root layout so /admin gets a separate layout tree with none of this,
   without forcing the whole site into dynamic rendering (which reading the
   pathname via next/headers in the root layout would have done). Route groups
   like (site) don't affect the URL, so / , /about, /insights etc. are unchanged. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <SiteHeader />
      <div id="main-content" tabIndex={-1}>
        {children}
      </div>
      <SiteFooter />
      <MobileStickyCta />
    </>
  );
}
