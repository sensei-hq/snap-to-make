set search_path to snap, extensions;
create table if not exists impls (
  id uuid primary key default uuid_generate_v4(),
  object_id uuid not null references objects(id) on delete cascade,
  adapter_id varchar not null,
  device_id varchar not null,
  material_id varchar not null,
  thickness_mm numeric(6,2) not null default 3,
  impl_plan jsonb not null default '{}'::jsonb,
  estimate jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists impls_object_idx on impls(object_id);