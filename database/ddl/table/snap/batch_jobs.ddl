set search_path to snap, extensions;
create table if not exists batch_jobs (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid not null references sessions(id) on delete cascade,
  wonder_job_id varchar,
  status varchar not null default 'queued',
  input jsonb not null default '{}'::jsonb,
  production_plan jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);