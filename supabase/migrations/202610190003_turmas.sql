-- Turma do professor e atividade diária (19/out/2026).
--
-- O professor acompanha só os alunos que ENTRARAM na turma dele pelo link
-- (/turma.html?c=<código>), aceitando compartilhar o progresso: a LGPD pede o
-- consentimento do aluno para outra pessoa ver os dados dele. O aluno sai quando
-- quiser.
--
-- atividade_diaria guarda, por aluno e por dia, quantas mini-lições da trilha ele
-- terminou e quanto XP ganhou. O servidor calcula pela diferença entre o estado
-- salvo e o anterior (POST /api/db), sem nada novo no navegador. Sem isso o painel
-- só saberia o total, nunca "fez a trilha hoje?".
--
-- Tudo só do servidor (chave secreta): RLS ligada e nenhum acesso para anon ou
-- authenticated. Roda no SQL Editor ANTES do código. Pode rodar de novo sem efeito.

begin;

create table if not exists public.turmas (
  codigo        text primary key check (codigo ~ '^[a-z0-9]{8}$'),
  professor_id  text not null unique references public.accounts(id) on delete cascade,
  nome          text not null default 'Minha turma' check (char_length(nome) <= 60),
  criado_em     timestamptz not null default now()
);

create table if not exists public.turma_alunos (
  professor_id  text not null references public.accounts(id) on delete cascade,
  aluno_id      text not null references public.accounts(id) on delete cascade,
  entrou_em     timestamptz not null default now(),
  primary key (professor_id, aluno_id),
  check (professor_id <> aluno_id)
);
create index if not exists turma_alunos_aluno_idx on public.turma_alunos (aluno_id);

create table if not exists public.atividade_diaria (
  user_id  text not null references public.accounts(id) on delete cascade,
  dia      date not null,
  minis    integer not null default 0 check (minis between 0 and 500),
  xp       integer not null default 0 check (xp between 0 and 100000),
  primary key (user_id, dia)
);

alter table public.turmas enable row level security;
alter table public.turma_alunos enable row level security;
alter table public.atividade_diaria enable row level security;
revoke all on public.turmas, public.turma_alunos, public.atividade_diaria from anon, authenticated;

-- Soma atômica do dia: duas abas salvando juntas não perdem um ao outro.
create or replace function public.somar_atividade(p_user text, p_dia date, p_minis integer, p_xp integer)
returns void
language sql security definer set search_path = public, pg_temp
as $$
  insert into public.atividade_diaria as a (user_id, dia, minis, xp)
  values (p_user, p_dia, least(greatest(p_minis, 0), 500), least(greatest(p_xp, 0), 100000))
  on conflict (user_id, dia) do update
     set minis = least(a.minis + excluded.minis, 500),
         xp    = least(a.xp + excluded.xp, 100000);
$$;

revoke all on function public.somar_atividade(text, date, integer, integer) from public, anon, authenticated;
grant execute on function public.somar_atividade(text, date, integer, integer) to service_role;

commit;
