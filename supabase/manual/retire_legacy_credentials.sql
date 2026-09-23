-- Apply only after every migrated account has an auth_user_id and reset delivery
-- has been reconciled. This migration is intentionally destructive.
begin;

do $$
begin
  if exists (
    select 1 from public.accounts
    where auth_user_id is null
  ) then
    raise exception 'legacy credentials cannot be retired: unmigrated accounts remain';
  end if;
end
$$;

drop table if exists public.magic_link_tokens;
alter table if exists public.accounts drop column if exists password;

commit;
