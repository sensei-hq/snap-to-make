# Snap → Make · Implementation Roadmap (unattended stages)

Plan: [../plans/2026-10-27-snap-make-phase1-plan.md](../plans/2026-10-27-snap-make-phase1-plan.md) · Checklist: [../plans/2026-10-27-snap-make-phase1-checklist.md](../plans/2026-10-27-snap-make-phase1-checklist.md) · PRD: `docs/prd/`

## Standard commands (app/package.json — always use these, no ad-hoc runners)

| Gate | Command |
|---|---|
| Arch + lint + typecheck + unit + coverage | `bun run verify` |
| Everything incl. build + browser | `bun run verify:full` |
| Unit only / watch | `bun run test:unit` / `bun run test:unit:watch` |
| Coverage only | `bun run test:coverage` (90% line gate on domain/devices/state) |
| Lint / fix / format | `bun run lint` / `bun run lint:fix` / `bun run format:check` |
| Typecheck | `bun run check` |
| E2E (Playwright) | `bun run test:e2e` (UI: `test:e2e:ui`) |
| DB validate / deploy / import | `bun run db:inspect` / `bun run db:deploy` / `bun run db:import` |

## How to run these stages unattended

1. Execute stages **in order**. A stage is done only when its *Exit criteria* all pass with evidence (command output, test run, or live-URL check recorded in the checklist).
2. **Handoff gates stop the run.** Stages marked `HANDOFF` end with a user verification (live URL, physical object, submission receipt). Do not cross a handoff gate unattended — finish everything up to it, update the checklist, refresh `docs/CHECKPOINT.md`, and stop.
3. **TDD, always.** For every behaviour: write the failing test, run it red, implement, run it green, then run the stage gate. No production code before a failing test in the same stage.
4. Coverage gates: `domain/`, `devices/`, `state/` ≥ 90% lines (Vitest coverage). E2E: Playwright green before any handoff.
5. dbd workflow (pre-release — `project.released` unset, no `snapshots/`): **edit DDL → `dbd inspect --scope snap` → `dbd reconcile -d $DATABASE_URL` (local only)**. Never hand-write SQL migrations against the design, never `reconcile` after `dbd release`, never use `supabase/seed.sql` for seeding (see Stage 00).
6. Update the checklist in the same commit as the work. Commit per stage slice; run `/sensei:checkpoint` + refresh `docs/CHECKPOINT.md` after each commit.
7. Blocked means stop-and-report with the exact error, not a workaround that changes scope. Cut order lives in the plan §5.

## Stages

| Stage | File | Gate |
|---|---|---|
| 00 DB foundation (dbd + local Supabase + file import seeding) | [00-db-foundation.md](00-db-foundation.md) | HANDOFF: DB up + seeded demo invite |
| 01 App scaffold (Dojo fork, Rokkit, PWA, no Kavach) | [01-app-scaffold.md](01-app-scaffold.md) | AUTO |
| 02 Domain: schemas, measurement, geometry (Object) | [02-domain-object.md](02-domain-object.md) | AUTO |
| 03 Device adapters: Laser + Simulator + stubs (Impl) | [03-device-adapters.md](03-device-adapters.md) | HANDOFF: device-switch re-plan |
| 04 State layer + presentation shell (Workshop) | [04-state-presentation.md](04-state-presentation.md) | AUTO |
| 05 Meta server routes + guard + trace | [05-meta-server.md](05-meta-server.md) | AUTO (needs `META_API_KEY`) |
| 06 UI flow I: voice → measure → Object → Impl picker | [06-ui-flow-1.md](06-ui-flow-1.md) | HANDOFF: voice-to-plan on live URL |
| 07 Playback: fabrication simulation + assembly | [07-playback.md](07-playback.md) | HANDOFF: simulate with no device |
| 08 UI flow II: art, preview, canvas, Make, Under-the-hood | [08-ui-flow-2.md](08-ui-flow-2.md) | HANDOFF: full hero + feature freeze |
| 09 Burn Watch, gate, hardening, Wonder batch (P1+) | [09-watch-hardening.md](09-watch-hardening.md) | AUTO |
| 10 E2E, eval, deploy, submission package | [10-e2e-submission.md](10-e2e-submission.md) | HANDOFF: draft package (D7) → final submit (D8) |
