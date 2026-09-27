-- Permissões por coluna (26/set/2026) — ANTES de desligar o "Confirm email".
--
-- A varredura de 23/set achou `anon` e `authenticated` com INSERT/UPDATE em
-- TODAS as colunas de accounts, user_profiles e user_state. A RLS já limita
-- cada aluno à própria linha, mas não às colunas: pelo PostgREST, com o
-- próprio login, dava para mudar o próprio `plan`, a validade e o vínculo da
-- conta. Com o cadastro aberto sem confirmação de e-mail, isso vira porta.
--
-- A migração de 19/jul (202607190005) pretendia o mesmo e nunca foi aplicada:
-- ela também mexe em homework_submissions, que não existe neste banco, e
-- falharia inteira. Esta cobre só as três tabelas e mantém as regras de linha
-- (RLS) como estão.
--
-- O que o app grava com o login do ALUNO (sbUser em api/index.js), e só isso
-- continua liberado:
--   user_state    upsert de (user_id, data, updated_at)        — progresso
--   user_profiles upsert de (id, english_level, goals, interests,
--                 interests_detail, daily_goal_minutes,
--                 onboarding_complete, updated_at)             — "Sobre mim"
-- Plano, validade, assinatura, e-mail e vínculo de login só o servidor muda
-- (chave de serviço, que não passa por estas permissões).
--
-- O UPDATE inclui a chave (user_id / id) de propósito: o upsert do PostgREST
-- (Prefer: resolution=merge-duplicates) põe TODAS as colunas do corpo no
-- "ON CONFLICT DO UPDATE SET", chave inclusive. Sem ela o salvamento do
-- progresso cairia em "permission denied". Trocar a chave para a de outro
-- aluno continua impossível: a RLS confere a linha nova (WITH CHECK).

begin;

revoke all on public.accounts      from anon, authenticated;
revoke all on public.user_profiles from anon, authenticated;
revoke all on public.user_state    from anon, authenticated;

grant select on public.accounts to authenticated;
grant update (name, avatar) on public.accounts to authenticated;

grant select on public.user_profiles to authenticated;
grant insert (id, english_level, goals, interests, interests_detail,
              daily_goal_minutes, onboarding_complete, updated_at)
  on public.user_profiles to authenticated;
grant update (id, english_level, goals, interests, interests_detail,
              daily_goal_minutes, onboarding_complete, updated_at)
  on public.user_profiles to authenticated;

grant select on public.user_state to authenticated;
grant insert (user_id, data, updated_at) on public.user_state to authenticated;
grant update (user_id, data, updated_at) on public.user_state to authenticated;

commit;
