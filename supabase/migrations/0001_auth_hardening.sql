-- ════════════════════════════════════════════════════════════════════════════
-- 0001_auth_hardening.sql — server-side sessions + hashed passwords
-- ════════════════════════════════════════════════════════════════════════════
-- Run in the Supabase SQL editor BEFORE deploying the Phase 0 code.
-- Additive and safe to re-run: the old code keeps working after it.
-- ════════════════════════════════════════════════════════════════════════════

-- New columns used by /api/auth/*
alter table public.accounts add column if not exists password_hash     text;
alter table public.accounts add column if not exists session_version   integer not null default 1;
alter table public.accounts add column if not exists email_verified_at timestamptz;

-- New accounts no longer store the legacy (base64) password column.
alter table public.accounts alter column password drop not null;

-- E-mails are compared lowercase everywhere.
update public.accounts set email = lower(trim(email)) where email is distinct from lower(trim(email));

-- One account per e-mail. Skipped (with a notice) if duplicates already exist:
--   select lower(email), count(*) from public.accounts group by 1 having count(*) > 1;
do $$
begin
  if exists (select 1 from public.accounts group by lower(email) having count(*) > 1) then
    raise notice 'accounts has duplicate e-mails: resolve them, then re-run this migration to create the unique index.';
  else
    create unique index if not exists accounts_email_lower_key on public.accounts (lower(email));
  end if;
end $$;

-- Row Level Security ON without policies: the API uses the service-role key
-- (which bypasses RLS), while the public anon key can no longer read or write
-- these tables if it ever leaks.
do $$
declare t text;
begin
  foreach t in array array['accounts','user_state','user_profiles','magic_link_tokens',
                           'rate_limit_log','api_metrics_daily','homework_submissions'] loop
    if to_regclass('public.' || t) is not null then
      execute format('alter table public.%I enable row level security', t);
    end if;
  end loop;
end $$;
