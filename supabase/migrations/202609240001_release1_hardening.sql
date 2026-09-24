-- Release 1 (security hardening, 2026-09-24).
-- Run in the Supabase SQL editor BEFORE deploying the code of this release.
-- Every statement is idempotent, so running the file twice is safe.

-- 1. Names and avatars are rendered for other students (ranking, nav) and are
--    writable by their owner straight through PostgREST. Refuse markup at the
--    source. NOT VALID: old rows are not checked now, every new write is.
--    To find old offenders:  select id from public.accounts
--                            where name ~ '[<>]' or avatar ~ '[<>]';
--    After fixing them:      alter table public.accounts validate constraint accounts_name_no_markup;
--                            alter table public.accounts validate constraint accounts_avatar_no_markup;
alter table public.accounts
  drop constraint if exists accounts_name_no_markup,
  add constraint accounts_name_no_markup check (name !~ '[<>]') not valid;

alter table public.accounts
  drop constraint if exists accounts_avatar_no_markup,
  add constraint accounts_avatar_no_markup check (avatar !~ '[<>]') not valid;
