set search_path to snap, extensions;
create table if not exists sessions (
  id uuid primary key default uuid_generate_v4(),
  invite_code varchar not null,
  invite_id uuid references invites(id),
  attested_18 boolean not null default false,
  status varchar not null default 'active',
  budget_spent_usd numeric(10,4) not null default 0,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '24 hours')
);
comment on table sessions is 'P1 invite-gated demo sessions (no auth; Kavach in P2).';