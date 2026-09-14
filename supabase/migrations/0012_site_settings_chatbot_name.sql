-- Lets Jojo name the chat assistant (default "Margie", supplied in code --
-- see DEFAULT_CHATBOT_NAME in src/lib/chatbot/systemPrompt.ts) from
-- /admin/settings without a code change. Same pattern as 0011
-- (chatbot_intro_message): nullable, existing "Public read access" RLS
-- policy already covers new columns.
alter table public.site_settings
  add column if not exists chatbot_name text;
