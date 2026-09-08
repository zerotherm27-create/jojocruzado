-- Backs /resources' Sun Life product artcards, replacing the hardcoded
-- placeholder array in src/app/(site)/resources/page.tsx with real,
-- admin-uploaded cards. Same RLS model as 0001 (public read, all writes via
-- the service-role client in admin Server Actions).
create table if not exists public.artcards (
  id            uuid primary key default gen_random_uuid(),
  need_id       text not null,
  image_url     text not null,
  image_alt     text not null default '',
  product_name  text,
  issued_on     text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.artcards enable row level security;

create policy "Public read access" on public.artcards
  for select using (true);

create trigger artcards_set_updated_at
  before update on public.artcards
  for each row execute function public.set_updated_at();
