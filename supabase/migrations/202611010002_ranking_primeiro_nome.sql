-- Ranking público só com o primeiro nome (decisão do Luis, 01/nov/2026).
--
-- O GET /api/db/leaderboard chama public.public_leaderboard() com a chave PÚBLICA
-- (sbPublic), e a página leaderboard.html mostra o resultado a qualquer visitante,
-- sem login. A 202607190004_public_leaderboard.sql nunca tinha rodado na produção,
-- então o ranking dava 502 desde julho e nenhum nome aparecia.
--
-- Esta substitui aquela: mesmo contrato (name, avatar, xp, badgesCount), mas `name`
-- é só o PRIMEIRO nome ("Maria", nunca "Maria Souza"), para expor o mínimo de dado
-- de aluno (LGPD; pode haver menores). Linhas sintéticas de user_state (mem_<id>,
-- __fatos_<id>) não entram: o join exige uma conta com aquele id.
--
-- anon precisa do EXECUTE (a API usa a chave pública). O verificador do Supabase vai
-- listar isso como "anon pode executar SECURITY DEFINER": é esperado, o ranking é
-- público por desenho, e a função só devolve os 4 campos acima (no máximo 100 linhas).
-- Pode rodar de novo sem efeito.

begin;

create or replace function public.public_leaderboard(p_limit integer default 20)
returns table(name text, avatar text, xp bigint, "badgesCount" integer)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select
    left(coalesce(nullif(split_part(btrim(coalesce(a.name::text, '')), ' ', 1), ''), 'Explorer'), 40) as name,
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
