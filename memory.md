# Project memory — decisions and why

_Records the reasoning behind non-obvious decisions, so future work doesn't accidentally
reverse something that was already deliberated. For current status and next steps, see
`handoff.md` instead — this file is decision history, that one is a snapshot in time._

## The site's actual job

This site does **not** convert directly. Its job is to build enough trust that a visitor
clicks through to the *real* product — the Safety Margin quiz at `safetymargin.app`,
a separate, already-live app with its own database, its own privacy policy, and its own
lead-nurture automation. Every "Check My Safety Margin" button sitewide points there
externally, same tab, not to an internal page. Keep this in mind before building
anything that duplicates what that other app already does (a quiz flow, an AI report, an
admin dashboard for leads — it already has all of these).

**Why:** confirmed directly by browsing the live site and reading its own published
privacy policy mid-session — this wasn't assumed, it was verified.

## Never invent compliance-sensitive content

Credentials, awards, years of experience, client counts, testimonials, contact channels,
consultation pricing, and privacy-notice wording must never be fabricated. Leave them as
visible on-page placeholders with a `TODO(compliance)` comment until Jojo supplies the
real values, **except** when he explicitly asks for a first draft himself — see below.

**Why:** this is regulated financial-advice content in the Philippines. The design
brief itself lists these under "Placeholders & compliance" as deliberately unresolved,
and the strategy brief is explicit that a privacy notice must exist "before collecting
leads" and must not be copied from another site.

**The one exception, and how it was handled:** Jojo explicitly asked for a draft privacy
notice ("generate what is applicable"). It was written from the site's *actual*
implementation (real form fields, the real Supabase processor, real RA 10173 statutory
rights) — not invented, and not copied from Safety Margin's own policy (its policy
explicitly excludes free-text responses, which this site's contact form has, so it
doesn't cover this form's data). Two facts were carried over from Safety Margin's policy
because they're genuinely true here too (same database, same operator) and both are
flagged inline in `/disclaimer`'s source for Jojo to confirm: the 24-month retention
period, and reusing `support@safetymargin.app` as the privacy contact. The page still
says "draft copy pending compliance review" — that line should not be removed casually.

## Animation library: originally declined, later added deliberately (2026-09-08)

Runtime dependencies were originally kept to `next`, `react`, `react-dom`,
`@supabase/supabase-js` — no Framer Motion, no GSAP. All motion was plain CSS: hover
transitions, `:active` press states, `@starting-style` entrances.

**Original reasoning:** most pages were Server Components shipping zero client JS; an
animation library would force client boundaries onto components that don't need them.
CSS transitions also run off the main thread, which duration-based JS libraries
generally don't for simple hover/press effects. And the design brief explicitly asks for
restraint — "no transforms, no scale, no parallax" — close to the opposite of what those
libraries are for.

**Superseded 2026-09-08:** Jojo explicitly asked for animation effects because the site
"looks very static," and after being told this reverses the decision above (including
the client-boundary cost), confirmed he wanted `framer-motion` anyway. A single shared
component, `src/components/Reveal.tsx`, wraps a section's content in a subtle scroll-
triggered fade+rise (`whileInView`, plays once, skips entirely for
`prefers-reduced-motion`). It was applied to every public page's below-the-fold
sections **except** the hero/above-the-fold content on each page (so nothing delays the
first thing a visitor sees) and `/card` (which already had its own separate, earlier
CSS-driven entrance animation, left untouched).

**Accepted, known cost:** every page `Reveal` touches is no longer a zero-JS Server
Component; First Load JS rose roughly 40kB per page. This is a knowing tradeoff, not an
oversight — don't "fix" it by ripping Framer Motion back out without asking first.

**How to apply going forward:** reuse `Reveal` for any new section that should fade in
on scroll — don't hand-roll a second IntersectionObserver-based approach. The
"restraint" principle from the original brief still constrains *how much* motion
(no parallax, no scroll-jacking, no per-element staggered choreography) — it just no
longer means zero dependency.

## Secrets: a hard line, not a judgment call

API keys and service-role credentials are never typed, pasted, or entered by an
assistant into any field, file, or dashboard — not even when the user explicitly says to.
This came up concretely: retrieving and using the Supabase `service_role` key was
declined outright, and the exact dashboard path was handed to Jojo instead, for him to
paste in himself.

