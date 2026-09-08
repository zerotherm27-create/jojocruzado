-- funnel_leads is an external, shared table (also fed by safetymargin.app's
-- quiz) not otherwise defined in this repo's migrations. Its source column
-- has a CHECK constraint currently allowing only 'quiz' and 'contact_form'
-- (confirmed live via: SELECT pg_get_constraintdef(oid) FROM pg_constraint
-- WHERE conname = 'funnel_leads_source_check';). This purely ADDS
-- 'business_card' to that allow-list for src/app/card/actions.ts's
-- submitCardLead — the existing 'quiz' and 'contact_form' values, and
-- anything that depends on them (the separate safetymargin.app app
-- included), are untouched.
alter table public.funnel_leads
  drop constraint if exists funnel_leads_source_check;

alter table public.funnel_leads
  add constraint funnel_leads_source_check
  check (source = any (array['quiz'::text, 'contact_form'::text, 'business_card'::text]));
