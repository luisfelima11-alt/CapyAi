-- Créditos de IA do plano grátis (19/out/2026).
--
-- O grátis passa a ter um saldo único de IA por dia, em vez de um limite por
-- função. Cada uso gasta um peso (chat 1, quiz 2, história 3...). A
-- consume_rate_limit soma sempre 1; esta variante soma o peso e, quando não
-- cabe, recusa SEM gastar: o aluno com 2 créditos que pede uma história (3)
-- continua com os 2 para um chat.
--
-- Usa a mesma tabela rate_limit_buckets. Só o servidor (service_role) chama.
-- Roda no SQL Editor ANTES do código. Pode rodar de novo sem efeito.

create or replace function public.consume_rate_limit_peso(
  p_bucket text,
  p_limit integer,
  p_window_seconds integer,
  p_peso integer
)
returns table(allowed boolean, used integer, retry_after integer)
language plpgsql security definer set search_path = public, pg_temp
as $$
declare
  v_now timestamptz := clock_timestamp();
  v_started timestamptz;
  v_used integer;
begin
  if p_bucket is null or length(p_bucket) > 512 or p_limit < 1
     or p_window_seconds < 1 or p_window_seconds > 604800
     or p_peso < 1 or p_peso > 100 then
    raise exception 'invalid rate limit parameters';
  end if;

  insert into public.rate_limit_buckets(bucket, window_started_at, used)
  values (p_bucket, v_now, 0)
  on conflict (bucket) do nothing;

  -- Linha travada: dois pedidos ao mesmo tempo não gastam o mesmo saldo.
  select b.window_started_at, b.used into v_started, v_used
    from public.rate_limit_buckets b where b.bucket = p_bucket for update;

  if v_started <= v_now - make_interval(secs => p_window_seconds) then
    v_started := v_now;
    v_used := 0;
  end if;

  allowed := v_used + p_peso <= p_limit;
  if allowed then
    v_used := v_used + p_peso;
  end if;

  update public.rate_limit_buckets
     set window_started_at = v_started, used = v_used
   where bucket = p_bucket;

  used := v_used;
  retry_after := greatest(1, ceil(extract(epoch from
    (v_started + make_interval(secs => p_window_seconds) - v_now)))::integer);
  return next;
end;
$$;

revoke all on function public.consume_rate_limit_peso(text, integer, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_rate_limit_peso(text, integer, integer, integer) to service_role;
