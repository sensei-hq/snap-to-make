set search_path to snap, extensions;
create table if not exists trace_events (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid not null references sessions(id) on delete cascade,
  model varchar not null,
  purpose varchar not null default '',
  latency_ms integer not null default 0,
  units jsonb not null default '{}'::jsonb,
  cost_usd numeric(10,6) not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists trace_session_idx on trace_events(session_id);