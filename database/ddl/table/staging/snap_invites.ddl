set search_path to staging;

create table if not exists snap_invites
(
  code varchar
, label varchar
, budget_cap_usd numeric(10,4) default 1
, is_active boolean default true
, modified_on timestamptz default now()
, modified_by varchar default current_user
);

create unique index if not exists snap_invites_ukey on snap_invites (code);
