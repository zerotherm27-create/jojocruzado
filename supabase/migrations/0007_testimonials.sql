-- Backs the client-testimonial moderation queue. Clients submit via an
-- unguessable, unlisted link (src/app/testimonials/[shareSlug]); Jojo
-- approves/rejects in /admin/testimonials; only approved rows are ever
-- publicly readable. Same RLS model as 0001/0004 (service-role bypasses
-- RLS for all writes and for reading pending/rejected rows in /admin).
create table if not exists public.testimonials (
  id            uuid primary key default gen_random_uuid(),
  client_name   text not null,
  relationship  text,
  review_body   text not null,
  rating        smallint not null check (rating between 1 and 5),
  status        text not null default 'pending'
                  check (status in ('pending', 'approved', 'rejected')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.testimonials enable row level security;

-- Unlike other tables in this project, NOT `using (true)` — pending/rejected
-- rows (unmoderated free text with a real client's name) must never be
-- publicly readable.
create policy "Public read access to approved testimonials"
  on public.testimonials
  for select using (status = 'approved');

create trigger testimonials_set_updated_at
  before update on public.testimonials
  for each row execute function public.set_updated_at();
