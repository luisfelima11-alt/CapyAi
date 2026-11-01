-- Lição de casa que chega ao professor (01/nov/2026).
--
-- A tabela homework_submissions nunca foi criada em produção. Com isso:
--   - o POST /api/homework (aula 32, via lesson-engine.js) responde 502;
--   - o teacher_homework.html abre com erro;
--   - a coluna de lição de casa do painel do professor (professor.html) fica vazia.
--
-- Mesmo desenho do PR #9 (202610180001_licao_de_casa.sql, nunca aplicado), com uma
-- diferença: as regras usam private.current_account_id(). Desde a 202611010001 a
-- public.current_account_id() não pode mais ser executada por usuário logado, então
-- a versão do #9 faria todo envio falhar com erro de permissão. Por isso este arquivo
-- vem DEPOIS da 202611010001 e substitui a 202610180001 do #9.
--
-- - o aluno grava e lê só as entregas dele (RLS, com o token dele via sbUser);
-- - o servidor lê tudo com a chave secreta (painéis do professor);
-- - visitante sem login não tem acesso nenhum;
-- - tamanho, formato do id da aula e XP limitados no próprio banco, além da API.
--
-- Pode rodar de novo sem efeito.

begin;

create table if not exists public.homework_submissions (
  id            uuid primary key default gen_random_uuid(),
  user_id       text not null references public.accounts(id) on delete cascade,
  student_name  text not null default 'Student',
  lesson_id     text not null,
  lesson_title  text not null default '',
  answers       jsonb not null default '{}'::jsonb,
  xp_earned     integer not null default 0,
  submitted_at  timestamptz not null default now()
);

create index if not exists homework_submissions_submitted_at_idx
  on public.homework_submissions (submitted_at desc);
create index if not exists homework_submissions_user_lesson_idx
  on public.homework_submissions (user_id, lesson_id);

alter table public.homework_submissions enable row level security;

revoke all on public.homework_submissions from anon, authenticated;
grant select on public.homework_submissions to authenticated;
grant insert (user_id, student_name, lesson_id, lesson_title, answers, xp_earned, submitted_at)
  on public.homework_submissions to authenticated;

drop policy if exists homework_own on public.homework_submissions;
drop policy if exists homework_select_own on public.homework_submissions;
drop policy if exists homework_insert_own on public.homework_submissions;

create policy homework_select_own on public.homework_submissions for select to authenticated
  using (user_id = private.current_account_id());

create policy homework_insert_own on public.homework_submissions for insert to authenticated
  with check (
    user_id = private.current_account_id()
    and xp_earned between 0 and 500
    and lesson_id ~ '^[a-z0-9_-]{1,64}$'
    and length(lesson_title) <= 160
    and length(student_name) <= 80
    and jsonb_typeof(answers) = 'object'
    and length(answers::text) <= 20000
  );

commit;
