-- Vidas do plano grátis e "convidar e ganhar" (19/out/2026, regra do Luis).
--
-- vidas: 5 por aluno grátis; cada erro numa pergunta gasta 1; volta 1 a cada
-- 4 horas até 5. Convite aceito dá +5 (pode passar de 5, até 20) e +5 créditos
-- de IA guardados (ia_bonus), que o servidor usa quando o saldo do dia acaba.
-- convites: quem convidou quem. Um aluno só é convidado uma vez.
-- convite_codigos: o código curto do link de cada aluno.
--
-- As três tabelas são só do servidor (chave secreta): RLS ligado e nenhum
-- acesso para anon ou authenticated. As funções são security definer e só a
-- service_role executa. Roda no SQL Editor ANTES do código. Pode rodar de novo.

begin;

create table if not exists public.vidas (
  user_id        text primary key references public.accounts(id) on delete cascade,
  vidas          integer not null default 5 check (vidas between 0 and 20),
  recarga_desde  timestamptz not null default now(),
  ia_bonus       integer not null default 0 check (ia_bonus between 0 and 100),
  atualizado_em  timestamptz not null default now()
);

create table if not exists public.convite_codigos (
  user_id  text primary key references public.accounts(id) on delete cascade,
  codigo   text not null unique check (codigo ~ '^[a-z0-9]{10}$')
);

create table if not exists public.convites (
  convidado_id   text primary key references public.accounts(id) on delete cascade,
  convidante_id  text not null references public.accounts(id) on delete cascade,
  criado_em      timestamptz not null default now(),
  check (convidado_id <> convidante_id)
);
create index if not exists convites_convidante_idx on public.convites (convidante_id, criado_em desc);

alter table public.vidas enable row level security;
alter table public.convite_codigos enable row level security;
alter table public.convites enable row level security;
revoke all on public.vidas, public.convite_codigos, public.convites from anon, authenticated;

-- Estado das vidas, já com a recarga aplicada. p_gastar = 1 gasta uma vida
-- (se houver). O relógio da recarga começa quando o aluno sai do cheio.
create or replace function public.vidas_estado(
  p_user text, p_max integer, p_recarga_seg integer, p_gastar integer
)
returns table(vidas integer, proxima_em timestamptz, ia_bonus integer)
language plpgsql security definer set search_path = public, pg_temp
as $$
declare
  v_now timestamptz := clock_timestamp();
  v public.vidas%rowtype;
  v_n integer;
begin
  if p_user is null or p_max < 1 or p_max > 20 or p_recarga_seg < 60 or p_gastar not in (0, 1) then
    raise exception 'invalid parameters';
  end if;
  insert into public.vidas(user_id, vidas, recarga_desde) values (p_user, p_max, v_now)
  on conflict (user_id) do nothing;
  select * into v from public.vidas where user_id = p_user for update;

  if v.vidas < p_max then
    v_n := floor(extract(epoch from (v_now - v.recarga_desde)) / p_recarga_seg)::integer;
    if v_n > 0 then
      v.vidas := least(p_max, v.vidas + v_n);
      v.recarga_desde := case when v.vidas >= p_max then v_now
                              else v.recarga_desde + make_interval(secs => v_n * p_recarga_seg) end;
    end if;
  end if;

  if p_gastar = 1 and v.vidas > 0 then
    if v.vidas = p_max then v.recarga_desde := v_now; end if;
    v.vidas := v.vidas - 1;
  end if;

  update public.vidas
     set vidas = v.vidas, recarga_desde = v.recarga_desde, atualizado_em = v_now
   where user_id = p_user;

  vidas := v.vidas;
  proxima_em := case when v.vidas < p_max then v.recarga_desde + make_interval(secs => p_recarga_seg) end;
  ia_bonus := v.ia_bonus;
  return next;
end;
$$;

-- Gasta créditos de IA guardados (do convite) quando o saldo do dia acabou.
create or replace function public.gastar_bonus_ia(p_user text, p_peso integer)
returns boolean
language plpgsql security definer set search_path = public, pg_temp
as $$
declare v_bonus integer;
begin
  if p_peso < 1 or p_peso > 100 then raise exception 'invalid parameters'; end if;
  select ia_bonus into v_bonus from public.vidas where user_id = p_user for update;
  if v_bonus is null or v_bonus < p_peso then return false; end if;
  update public.vidas set ia_bonus = ia_bonus - p_peso, atualizado_em = clock_timestamp() where user_id = p_user;
  return true;
end;
$$;

-- Convite aceito: os dois ganham p_vidas (até 20) e p_ia créditos guardados (até 100).
-- Devolve 'ok' ou o motivo: codigo, proprio, ja_convidado, limite.
create or replace function public.premiar_convite(
  p_convidado text, p_codigo text, p_vidas integer, p_ia integer, p_limite_mes integer
)
returns text
language plpgsql security definer set search_path = public, pg_temp
as $$
declare v_convidante text; v_mes integer;
begin
  select user_id into v_convidante from public.convite_codigos where codigo = p_codigo;
  if v_convidante is null then return 'codigo'; end if;
  if v_convidante = p_convidado then return 'proprio'; end if;
  if exists (select 1 from public.convites where convidado_id = p_convidado) then return 'ja_convidado'; end if;
  perform 1 from public.accounts where id = v_convidante for update;
  select count(*) into v_mes from public.convites
   where convidante_id = v_convidante and criado_em > clock_timestamp() - interval '30 days';
  if v_mes >= p_limite_mes then return 'limite'; end if;

  insert into public.convites(convidado_id, convidante_id) values (p_convidado, v_convidante);
  insert into public.vidas(user_id) values (p_convidado), (v_convidante) on conflict (user_id) do nothing;
  update public.vidas
     set vidas = least(20, vidas + p_vidas),
         ia_bonus = least(100, ia_bonus + p_ia),
         atualizado_em = clock_timestamp()
   where user_id in (p_convidado, v_convidante);
  return 'ok';
end;
$$;

revoke all on function public.vidas_estado(text, integer, integer, integer) from public, anon, authenticated;
revoke all on function public.gastar_bonus_ia(text, integer) from public, anon, authenticated;
revoke all on function public.premiar_convite(text, text, integer, integer, integer) from public, anon, authenticated;
grant execute on function public.vidas_estado(text, integer, integer, integer) to service_role;
grant execute on function public.gastar_bonus_ia(text, integer) to service_role;
grant execute on function public.premiar_convite(text, text, integer, integer, integer) to service_role;

commit;
