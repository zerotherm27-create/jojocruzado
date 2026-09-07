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

## No animation library

Runtime dependencies were kept to `next`, `react`, `react-dom` (now also
`@supabase/supabase-js`, and soon Sanity's packages) — no Framer Motion, no GSAP. All
motion is plain CSS: hover transitions, `:active` press states, `@starting-style`
entrances.

**Why:** 11 of 14 components are Server Components shipping zero client JS; an
animation library would force client boundaries onto components that don't need them.
CSS transitions also run off the main thread, which duration-based JS libraries
generally don't for simple hover/press effects. And the design brief explicitly asks for
restraint — "no transforms, no scale, no parallax" — which is close to the opposite of
what those libraries are for.

**When this should change:** if a genuine multi-step interactive flow gets built (the
Safety Margin assessment, if it's ever rebuilt here instead of staying external; a
filterable Insights grid), that's a legitimate case for revisiting this.

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

## Site structure: kept at 7 pages, deliberately

Jojo asked directly whether the site was over-built and should collapse to one page.
Explained the tradeoffs (the disclosure page is close to a legal necessity as a
standalone URL; How I Help and Insights want distinct, individually-indexable pages;
this being a trust-building site for a high-consideration category favors more
substantive content, not less) and he chose to keep all 7 pages, `/insights` included,
despite it currently having no real content pipeline. Don't re-propose consolidating
this without being asked again.

## The Supabase project is intentionally shared, not isolated

Contact-form leads and quiz leads write into the *same* `funnel_leads` table (tagged by
a `source` column), in the *same* Supabase project Safety Margin already uses — not a
new, separate project. This was a deliberate choice, re-confirmed once already when asked
if a new project should be created instead.

**Why:** the whole point was a single, shared lead dashboard. A separate project would
be more isolated (smaller blast radius if a key ever leaked) but would break that shared
view entirely. If isolation ever becomes the priority over one dashboard, that's a real
reason to revisit — but it's a tradeoff to make consciously, not a default.
