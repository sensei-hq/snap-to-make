set search_path to staging;

create table if not exists snap_sessions
(
  session_key varchar
, invite_code varchar
, attested_18 boolean default false
, status varchar default 'active'
, modified_on timestamptz default now()
, modified_by varchar default current_user
);

create unique index if not exists snap_sessions_ukey on snap_sessions (session_key);
