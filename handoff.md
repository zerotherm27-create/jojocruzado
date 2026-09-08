# Handoff — Jojo Cruzado Advisor Site

_Last updated: 2026-09-09. Written to let anyone (or any future session) pick this up
without re-deriving the last several days of decisions._

## What this is

A personal advisor website for **Jojo Cruzado, Sun Life Financial Advisor
(Philippines)**. Built from a design handoff at
`~/Downloads/design_handoff_jojo_advisor_site/` (`README.md` = design spec,
`jojo-cruzado-personal-advisor-website-handoff.md` = the strategy brief — read this
before making content or IA decisions, it answers most "should this exist" questions).

Positioning: advice-first, needs-first, not a product catalog. This site's actual job is
**trust-building before handing off** to the real conversion product, which lives
elsewhere (see Safety Margin, below).

## Stack

Next.js 15 (App Router) + TypeScript + CSS Modules. No Tailwind, no UI library. React 19.
Supabase (Postgres + Auth + Storage) is the sole live data layer — Sanity was fully
replaced (see "CMS history" below) but its packages/schema files are still present,
unused, in the repo. `framer-motion` was added 2026-09-08 for scroll-reveal entrance
animations — this reverses an earlier "no animation library" decision; see `memory.md`
for why and what the tradeoff was. `sanitize-html` and Tiptap (`@tiptap/react`,
`@tiptap/pm`, `@tiptap/starter-kit`) back the rich-text article editor.

## Live infrastructure

