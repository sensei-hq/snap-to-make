set search_path to snap, extensions;
create table if not exists objects (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid not null references sessions(id) on delete cascade,
  scene_id uuid references scenes(id),
  name varchar not null default 'Untitled',
  design_spec jsonb not null default '{}'::jsonb,
  object_spec jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists objects_session_idx on objects(session_id);