**The one nuance:** credentials that a *sanctioned first-party CLI* provisions
automatically into a local, gitignored env file (e.g. `vercel integration add` writing
Sanity's tokens into `.env.local`) are a different category — that's the tool's own
intended provisioning flow, not an assistant handling a secret. Referencing such a value
from `process.env` inside application code is normal and fine. Manually copying a secret
off a dashboard screen and typing it somewhere is not, regardless of who asks.

## External services go through the Marketplace flow, not free-form choice

When this project needs an external service (a CMS, a database, payments, etc.), the
provider isn't picked from general knowledge — it goes through the Vercel Marketplace's
`categorize → discover → install → build` sequence, and `/marketplace` itself is a
user-run slash command, not something triggerable from inside a session. This is why
Sanity was chosen for the CMS: it was the top (only) result for the `cms` category via
`vercel integration discover`, not a personal recommendation.

**Why this matters going forward:** if another external service is ever needed, don't
skip straight to installing a familiar package — run the discovery flow first, even if
the outcome seems obvious in advance.

## Sanity CMS was replaced with a custom Supabase admin, not extended

Sanity was provisioned (per the Marketplace-flow rule above) and a real CMS was built
on it: schemas, a data layer, four page consumers, seeded content. It was then fully
**replaced** by a hand-built `/admin` dashboard on Supabase (Postgres + Auth + Storage)
— not layered alongside it. Sanity's packages and schema files were left in the repo,
unused, rather than deleted immediately.

**Why:** one consistent backend was preferred over two parallel data stores, especially
since Supabase already held the shared `funnel_leads` table this site's contact form
and the separate quiz app both write to. Sanity Studio also had a real embedding
incompatibility with this Next.js version (`useEffectEvent` vs. webpack's static
analysis) that a hosted-Studio-only workaround only partially addressed.

**Consequence for future services:** this doesn't mean "don't use the Marketplace flow"
— it means a provisioned service can still be reconsidered later if it stops being the
right fit, and doing so cleanly (new implementation fully replaces the old one, one
data layer at a time) matters more than leaving both wired in "just in case."

## Never enter the site's own admin password, even if asked

`/admin` is gated by Supabase Auth. This assistant does not type Jojo's admin
email/password into the login form under any circumstances — not to test a feature, not
because he offers to share the password, not because it would make verification faster.
This is the same "secrets: a hard line" rule above, extended to credentials for this
project's own admin surface, not just third-party API keys.

**Consequence:** every admin-only feature (the rich-text article editor, artcard
uploads, site settings) gets verified by other means — direct REST calls to Supabase
using the already-provisioned service-role key (already an accepted exception, see
above), `tsc`/`next build`, and testing the *public*-facing result of an admin action.
The user is always the one who actually clicks through `/admin` itself.

## sanitize-html over isomorphic-dompurify, for a concrete reason

The rich-text article editor's server-side HTML sanitizer was originally
`isomorphic-dompurify`. It shipped, then crashed every load of `/admin/articles` in
production with `ERR_REQUIRE_ESM` — its `jsdom` dependency's `html-encoding-sniffer`
sub-dependency requires an ESM-only package via `require()`, which Node's runtime on
Vercel rejects outright. Marking the package external in `next.config.ts` only moved
the crash from build time to every request.

**Fix:** switched to `sanitize-html`, a pure-JS sanitizer with no DOM emulation, so no
jsdom/ESM interop exists to break. Verified directly (not just "build succeeded") that
it strips `<script>` and event-handler attributes while preserving the toolbar's actual
allowed output.

**Why this is worth remembering:** the failure only showed up in Vercel's runtime logs,
not in a local build — `next build` succeeded both before and after switching away from
jsdom's build-time complaint, and the real crash only occurred when the route actually
executed in Vercel's Node runtime. When a fix seems to work locally but a production-only
runtime error persists, check Vercel's actual runtime error/log tools before assuming
the first fix worked.

## Site structure: kept at 7 pages, deliberately

Jojo asked directly whether the site was over-built and should collapse to one page.
Explained the tradeoffs (the disclosure page is close to a legal necessity as a
standalone URL; How I Help and Insights want distinct, individually-indexable pages;
this being a trust-building site for a high-consideration category favors more
substantive content, not less) and he chose to keep all 7 pages, `/insights` included,
despite it currently having no real content pipeline. Don't re-propose consolidating
this without being asked again.

**Since then:** the page count has grown, but not by expanding this public marketing
IA — `/insights/[slug]` is per-article detail pages under the existing `/insights`
section (a natural extension once `/insights` got a real content pipeline), `/card` is
a separate NFC-business-card surface with its own chrome-free layout, and `/admin` is
the content-management tool, not public-facing content. None of this reopens the
"should this collapse to one page" question — it was about the public marketing pages
specifically.

## The Supabase project is intentionally shared, not isolated

Contact-form leads and quiz leads write into the *same* `funnel_leads` table (tagged by
a `source` column), in the *same* Supabase project Safety Margin already uses — not a
new, separate project. This was a deliberate choice, re-confirmed once already when asked
if a new project should be created instead.

**Why:** the whole point was a single, shared lead dashboard. A separate project would
be more isolated (smaller blast radius if a key ever leaked) but would break that shared
view entirely. If isolation ever becomes the priority over one dashboard, that's a real
reason to revisit — but it's a tradeoff to make consciously, not a default.
