-- Run this once in the Supabase SQL Editor for the "Safety Margin Funnel" project
-- (the same project funnel_leads already lives in). Adds the two tables that back
-- the /admin dashboard, plus the storage bucket for uploaded photos.

create table if not exists public.articles (
  id          uuid primary key default gen_random_uuid(),
  category    text not null,
  title       text not null,
  dek         text not null,
  read_time   text not null,
  image_url   text,
  image_alt   text not null default '',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Singleton via the "id boolean primary key" trick: a second row is structurally
-- impossible, since a boolean only has two values and the check pins it to true.
create table if not exists public.site_settings (
  id                 boolean primary key default true,
  hero_image_url     text,
  hero_image_alt     text,
  story_image_url    text,
  story_image_alt    text,
  about_image_url    text,
  about_image_alt    text,
  booking_url        text,
  messenger_url      text,
  viber_number       text,
  contact_email      text,
  facebook_url       text,
  linkedin_url       text,
  instagram_url      text,
  updated_at         timestamptz not null default now(),
  constraint site_settings_singleton check (id)
);

alter table public.articles enable row level security;
alter table public.site_settings enable row level security;

-- Public read access only. All writes go through the service-role client inside
-- admin Server Actions (same trust model as the existing contact form insert), so
-- no insert/update/delete policy is defined here — the service role bypasses RLS.
create policy "Public read access" on public.articles
  for select using (true);
create policy "Public read access" on public.site_settings
  for select using (true);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger articles_set_updated_at
  before update on public.articles
  for each row execute function public.set_updated_at();

create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

insert into storage.buckets (id, name, public)
values ('site-media', 'site-media', true)
on conflict (id) do nothing;
