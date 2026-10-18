-- Lição de casa que chega ao professor (18/out/2026).
--
-- A tabela homework_submissions nunca foi criada em produção: as migrações
-- anteriores só ajustavam permissões nela (a 202607190005 falha inteira por
-- isso). O POST /api/homework devolvia 502 e o painel teacher_homework.html
-- abria com erro. Esta migração cria a tabela com o mesmo desenho das outras:
--
-- - o aluno grava e lê só as entregas dele (RLS por current_account_id());
-- - o servidor lê tudo com a chave secreta, para o painel do professor;
-- - visitante sem login não tem acesso nenhum;
-- - tamanho e XP limitados no próprio banco, além da API.
--
-- Roda no SQL Editor ANTES do código que a usa. Pode rodar de novo sem efeito.

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
  using (user_id = public.current_account_id());

create policy homework_insert_own on public.homework_submissions for insert to authenticated
  with check (
    user_id = public.current_account_id()
    and xp_earned between 0 and 500
    and lesson_id ~ '^[a-z0-9_-]{1,64}$'
    and length(lesson_title) <= 160
    and length(student_name) <= 80
    and jsonb_typeof(answers) = 'object'
    and length(answers::text) <= 20000
  );

commit;
