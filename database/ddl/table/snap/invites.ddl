set search_path to snap, extensions;

create table if not exists invites (
  id uuid primary key default uuid_generate_v4()
, code varchar not null
, label varchar
, budget_cap_usd numeric(10,4) not null default 1
, is_active boolean not null default true
, modified_at timestamptz not null default now()
, modified_by varchar
);

create unique index if not exists invites_ukey on invites (code);
