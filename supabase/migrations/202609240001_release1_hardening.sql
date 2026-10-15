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

-- 2. current_account_id() is an RLS helper for signed-in users. "revoke ... from
--    public" (202607190001) does not remove the explicit grant Supabase gives
--    anon on new functions, which the security advisor flags.
revoke execute on function public.current_account_id() from anon;

-- 3. Token accounting per endpoint and day (bumpTokens in api/index.js). The
--    code writes these columns: run this before deploying, or the metrics
--    upsert fails (silently — metrics are best-effort) until it runs.
alter table if exists public.api_metrics_daily
  add column if not exists tokens_in  bigint not null default 0,
  add column if not exists tokens_out bigint not null default 0;
