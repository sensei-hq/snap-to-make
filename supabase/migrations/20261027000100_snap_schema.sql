-- Katachi Snap → Make · P1 schema (mirrors database/ddl/table/snap/*.ddl)
-- No auth in P1: RLS enabled with no policies => only service_role (server) can access.
create extension if not exists "uuid-ossp" with schema extensions;
create schema if not exists snap;
set search_path to snap, extensions;

create table if not exists snap.invites (
  id uuid primary key default uuid_generate_v4(),
  code varchar not null, label varchar,
  budget_cap_usd numeric(10,4) not null default 1,
  is_active boolean not null default true,
  modified_at timestamptz not null default now(), modified_by varchar
);
create unique index if not exists invites_ukey on snap.invites (code);
create table if not exists snap.sessions (
  id uuid primary key default uuid_generate_v4(),
  invite_code varchar not null, invite_id uuid references snap.invites(id),
  attested_18 boolean not null default false,
  status varchar not null default 'active',
  budget_spent_usd numeric(10,4) not null default 0,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '24 hours')
);
create table if not exists snap.media (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid not null references snap.sessions(id) on delete cascade,
  kind varchar not null, bucket varchar not null, storage_path varchar not null,
  mime varchar, bytes bigint,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '24 hours')
);
create index if not exists media_session_idx on snap.media(session_id);
create table if not exists snap.scenes (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid not null references snap.sessions(id) on delete cascade,
  media_id uuid references snap.media(id),
  scene_analysis jsonb not null default '{}'::jsonb,
  measure_result jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create table if not exists snap.objects (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid not null references snap.sessions(id) on delete cascade,
  scene_id uuid references snap.scenes(id),
  name varchar not null default 'Untitled',
  design_spec jsonb not null default '{}'::jsonb,
  object_spec jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists objects_session_idx on snap.objects(session_id);
create table if not exists snap.impls (
  id uuid primary key default uuid_generate_v4(),
  object_id uuid not null references snap.objects(id) on delete cascade,
  adapter_id varchar not null, device_id varchar not null, material_id varchar not null,
  thickness_mm numeric(6,2) not null default 3,
  impl_plan jsonb not null default '{}'::jsonb,
  estimate jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists impls_object_idx on snap.impls(object_id);
create table if not exists snap.trace_events (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid not null references snap.sessions(id) on delete cascade,
  model varchar not null, purpose varchar not null default '',
  latency_ms integer not null default 0,
  units jsonb not null default '{}'::jsonb,
  cost_usd numeric(10,6) not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists trace_session_idx on snap.trace_events(session_id);
create table if not exists snap.batch_jobs (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid not null references snap.sessions(id) on delete cascade,
  wonder_job_id varchar, status varchar not null default 'queued',
  input jsonb not null default '{}'::jsonb,
  production_plan jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table snap.sessions enable row level security;
alter table snap.media enable row level security;
alter table snap.scenes enable row level security;
alter table snap.objects enable row level security;
alter table snap.impls enable row level security;
alter table snap.trace_events enable row level security;
alter table snap.batch_jobs enable row level security;

-- RLS enablement mirrors database/policies/snap/*.sql (dbd policies is canonical)
-- Storage buckets (private; server-mediated in P1)
insert into storage.buckets (id, name, public) values
  ('snap-photos','snap-photos',false),('snap-art','snap-art',false),
  ('snap-previews','snap-previews',false),('snap-clips','snap-clips',false)
on conflict (id) do nothing;
