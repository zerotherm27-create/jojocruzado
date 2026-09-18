-- Session-based site analytics: visits, device/OS/browser, approximate
-- location (derived from Vercel's geo headers, raw IP never stored),
-- session duration, and bounce rate -- to back the richer /admin/analytics
-- dashboard, alongside the existing lightweight analytics_events log
-- (supabase/migrations/0013_analytics_events.sql), which keeps tracking the
-- chat funnel events unrelated to this session model.
--
-- RLS enabled with NO policies, same rationale as 0013: every write goes
-- through the service-role client in src/app/api/site/visit/route.ts and
-- src/app/api/site/heartbeat/route.ts, every read goes through the
-- service-role client behind requireAdmin() in
-- src/app/admin/(dashboard)/analytics/page.tsx. Nothing else touches these
-- tables.
create table if not exists public.site_sessions (
  id uuid primary key,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  duration_seconds integer not null default 0,
  landing_path text,
  page_count integer not null default 1,
  device_type text check (device_type in ('mobile', 'tablet', 'desktop', 'unknown')),
  os text,
  browser text,
  country text,
  region text,
  city text,
  referrer text
  -- No lead_id/funnel_leads backfill: funnel_leads is an external, shared
  -- table (see 0003_funnel_leads_business_card_source.sql) this repo
  -- doesn't own the schema of, and wiring session->lead correlation into
  -- every lead-capture path (contact form, chatbot, business card) is out
  -- of scope for this pass. Add it later if that correlation is needed.
);

create index if not exists site_sessions_created_at_idx
  on public.site_sessions (created_at);

create table if not exists public.site_pageviews (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.site_sessions (id) on delete cascade,
  path text,
  occurred_at timestamptz not null default now()
);

create index if not exists site_pageviews_occurred_at_idx
  on public.site_pageviews (occurred_at);

create index if not exists site_pageviews_session_id_idx
  on public.site_pageviews (session_id);

alter table public.site_sessions enable row level security;
alter table public.site_pageviews enable row level security;
