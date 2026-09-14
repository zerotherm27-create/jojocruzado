-- Lets Jojo maintain his own list of Facebook/LinkedIn groups to share
-- articles into, from /admin/settings, without a code change or a new
-- table -- one "Label | URL" per line, parsed in src/lib/shareGroups.ts.
-- Same RLS model as prior site_settings additions (0002, 0004, 0006): the
-- existing "Public read access" policy already covers new columns, all
-- writes still go through the service-role client in admin Server Actions.
alter table public.site_settings
  add column if not exists share_group_links text;
