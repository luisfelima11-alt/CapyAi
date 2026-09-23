begin;

alter table public.webhook_events add column if not exists event_type text;

create or replace function public.claim_webhook_event(p_provider text, p_event_id text, p_event_type text)
returns table(claimed boolean)
language plpgsql security definer set search_path = public, pg_temp
as $$
declare v_claimed boolean := false;
begin
  insert into public.webhook_events(provider, event_id, event_type, status)
  values (left(p_provider, 40), left(p_event_id, 200), left(p_event_type, 120), 'processing')
  on conflict (provider, event_id) do update
    set status = 'processing', received_at = now(), event_type = excluded.event_type
    where public.webhook_events.status = 'failed'
  returning true into v_claimed;
  claimed := coalesce(v_claimed, false);
  return next;
end;
$$;

revoke all on function public.claim_webhook_event(text, text, text) from public, anon, authenticated;
grant execute on function public.claim_webhook_event(text, text, text) to service_role;

commit;
