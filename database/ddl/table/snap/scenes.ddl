set search_path to snap, extensions;
create table if not exists scenes (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid not null references sessions(id) on delete cascade,
  media_id uuid references media(id),
  scene_analysis jsonb not null default '{}'::jsonb,
  measure_result jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);