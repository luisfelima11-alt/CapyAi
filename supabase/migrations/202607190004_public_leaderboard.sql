begin;

create or replace function public.public_leaderboard(p_limit integer default 20)
returns table(name text, avatar text, xp bigint, "badgesCount" integer)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select
    left(coalesce(a.name::text, 'Explorer'), 80) as name,
    left(coalesce(a.avatar::text, '🐾'), 32) as avatar,
    case when coalesce(s.data::jsonb ->> 'xp', '') ~ '^\d{1,10}$'
      then (s.data::jsonb ->> 'xp')::bigint else 0 end as xp,
    case when jsonb_typeof(s.data::jsonb -> 'badges') = 'array'
      then jsonb_array_length(s.data::jsonb -> 'badges') else 0 end as "badgesCount"
  from public.user_state s
  join public.accounts a on a.id::text = s.user_id::text
  order by xp desc
  limit greatest(1, least(coalesce(p_limit, 20), 100));
$$;

revoke all on function public.public_leaderboard(integer) from public;
grant execute on function public.public_leaderboard(integer) to anon, authenticated;

commit;
