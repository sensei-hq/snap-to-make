set search_path to staging;

create or replace procedure import_snap_sessions()
language plpgsql
as
$$
begin
  -- Demo/playback session only. Runtime sessions are created by the server, never seeded.
  insert into snap.sessions(id, invite_code, invite_id, attested_18, status)
  select uuid_generate_v4(), trim(stg.invite_code), inv.id, coalesce(stg.attested_18, false),
         coalesce(trim(stg.status), 'active')
    from staging.snap_sessions stg
    join snap.invites inv on inv.code = trim(stg.invite_code)
   where not exists (select 1 from snap.sessions s where s.invite_code = trim(stg.invite_code) and s.status = 'active');
end;
$$
