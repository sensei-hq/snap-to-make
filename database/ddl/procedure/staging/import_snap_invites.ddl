set search_path to staging;

create or replace procedure import_snap_invites()
language plpgsql
as
$$
begin
  insert into snap.invites(code, label, budget_cap_usd, is_active, modified_at, modified_by)
  select trim(stg.code), trim(stg.label), coalesce(stg.budget_cap_usd, 1), coalesce(stg.is_active, true),
         coalesce(stg.modified_on, now()), stg.modified_by
    from staging.snap_invites stg
   where trim(coalesce(stg.code,'')) <> ''
  on conflict(code)
  do update set label = excluded.label, budget_cap_usd = excluded.budget_cap_usd,
                is_active = excluded.is_active, modified_by = excluded.modified_by,
                modified_at = excluded.modified_at;
end;
$$
