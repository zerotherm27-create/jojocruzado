-- Lets Jojo turn the site-wide chat widget off without a redeploy, and
-- optionally customize its opening message, from /admin/settings. Same
-- pattern as 0009 (share_group_links): the existing "Public read access" RLS
-- policy already covers new columns, all writes still go through the
-- service-role client in admin Server Actions.
alter table public.site_settings
  add column if not exists chatbot_enabled boolean not null default true;
alter table public.site_settings
  add column if not exists chatbot_intro_message text;
