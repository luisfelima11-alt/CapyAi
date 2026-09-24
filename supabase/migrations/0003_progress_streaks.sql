-- ════════════════════════════════════════════════════════════════════════════
-- 0003_progress_streaks.sql — saved lesson progress, study days and streaks
-- ════════════════════════════════════════════════════════════════════════════
-- Run in the Supabase SQL editor BEFORE deploying the Phase 2 code.
-- Additive and safe to re-run.
-- ════════════════════════════════════════════════════════════════════════════

-- What each user completed inside each lesson page.
--   item = 'section:<tab>'            a section/tab was completed
--        | 'xp:<tab>:<amount>#<n>'    that XP reward was already granted (no farming by reloading)
create table if not exists public.lesson_progress (
  user_id    text        not null,
  lesson_id  text        not null,          -- 'aula_12', 'fr_aula_03'
  item       text        not null,
  created_at timestamptz not null default now(),
  primary key (user_id, lesson_id, item)
);

-- One row per user per study day (Brazil time); count = study activities that day.
create table if not exists public.activity_days (
  user_id    text        not null,
  day        date        not null,
  count      integer     not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, day)
);

-- Consecutive study days. The API resets `current` when a day is missed.
create table if not exists public.user_streaks (
  user_id    text        primary key,
  current    integer     not null default 0,
  longest    integer     not null default 0,
  last_day   date,
  updated_at timestamptz not null default now()
);

alter table public.lesson_progress enable row level security;
alter table public.activity_days   enable row level security;
alter table public.user_streaks    enable row level security;

-- Keep the streak people see today. The old counter lived in the browser and
-- never reset; carry it over only for users active today or yesterday
-- (Brazil time). From now on the server counts it and resets it on a missed day.
insert into public.user_streaks (user_id, current, longest, last_day)
select s.user_id,
       least((s.data->>'streakDays')::int, 365),
       least((s.data->>'streakDays')::int, 365),
       case when coalesce(s.data->>'streakActive', 'false') = 'true'
                 and (s.data->>'lastQuestDate')::date = (now() at time zone 'America/Sao_Paulo')::date
            then (now() at time zone 'America/Sao_Paulo')::date
            else (now() at time zone 'America/Sao_Paulo')::date - 1
       end
from public.user_state s
where coalesce(s.data->>'streakDays', '') ~ '^[0-9]+$'
  and (s.data->>'streakDays')::int > 0
  and coalesce(s.data->>'lastQuestDate', '') ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
  and (s.data->>'lastQuestDate')::date >= (now() at time zone 'America/Sao_Paulo')::date - 1
on conflict (user_id) do nothing;
