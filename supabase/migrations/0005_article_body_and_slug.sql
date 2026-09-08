-- Adds long-form `body` (rich-text HTML from the new admin editor) and a
-- stable `slug` to public.articles, backing the new /insights/[slug] detail
-- page. The table already has real admin-created rows, so slug is added
-- nullable, backfilled from each row's title, then locked down -- a naive
-- `add column slug text not null` would fail outright on non-empty data.
-- Run once in the Supabase SQL Editor, same as 0001-0004.

alter table public.articles add column if not exists body text;
alter table public.articles add column if not exists slug text;

-- Backfill slug for any existing rows using the same rule the app's
-- slugify() uses for new rows going forward: lowercase, non-alphanumeric
-- runs collapsed to one hyphen, leading/trailing hyphens trimmed.
-- row_number() disambiguates two titles that would otherwise collide,
-- appending -2, -3, ... before the unique constraint is added below.
with base as (
  select
    id,
    regexp_replace(
      regexp_replace(lower(trim(title)), '[^a-z0-9]+', '-', 'g'),
      '(^-+)|(-+$)', '', 'g'
    ) as base_slug
  from public.articles
  where slug is null
),
numbered as (
  select
    id,
    base_slug,
    row_number() over (partition by base_slug order by id) as rn
  from base
)
update public.articles a
set slug = case when n.rn = 1 then n.base_slug else n.base_slug || '-' || n.rn end
from numbered n
where a.id = n.id;

alter table public.articles alter column slug set not null;
alter table public.articles add constraint articles_slug_unique unique (slug);

-- No RLS change needed: slug/body are just more columns on rows the existing
-- "Public read access" (select using (true)) policy already exposes; all
-- writes still go through the service-role client in admin Server Actions.
