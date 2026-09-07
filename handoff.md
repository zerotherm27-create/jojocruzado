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
| This site | **https://jojocruzado.vercel.app** (production) |
| Vercel project | `jojocruzado`, team `zerotherm27-8336s-projects` |
| Intended final domain | `jojocruzado.safetymargin.app` — **not yet attached** |
| The real Safety Margin quiz | `https://safetymargin.app` — separate Vercel project named `insurance`, same team |
| Leads database | Supabase project "Safety Margin Funnel", ref `xcifmbfxatkunsjoozyv`, table `funnel_leads` |
| CMS (in progress) | Sanity, project ID `7i8w96gp`, dataset `production` — installed via Vercel Marketplace, **not yet wired into code** |
| Version control | **None.** No git repo exists. Deploys go straight from local files via `vercel` CLI. |

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

## In progress — Sanity CMS

Jojo asked for a real dashboard to manage: Insights articles, the hero/story/about
photos, and contact details (booking link, Messenger, Viber, email, socials). Direction
chosen: a headless CMS, provisioned via the Vercel Marketplace flow (per this
environment's rules, provider choice isn't free-form — see `memory.md`). Sanity was the
only/top result for the `cms` category.

**Done:** `vercel integration add sanity/project` completed — the Sanity project exists,
is connected to the `jojocruzado` Vercel project, and its credentials are in
`.env.local` (`NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`,
`SANITY_API_READ_TOKEN`, `SANITY_API_WRITE_TOKEN`, etc.).

**Not done — this is where work stopped:** no Sanity code exists in this repo yet. Zero
schema files, no client, no `/studio` route, `sanity`/`next-sanity` aren't even installed
(`npm install` failed with `ENOSPC: no space left on device` — the machine's disk was
full; confirmed recovered as of this writing, 1.1Gi free).

Planned shape (not yet built):
- `article` document type (title, category, dek, readTime, image, imageAlt) — replaces
  the hardcoded array in `src/content/insights.ts`
- `siteSettings` singleton (hero/story/about images + booking/Messenger/Viber/email/
  social links) — replaces hardcoded image paths in `src/app/page.tsx` /
  `src/app/about/page.tsx`, and the channel list in `src/app/contact/page.tsx` +
  the Connect column in `src/components/SiteFooter.tsx`
- `/studio` embedded route for Jojo to log into and edit content himself
- A seed script to push the *current* placeholder content into Sanity first, so the
  site doesn't go blank the moment it switches to reading from the CMS

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
3. **Attach the custom domain** `jojocruzado.safetymargin.app` to the `jojocruzado`
   Vercel project.
4. **Resolve the `/disclaimer` flagged assumptions** (retention period, privacy contact
   email) — see `memory.md` for why they're flagged rather than settled.
5. **Resolve `/resources`' compliance gate** before it's linked anywhere prominent with
   real artwork.
6. Consider initializing a real git repo — there isn't one. Every other project under
   this Vercel team is GitHub-linked; this one currently deploys from raw local files.
