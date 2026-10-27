# Stage 00 — DB foundation (dbd + local Supabase + file-import seeding) · HANDOFF

Prereqs: `dbd` 0.27+, `supabase` CLI, Docker running. PRD: R-PL-2/4/5, `docs/prd/05-architecture.md` §5.3.

## Source-of-truth rules (dbd skill — do not deviate)

- Files are truth: `database/ddl/<type>/<schema>/<name>.ddl`, **one table per file**, singular type folders. Snap tables live in `database/ddl/table/snap/` (8 files: sessions, media, scenes, objects, impls, trace_events, batch_jobs, invites).
- RLS does **not** live in table DDL (dbd does not read `ENABLE ROW LEVEL SECURITY` there). RLS lives in `database/policies/snap/<table>.sql` (one file per table), applied via `dbd policies` / `dbd apply --with-policies`. P1: RLS on, no policies (service-role only).
- **Seeding is file import, never `supabase/seed.sql`** (that file is an intentional no-op pointer). Flow: `database/import/staging/<table>.csv` → staging table (`database/ddl/table/staging/<name>.ddl`) → `database/ddl/procedure/staging/import_<name>.ddl` (idempotent upsert on natural keys, joins on names/codes) → `database/import/loader.sql` calls in dependency order → registered in `design.yaml: import.tables`, run by `dbd import`.
- Pre-release workflow: project has no `project.released`, no `database/snapshots/`. Change schema = edit DDL → `dbd inspect --scope snap` → `dbd reconcile -d $DATABASE_URL`. Do NOT hand-edit `supabase/migrations/*` as the design path; the committed Supabase migration only mirrors the DDL for `supabase start` bootstrapping and must be regenerated/kept in sync when DDL changes.
- Secrets via `$ENV_VAR` in `design.yaml` (`target.postgres.url: $DATABASE_URL`). Local Supabase DB URL: `postgresql://postgres:postgres@127.0.0.1:54322/postgres`.

## Tasks (in order)

1. [x] Snap + invites DDL (one file/table), staging tables + CSVs (`snap_invites`, `snap_sessions`), import procedures, loader calls, `design.yaml` (snap schema + `snap` scope + import tables), policies per table.
2. TDD: write failing Vitest DB test `app/src/lib/server/db.spec.ts` (or `tests/db/`): session→object→impl→trace insert round-trip + seeded invite `DEMO-JUDGES` exists. Run red (no DB yet).
3. Boot local cluster: `supabase start` (in repo root; config `supabase/config.toml`, project `burn-e-snap`, API 54321 / DB 54322 / Studio 54323). If ports clash, report and stop (preflight: `lsof -i :54322`, `df -h`).
4. **Deploy (canonical path): from `database/`, `dbd deploy -d $DATABASE_URL -e dev --scope snap`** — one command: apply DDL scripts + run file imports (`import/loader.sql` → `import_*` procedures) + apply RLS policies. Local URL: `postgresql://postgres:postgres@127.0.0.1:56332/postgres` (burn-e cluster; 54322 is the Sensei stack — do not touch it). Verify `\dt snap.*` lists 8 tables and `snap.invites` has DEMO-JUDGES/DEMO-LOCAL. Re-run deploy/import — idempotent (counts unchanged). The `supabase/migrations/*` file only mirrors DDL for Supabase bootstrap; `dbd deploy` is the deploy of record.
6. Run DB test green. Record outputs in checklist §1.

## Lint scope

- Snap files must contribute **zero** `dbd inspect` errors/warnings.
- Format only files this stage touches.

## Exit criteria

- `dbd inspect --scope snap`: no snap-attributed errors/warnings.
- Local Supabase up; 8 `snap.*` tables + 4 storage buckets present; seeded invites queryable.
- DB round-trip test green; import re-run idempotent.

## HANDOFF — user verifies (~2 min)

Run `supabase status`, open Studio (54323) → schema `snap` → `invites` shows DEMO-JUDGES. Then say `go` for Stage 01.
