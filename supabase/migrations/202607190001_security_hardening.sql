-- Capy English security baseline. Safe to re-run.
begin;

create extension if not exists pgcrypto;

alter table if exists public.accounts
  add column if not exists auth_user_id uuid references auth.users(id) on delete set null;
create unique index if not exists accounts_auth_user_id_unique
  on public.accounts(auth_user_id) where auth_user_id is not null;
create index if not exists accounts_email_normalized_idx
  on public.accounts(lower(trim(email)));

create table if not exists public.auth_migration_failures (
  account_id text primary key,
  reason text not null,
  recorded_at timestamptz not null default now()
);

create table if not exists public.webhook_events (
  provider text not null,
  event_id text not null,
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  status text not null default 'processed',
  primary key (provider, event_id)
);

create table if not exists public.security_audit_log (
  id bigint generated always as identity primary key,
  actor_id uuid,
  action text not null,
  target_type text,
  target_id_hash text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.rate_limit_buckets (
  bucket text primary key,
  window_started_at timestamptz not null,
  used integer not null default 0 check (used >= 0)
);

create or replace function public.consume_rate_limit(
  p_bucket text,
  p_limit integer,
  p_window_seconds integer
)
returns table(allowed boolean, used integer, retry_after integer)
language plpgsql security definer set search_path = public, pg_temp
as $$
declare
  v_now timestamptz := clock_timestamp();
  v_started timestamptz;
  v_used integer;
begin
  if p_bucket is null or length(p_bucket) > 512 or p_limit < 1
     or p_window_seconds < 1 or p_window_seconds > 604800 then
    raise exception 'invalid rate limit parameters';
  end if;
  insert into public.rate_limit_buckets(bucket, window_started_at, used)
  values (p_bucket, v_now, 1)
  on conflict (bucket) do update
    set window_started_at = case when public.rate_limit_buckets.window_started_at
      <= v_now - make_interval(secs => p_window_seconds) then v_now
      else public.rate_limit_buckets.window_started_at end,
      used = case when public.rate_limit_buckets.window_started_at
      <= v_now - make_interval(secs => p_window_seconds) then 1
      else public.rate_limit_buckets.used + 1 end
  returning window_started_at, rate_limit_buckets.used into v_started, v_used;
  allowed := v_used <= p_limit;
  used := v_used;
  retry_after := greatest(1, ceil(extract(epoch from
    (v_started + make_interval(secs => p_window_seconds) - v_now)))::integer);
  return next;
end;
$$;

revoke all on public.rate_limit_buckets from anon, authenticated;
revoke all on function public.consume_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_rate_limit(text, integer, integer) to service_role;

create or replace function public.current_account_id()
returns text language sql stable security definer set search_path = public, pg_temp
as $$ select id::text from public.accounts where auth_user_id = auth.uid() limit 1 $$;
revoke all on function public.current_account_id() from public;
grant execute on function public.current_account_id() to authenticated;

alter table if exists public.accounts enable row level security;
alter table if exists public.user_state enable row level security;
alter table if exists public.user_profiles enable row level security;
alter table if exists public.homework_submissions enable row level security;
alter table if exists public.push_subscriptions enable row level security;
alter table if exists public.rate_limit_log enable row level security;
alter table if exists public.api_metrics_daily enable row level security;
alter table public.auth_migration_failures enable row level security;
alter table public.webhook_events enable row level security;
alter table public.security_audit_log enable row level security;
alter table public.rate_limit_buckets enable row level security;

do $$
begin
  if to_regclass('public.accounts') is not null then
    drop policy if exists accounts_select_own on public.accounts;
    drop policy if exists accounts_update_own on public.accounts;
    create policy accounts_select_own on public.accounts for select to authenticated
      using (auth_user_id = auth.uid());
    create policy accounts_update_own on public.accounts for update to authenticated
      using (auth_user_id = auth.uid()) with check (auth_user_id = auth.uid());
  end if;
  if to_regclass('public.user_state') is not null then
    drop policy if exists user_state_own on public.user_state;
    create policy user_state_own on public.user_state for all to authenticated
      using (user_id::text = public.current_account_id())
      with check (user_id::text = public.current_account_id());
  end if;
  if to_regclass('public.user_profiles') is not null then
    drop policy if exists user_profiles_own on public.user_profiles;
    create policy user_profiles_own on public.user_profiles for all to authenticated
      using (id::text = public.current_account_id())
      with check (id::text = public.current_account_id());
  end if;
  if to_regclass('public.homework_submissions') is not null then
    drop policy if exists homework_own on public.homework_submissions;
    create policy homework_own on public.homework_submissions for all to authenticated
      using (user_id::text = public.current_account_id())
      with check (user_id::text = public.current_account_id());
  end if;
  if to_regclass('public.push_subscriptions') is not null then
    drop policy if exists push_subscriptions_own on public.push_subscriptions;
    create policy push_subscriptions_own on public.push_subscriptions for all to authenticated
      using (user_id::text = public.current_account_id())
      with check (user_id::text = public.current_account_id());
  end if;
end
$$;

revoke all on public.auth_migration_failures from anon, authenticated;
revoke all on public.webhook_events from anon, authenticated;
revoke all on public.security_audit_log from anon, authenticated;
revoke all on public.rate_limit_buckets from anon, authenticated;

do $$
begin
  if exists (select 1 from information_schema.columns where table_schema = 'public'
    and table_name = 'accounts' and column_name = 'password') then
    revoke select(password) on public.accounts from anon, authenticated;
  end if;
end
$$;

commit;
