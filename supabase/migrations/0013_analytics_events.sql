-- Self-hosted, privacy-friendly visitor analytics for /admin/analytics.
-- Deliberately collects no PII: just event_type, path, referrer, and a
-- timestamp -- no IP address, no User-Agent, no cookie/session id, so this
-- adds nothing to the compliance surface /disclaimer already tracks for
-- PII-collecting features (contact form, chatbot lead capture).
--
-- RLS enabled with NO policies at all, public or authenticated: every write
-- goes through the service-role client in src/app/api/analytics/track/route.ts,
-- every read goes through the service-role client behind requireAdmin() in
-- src/app/admin/(dashboard)/analytics/page.tsx. Nothing else ever touches
-- this table, so there's nothing to expose in either direction.
create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  path text,
  referrer text,
  created_at timestamptz not null default now()
);

create index if not exists analytics_events_created_at_idx
  on public.analytics_events (created_at);

alter table public.analytics_events enable row level security;
