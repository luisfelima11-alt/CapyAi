begin;

-- RLS limits rows; column privileges prevent users from promoting their own plan
-- or relinking an account even when they call PostgREST directly.
revoke insert, update on public.user_profiles from authenticated;
grant insert (
  id, english_level, goals, interests, interests_detail,
  daily_goal_minutes, onboarding_complete, updated_at
) on public.user_profiles to authenticated;
grant update (
  english_level, goals, interests, interests_detail,
  daily_goal_minutes, onboarding_complete, updated_at
) on public.user_profiles to authenticated;

revoke insert, update on public.accounts from authenticated;
grant update (name, avatar) on public.accounts to authenticated;

revoke all on public.user_state from anon, authenticated;
grant select on public.user_state to authenticated;
grant insert (user_id, data, updated_at) on public.user_state to authenticated;
grant update (data, updated_at) on public.user_state to authenticated;
drop policy if exists user_state_own on public.user_state;
create policy user_state_select_own on public.user_state for select to authenticated
  using (user_id::text = public.current_account_id());
create policy user_state_insert_own on public.user_state for insert to authenticated
  with check (
    user_id::text = public.current_account_id()
    and jsonb_typeof(data::jsonb) = 'object'
    and length(data::text) <= 262144
    and (not (data::jsonb ? 'xp') or (
      (data::jsonb ->> 'xp') ~ '^\d{1,8}$' and (data::jsonb ->> 'xp')::bigint <= 10000000
    ))
  );
create policy user_state_update_own on public.user_state for update to authenticated
  using (user_id::text = public.current_account_id())
  with check (
    user_id::text = public.current_account_id()
    and jsonb_typeof(data::jsonb) = 'object'
    and length(data::text) <= 262144
    and (not (data::jsonb ? 'xp') or (
      (data::jsonb ->> 'xp') ~ '^\d{1,8}$' and (data::jsonb ->> 'xp')::bigint <= 10000000
    ))
  );

revoke all on public.homework_submissions from anon, authenticated;
grant select on public.homework_submissions to authenticated;
grant insert (
  user_id, student_name, lesson_id, lesson_title, answers, xp_earned, submitted_at
) on public.homework_submissions to authenticated;
drop policy if exists homework_own on public.homework_submissions;
create policy homework_select_own on public.homework_submissions for select to authenticated
  using (user_id::text = public.current_account_id());
create policy homework_insert_own on public.homework_submissions for insert to authenticated
  with check (
    user_id::text = public.current_account_id()
    and xp_earned between 0 and 500
    and length(lesson_id::text) <= 64
    and length(coalesce(lesson_title::text, '')) <= 160
  );

revoke all on public.rate_limit_log from anon, authenticated;
revoke all on public.api_metrics_daily from anon, authenticated;

commit;
