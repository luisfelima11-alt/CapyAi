-- Jev "observando" (2026-09-30).
-- Run in the Supabase SQL editor AFTER 202609290001_custo_ia.sql and BEFORE
-- deploying the code that writes it. Idempotent, so running it twice is safe.
-- Until it runs, the server still asks Jev and the student sees no difference;
-- only the comparison is lost (the insert fails in silence).
--
-- Each row is one grade Jev gave next to the AI's grade for the same answer (the
-- daily challenge, 3 levels; free writing, 5 levels). No text and no student id:
-- only the two grades, Jev's confidence, latency, cost and an error code. The
-- admin reads it to decide whether Jev can grade on its own.
create table if not exists public.jev_decisions (
  id             bigint generated always as identity primary key,
  use_case       text not null,             -- 'desafio' | 'redacao'
  levels         smallint not null,         -- size of the rubric (3 or 5)
  jev_level      numeric(4, 2),             -- expected level, 1..levels; null when Jev failed
  jev_confidence numeric(4, 3),             -- 0..1, as Jev reports it
  ai_level       numeric(4, 2),             -- the AI's grade on the same rubric
  latency_ms     integer,
  cost_usd       numeric(12, 8) not null default 0,
  error          text,                      -- null when Jev answered as expected
  created_at     timestamptz not null default now()
);
create index if not exists jev_decisions_created_at_idx on public.jev_decisions (created_at);
alter table public.jev_decisions enable row level security;
revoke all on public.jev_decisions from anon, authenticated;
