-- current_account_id() sai do esquema exposto pela API (01/nov/2026).
--
-- O verificador de segurança do Supabase (lint 0029) acusava: a função
-- public.current_account_id() é SECURITY DEFINER e qualquer usuário logado podia
-- chamá-la por /rest/v1/rpc/current_account_id. Ela só devolve o id da conta de
-- quem chama (auth.uid()), então não vazava nada, mas não precisa estar exposta.
--
-- NÃO dá para só tirar o EXECUTE de authenticated: as regras de RLS de user_state e
-- user_profiles (202607190001_security_hardening.sql) chamam a função, e a API grava
-- o progresso com o token do aluno (sbUser). Sem o EXECUTE, o salvamento quebraria.
--
-- Então: cópia idêntica no esquema private (não exposto pelo PostgREST), as duas
-- regras passam a usá-la, e a antiga perde o EXECUTE (fica só para rollback rápido).
--
-- Já aplicada na produção em 01/nov/2026 (o banco é a fonte; este arquivo é o registro).
-- Conferido: as regras usam a cópia, o corpo é igual, anon não usa o esquema, um aluno
-- sintético (transação desfeita) grava e lê só o próprio progresso e é bloqueado (42501)
-- ao gravar em outra conta. Pode rodar de novo sem efeito.

begin;

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;

create or replace function private.current_account_id()
returns text
language sql stable security definer
set search_path = public, pg_temp
as $$ select id::text from public.accounts where auth_user_id = auth.uid() limit 1 $$;

revoke all on function private.current_account_id() from public;
grant execute on function private.current_account_id() to authenticated;

alter policy user_state_own on public.user_state
  using (user_id = private.current_account_id())
  with check (user_id = private.current_account_id());

alter policy user_profiles_own on public.user_profiles
  using (id = private.current_account_id())
  with check (id = private.current_account_id());

revoke execute on function public.current_account_id() from authenticated;

commit;

-- Rollback (se algo der errado):
--   grant execute on function public.current_account_id() to authenticated;
--   alter policy user_state_own on public.user_state
--     using (user_id = public.current_account_id()) with check (user_id = public.current_account_id());
--   alter policy user_profiles_own on public.user_profiles
--     using (id = public.current_account_id()) with check (id = public.current_account_id());
