# Handoff — Jojo Cruzado Advisor Site

_Last updated: 2026-09-07. Written to let anyone (or any future session) pick this up
without re-deriving the last two days of decisions._

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

Next.js 15 (App Router) + TypeScript + CSS Modules. No Tailwind, no UI library, no
animation library (deliberate — see `memory.md`). React 19.

## Live infrastructure

| What | Where |
|---|---|
| This site | **https://jojocruzado.safetymargin.app** (production) — also reachable at `jojocruzado.vercel.app` |
| Vercel project | `jojocruzado`, team `zerotherm27-8336s-projects`, git-connected to `github.com/zerotherm27-create/jojocruzado` (private) |
| Custom domain | Attached automatically when the project was created — this team already has `safetymargin.app` configured, so a project literally named `jojocruzado` claimed the matching subdomain with no manual step |
| The real Safety Margin quiz | `https://safetymargin.app` — separate Vercel project named `insurance`, same team |
| Leads database | Supabase project "Safety Margin Funnel", ref `xcifmbfxatkunsjoozyv`, table `funnel_leads` |
| CMS | Sanity, project ID `7i8w96gp`, dataset `production` — installed via Vercel Marketplace, wired into code, content seeded |
| Version control | Git repo initialized, pushed to `github.com/zerotherm27-create/jojocruzado` (private), Vercel git-connected — pushes to `main` now auto-deploy, matching every other project under this team. |

## Routes (9)

`/`, `/about`, `/how-i-help`, `/insights`, `/safety-margin`, `/contact`, `/disclaimer`,
`/resources`. All static/prerendered except `/contact` (has a Server Action).

Nav bar: About, How I Help, Insights, **Sun Life** (→ `/resources`), **Safety Margin**
(→ external `https://safetymargin.app`, same tab), Talk to Jojo (→ `/contact`).

## What's done

- All 7 MVP pages built to the design handoff's exact tokens (colors, type scale,
  spacing) and copy.
- Full accessibility pass: AA contrast fixes (new `--accent-on-light` token, `--danger`
  token), skip link, focus rings, 44px touch targets, `aria-current`, `autocomplete`.
- Motion pass: press states, hover transitions gated behind `(hover: hover)`, mobile menu
  entrance via `@starting-style`. Deliberately no animation library — see `memory.md`.
- `/resources` — a quarantined page for Sun Life-approved artcards. **Blocked**: needs
  written confirmation the artcards are approved for *website* use (not just social),
  the real files + product names + issue dates from Jojo, and a check on any rate/payout
  figures. Currently 3 placeholder slots.
- All "Safety Margin" links sitewide point to the real external quiz
  (`https://safetymargin.app`), not an internal stub.
- `/contact` form actually submits — `src/app/contact/actions.ts` is a Server Action
  that inserts into the shared `funnel_leads` table, tagged `source: 'contact_form'`.
  **Currently fails safely** with "Contact form is not yet configured." because
  `SUPABASE_SERVICE_ROLE_KEY` is blank in `.env.local` — see Next Steps.
- `/disclaimer` has a real, original privacy notice (not copied from Safety Margin's —
  the brief explicitly forbids that). Two assumptions in it are flagged inline and need
  Jojo's confirmation: the 24-month retention period, and reusing
  `support@safetymargin.app` as the privacy contact.
- Deployed to Vercel, verified live.

## Sanity CMS — done

Jojo asked for a real dashboard to manage: Insights articles, the hero/story/about
photos, and contact details (booking link, Messenger, Viber, email, socials). Direction
chosen: a headless CMS, provisioned via the Vercel Marketplace flow (per this
environment's rules, provider choice isn't free-form — see `memory.md`). Sanity was the
only/top result for the `cms` category.

**Provisioning:** `vercel integration add sanity/project` — the Sanity project exists,
is connected to the `jojocruzado` Vercel project, and its credentials are in
`.env.local` (`NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`,
`SANITY_API_READ_TOKEN`, `SANITY_API_WRITE_TOKEN`, etc.) and pulled from Vercel's own
Environment Variables.

**Schema** (`src/sanity/schemaTypes/`):
- `article` — title, category (fixed list matching the `/insights` pills), dek,
  readTime, image, imageAlt. Replaces the hardcoded array in `src/content/insights.ts`.
- `siteSettings` — a singleton (hero/story/about images + booking/Messenger/Viber/
  email/social links). Pinned as a true singleton in `src/sanity/structure.ts`.

**Data flow:** `src/sanity/lib/queries.ts` (`getArticles`, `getSiteSettings`,
`resolveImage`) is called from `src/app/page.tsx`, `about/page.tsx`,
`insights/page.tsx`, `contact/page.tsx`, and `src/components/SiteFooter.tsx`. Every one
of those falls back to the existing hardcoded placeholder content/images if Sanity has
no data yet, so the site never goes blank. `export const revalidate = 60` on every page
(plus `layout.tsx` for the footer) means Studio edits show up live within a minute — no
redeploy needed.

**Seeded:** `scripts/seed-sanity.mjs` has already been run once — it pushed the 3
existing placeholder articles and the current placeholder images into Sanity as a
starting point.

**Studio architecture — important, don't "fix" this:** the Studio is intentionally
**not** embedded in the Next.js app. An embedded `/studio` route was built and then
deleted, because `sanity@5.x` uses React's `useEffectEvent` hook in a way Next.js's
webpack build cannot statically analyze (a real bundler incompatibility, not a
misconfiguration). Instead, Studio runs via Sanity's own CLI tooling, configured in the
root `sanity.config.ts` (schema/structure, hardcoded `projectId`/`dataset` since Vite
doesn't reliably expose `process.env.*`) and `sanity.cli.ts` (CLI-only config):
- **Local editing:** `npx sanity dev` — runs a local Studio (Vite, not Next's webpack).
- **Hosted studio** (`*.sanity.studio` URL): `npx sanity deploy` — currently blocked by
  a missing `deployStudio` grant on the provisioned token. Not attempted as a
  workaround; Jojo would need to grant that permission himself (or deploy while logged
  into the Sanity dashboard) if he wants a hosted URL instead of running it locally.

**Deliberately out of scope for this CMS work:** the `/disclaimer` page's privacy
contact email stays hardcoded (it's tied to specific, carefully-worded legal text, not
general contact info) — not something to make casually CMS-editable.

## Next steps, roughly in order

1. **Resume the Sanity build** — install packages, write the two schemas, the client,
   the `/studio` route, wire the four consumers listed above, seed initial data.
2. **Get the Supabase `service_role` key into `.env.local`** — from
   `supabase.com/dashboard/project/xcifmbfxatkunsjoozyv/settings/api-keys`. This has to
   be pasted in directly by Jojo; it's a real secret and won't be handled by an
   assistant. Also needs setting under Vercel's own Environment Variables (Project
   Settings → Environment Variables) — anything only in local `.env.local` gets wiped
   the next time `vercel env pull` runs (it already happened once, during the Sanity
   install).
3. ~~Attach the custom domain~~ — done, see above.
4. **Resolve the `/disclaimer` flagged assumptions** (retention period, privacy contact
   email) — see `memory.md` for why they're flagged rather than settled.
5. **Resolve `/resources`' compliance gate** before it's linked anywhere prominent with
   real artwork.
6. ~~Initialize a git repo~~ — done, see above.
