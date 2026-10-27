set search_path to snap, extensions;
create table if not exists media (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid not null references sessions(id) on delete cascade,
  kind varchar not null,
  bucket varchar not null,
  storage_path varchar not null,
  mime varchar,
  bytes bigint,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '24 hours')
);
create index if not exists media_session_idx on media(session_id);