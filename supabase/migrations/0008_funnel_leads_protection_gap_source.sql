-- Extends funnel_leads_source_check (see 0003) to also allow
-- 'protection_gap_calculator', for src/app/protection-gap/actions.ts's
-- submitProtectionGapLead.
--
-- Added NOT VALID: this table is also written by the separate
-- safetymargin.app app (per 0003's own comment), which apparently already
-- uses at least one source value this repo's migrations never accounted
-- for (re-adding the constraint normally failed against existing rows with
-- "check constraint ... is violated by some row"). NOT VALID skips
-- re-checking existing rows and only enforces the constraint on rows
-- inserted or updated from here on, which is the correct behavior for a
-- shared table whose other writers we don't control -- this repo's own
-- insert (submitProtectionGapLead) always sends an allowed value, so it's
-- unaffected either way.
alter table public.funnel_leads
  drop constraint if exists funnel_leads_source_check;

alter table public.funnel_leads
  add constraint funnel_leads_source_check
  check (source = any (array[
    'quiz'::text,
    'contact_form'::text,
    'business_card'::text,
    'protection_gap_calculator'::text
  ])) not valid;
