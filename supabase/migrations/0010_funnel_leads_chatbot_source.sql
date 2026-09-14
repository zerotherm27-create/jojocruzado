-- Extends funnel_leads_source_check (see 0003, 0008) to also allow
-- 'chatbot', for src/lib/chatbot/captureLead.ts's lead capture from the new
-- site-wide chat widget (src/app/api/chat/route.ts).
--
-- NOT VALID for the same reason as 0008: this table is also written by the
-- separate safetymargin.app app, whose existing rows this repo's migrations
-- can't revalidate. This repo's own insert (captureLead) always sends an
-- allowed value, so it's unaffected either way.
alter table public.funnel_leads
  drop constraint if exists funnel_leads_source_check;

alter table public.funnel_leads
  add constraint funnel_leads_source_check
  check (source = any (array[
    'quiz'::text,
    'contact_form'::text,
    'business_card'::text,
    'protection_gap_calculator'::text,
    'chatbot'::text
  ])) not valid;
