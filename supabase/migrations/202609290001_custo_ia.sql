-- AI cost and shared cache (2026-09-29).
-- Run in the Supabase SQL editor AFTER 202609240001_release1_hardening.sql (it
-- creates tokens_in/tokens_out) and BEFORE deploying the code that uses it.
-- Every statement is idempotent, so running the file twice is safe. Until it
-- runs, the server keeps writing the counts without these columns (see
-- persistMetrics) and every cached route simply calls the AI.

-- 1. Estimated AI cost per route and day, in US$, worked out by the server when
--    the call happens (tokens x price of the model that answered; TTS by
--    character; transcription by minute), and how many of the route's requests
--    the shared cache answered. The admin sums them into "IA neste mes".
alter table if exists public.api_metrics_daily
  add column if not exists cost_usd   numeric(14, 6) not null default 0,
  add column if not exists cache_hits bigint not null default 0;

-- 2. Answers that are the same for every student (word of the day, daily
--    challenge, a lesson's quiz, the translation of a word), generated once and
--    served to everyone while they are valid. The key is a hash of the whole AI
--    request, so no student is named here. A table of its own, not rows of
--    user_state: the student scans read user_state without paging and Supabase
--    caps a read at 1000 rows. Only the server (service role) touches it.
create table if not exists public.ai_cache (
  cache_key  text primary key,
  route      text not null,
  answer     text not null,
  created_at timestamptz not null default now()
);
create index if not exists ai_cache_created_at_idx on public.ai_cache (created_at);
alter table public.ai_cache enable row level security;
revoke all on public.ai_cache from anon, authenticated;
