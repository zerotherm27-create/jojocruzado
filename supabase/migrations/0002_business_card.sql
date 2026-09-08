-- Adds columns needed for the /card digital business card page (the page an
-- NFC tap opens). Same table, same RLS model as 0001 — the existing
-- "Public read access" policy's `using (true)` already covers new columns,
-- and all writes still go through the service-role client in
-- src/app/admin/(dashboard)/settings/actions.ts, so no new policies needed.
alter table public.site_settings
  add column if not exists card_photo_url text,
  add column if not exists card_photo_alt text,
  add column if not exists card_title text,
  add column if not exists card_bio text,
  add column if not exists card_phone text;