| What | Where |
|---|---|
| This site | **https://jojocruzado.safetymargin.app** (production) — also reachable at `jojocruzado.vercel.app` |
| Vercel project | `jojocruzado` (`prj_59AlChc3PER0sk5bMY8ofq989npt`), team `zerotherm27-8336s-projects` (`team_I6jgfHPrez0G1ZvYMOkNQhRn`), git-connected to `github.com/zerotherm27-create/jojocruzado` (public) — pushes to `main` auto-deploy |
| The real Safety Margin quiz | `https://safetymargin.app` — separate Vercel project, same team |
| Database | Supabase project ref `xcifmbfxatkunsjoozyv` ("Safety Margin Funnel"). Tables: `funnel_leads` (external/shared, also written by safetymargin.app's own quiz), `site_settings` (singleton), `articles`, `artcards`. Photo storage: bucket `site-media`. |
| Admin dashboard | `/admin`, gated by Supabase Auth restricted to a single `ADMIN_EMAIL` (checked in middleware and again in every write Server Action). Manages: Insights articles (rich text), Sun Life artcards, and Site Settings (photos, card details, contact links). Replaces Sanity entirely — see "CMS history" below. |

## Routes

Public (`(site)` route group, all under `src/app/(site)/`):
`/`, `/about`, `/how-i-help`, `/insights`, `/insights/[slug]` (first public dynamic
route in the app), `/safety-margin`, `/contact`, `/disclaimer`, `/resources`.

Digital business card (sibling to `(site)`, own chrome-free layout, `noindex`):
`/card` (photo, title, bio, tap-to-call/text/Viber/email, "Save to Contacts" vCard
download at `/card/vcard`, and a mutual contact-exchange form writing into
`funnel_leads` with `source: 'business_card'`).

Admin (`/admin`, all gated): `/admin` (dashboard home), `/admin/login`,
`/admin/settings`, `/admin/articles` (+ `/new`, `/[id]/edit`), `/admin/artcards`
(+ `/new`, `/[id]/edit`).

Nav bar: About, How I Help, Insights, **Sun Life** (→ `/resources`), **Safety Margin**
(→ external `https://safetymargin.app`, opens in a **new tab** — every Safety Margin
link sitewide does, changed 2026-09-08 so this site's tab stays open), Talk to Jojo
(→ `/contact`).

## What's done

- All public pages built to the design handoff's tokens (colors, type scale, spacing)
  and copy, plus the full accessibility pass from the original build (AA contrast,
  skip link, focus rings, 44px touch targets, `aria-current`, `autocomplete`).
- **Scroll-reveal entrance animations** (2026-09-08, via `framer-motion`): a shared
  `Reveal` component (`src/components/Reveal.tsx`) fades+rises each below-the-fold
  section into view once, respecting `prefers-reduced-motion`. Applied to `/`, `/about`,
  `/how-i-help`, `/resources`, `/safety-margin`, `/insights`, `/insights/[slug]`,
  `/contact`. Hero/above-the-fold content is left alone. `/card` keeps its own separate,
  earlier entrance animation. Known cost: those pages are no longer zero-JS Server
  Components.
- **`/resources`** — no longer blocked. Jojo confirmed written approval for artcard
  web display; `/admin/artcards` is a full CRUD (mirrors the articles admin pattern)
  so real Sun Life artcards can be added without a code change. Empty state shown until
  at least one is published.
- **`/insights`** — real blog behavior (2026-09-08): cards link to a real detail page
  at `/insights/[slug]` instead of showing the entire article text in the card; the
  card preview (`dek`) is now line-clamped. Articles are authored in `/admin/articles`
  with a real WYSIWYG toolbar (Tiptap: bold/italic/headings/lists/quote/link), sanitized
  server-side (`sanitize-html`) before storage. Pasting pre-written text with markdown
  syntax (`##`, `*`, `**`) is converted to real formatting at paste time
  (`src/lib/markdownPaste.ts`) — Tiptap's own shortcuts only fire on live typing.
- **`/card`** — a digital business card page for NFC taps (added 2026-09-06), styled
  like Linkit-style profile pages. Physically writing the NFC tag/card with the page's
  URL is done by Jojo himself via an NFC-writing app (e.g. NFC Tools); the linked
  physical card he had was found to be password-locked by its original vendor
  (Linkit), so a new blank NFC tag/card is needed before it can be reprogrammed.
- All "Safety Margin" links sitewide point to the real external quiz
  (`https://safetymargin.app`), opening in a new tab.
- `/contact` form actually submits and works end-to-end — `SUPABASE_SERVICE_ROLE_KEY`
  is set both locally and in Vercel's Environment Variables (was the blocking Next Step
  in the previous version of this doc; now resolved).
- `/disclaimer` has a real, original privacy notice (not copied from Safety Margin's).
  **Still flagged, unresolved:** the 24-month retention period and reusing
  `support@safetymargin.app` as the privacy contact — both need Jojo's explicit
  confirmation before the `TODO(compliance)` comments and the inline caveat can come out.
- `/safety-margin`'s FAQ still has two placeholder answers pending Jojo's confirmation:
  exact fields/retention/processors collected by the quiz, and whether consultations
  are free / which meeting channels are supported.
- Deployed to Vercel, verified live after every change (build clean + a Vercel
  deployment-status check is standard practice now, not just for major changes).

## CMS history — Sanity was replaced, not extended

The original plan (see the now-historical "Sanity CMS" section this doc used to have)
was a Sanity-backed CMS for articles, photos, and contact details. It was fully **replaced**
by a custom Supabase-backed `/admin` dashboard (commit "Replace Sanity CMS with a custom
Supabase-backed /admin dashboard"). Reasons included wanting one consistent backend
(Supabase already held `funnel_leads`) rather than two parallel data stores, and
Sanity Studio's embedding problems in this Next.js version (documented in git history).

**Sanity's packages (`sanity`, `next-sanity`, `@sanity/image-url`), schema
(`src/sanity/schemaTypes/`), and its own `queries.ts`/`resolveImage` are still present
in the repo but are dead code** — no live page imports from `src/sanity/...` anymore
except one legacy type-compatibility shim in `src/sanity/lib/queries.ts` (kept
compiling only because it shares the `Article` type with the real, live data layer).
Do not resurrect or "fix" the Sanity path without being asked; if it's ever confirmed
fully unused, removing it outright (packages + `src/sanity/`) is a reasonable cleanup,
not a risky one.

**The real, live data layer is `src/lib/supabase/queries.ts`** — `getArticles`,
`getArticleBySlug`, `getArtcards`, `getSiteSettings`, `resolveImage`. Every consumer
fails soft (falls back to hardcoded placeholder content) if Supabase is unreachable or
a table/column doesn't exist yet, which happens routinely right after a schema change
until its migration is run.

## Database migrations — always a manual step for the user

This assistant has never had live write access to this project's Supabase database
(the Supabase MCP tools available in past sessions only reached an unrelated project).
Every schema change ships as a new file in `supabase/migrations/`, and **the user runs
it themselves** in the Supabase SQL Editor after the code deploys:

- `0001_articles_and_site_settings.sql` — `articles`, `site_settings` tables, storage
  bucket `site-media`.
- `0002_business_card.sql` — `site_settings.card_*` columns for `/card`.
- `0003_funnel_leads_business_card_source.sql` — widens `funnel_leads.source` CHECK to
  allow `'business_card'`.
- `0004_artcards.sql` — the `artcards` table.
- `0005_article_body_and_slug.sql` — `articles.body`/`articles.slug` (backfilled +
  made `unique not null`) for the rich-text blog feature.
- `0006_how_i_help_image.sql` — `site_settings.how_i_help_image_url/alt`.

All six have been run against the live database as of this writing.

## Next steps, roughly in order

1. **Resolve the `/disclaimer` flagged assumptions** (retention period, privacy contact
   email) — see `memory.md` for why they're flagged rather than settled.
2. **Resolve `/safety-margin`'s two remaining FAQ placeholders** (exact data collected
   by the quiz; consultation pricing/meeting channels).
3. **Get a working NFC tag/card** — the physical card Jojo already has is
   password-locked by its previous vendor and can't be reprogrammed; a new blank
   NTAG213/215/216 card or sticker is needed, then written with
   `https://jojocruzado.safetymargin.app/card` via an app like NFC Tools.
4. **Upload real photos** where placeholders still show — the How I Help hero photo
   was added 2026-09-09 and is still on its placeholder image pending a real upload via
   `/admin/settings`.
5. Consider removing the dead Sanity code path (packages + `src/sanity/`) once confirmed
   nobody's relying on it — not urgent, but it's the one deliberately-left piece of
   cruft in an otherwise clean codebase.
