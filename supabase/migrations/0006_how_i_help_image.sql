-- Adds a hero photo for /how-i-help, matching the same full-bleed-photo
-- treatment already used on the homepage Hero/Story and About page heroes.
-- Same RLS model as prior site_settings additions (0002, 0004): the existing
-- "Public read access" policy already covers new columns, all writes still
-- go through the service-role client in admin Server Actions.
alter table public.site_settings
  add column if not exists how_i_help_image_url text,
  add column if not exists how_i_help_image_alt text;
