# Snap → Make Phase 1 — Checklist (tracked to closure)

Plan: [2026-10-27-snap-make-phase1-plan.md](2026-10-27-snap-make-phase1-plan.md)
Legend: `[ ]` todo · `[~]` in progress · `[x]` done (with evidence) · `[!]` blocked (reason noted)
Rule: an item closes only with evidence (test run, URL check, file). Update this file in the same commit as the work.

## 0. Tracking & docs
- [x] Plan written (`docs/plans/2026-10-27-snap-make-phase1-plan.md`)
- [x] This checklist created; todo list mirrored in session tracker
- [ ] `docs/CHECKPOINT.md` refreshed after each commit (<40 lines, per CLAUDE.md)

## 1. DB structure (FIRST — local Supabase cluster) · detail: `docs/roadmap/00-db-foundation.md`
> Seeding = dbd file import (CSV → staging → `import_*` procedures → loader), NOT `supabase/seed.sql`. RLS in `database/policies/snap/*.sql`, one file per table.
- [x] dbd DDL: `database/ddl/table/snap/*.ddl` (7 tables, schema `snap`)
- [x] Migration: `supabase/migrations/20261027000100_snap_schema.sql`
- [x] Local cluster config: `supabase/config.toml` (project `katachi-snap`, API 54321, DB 54322)
- [x] Storage buckets in migration: `snap-photos`, `snap-art`, `snap-previews`, `snap-clips` (private, 24h TTL via `expires_at` on `snap.media`)
- [x] Roadmap stage specs: `docs/roadmap/README.md` + stages 00–10 (unattended until HANDOFF gates)
- [x] Seeding corrected to file import: `snap_invites`/`snap_sessions` staging+CSV+procedures+loader; `supabase/seed.sql` is a no-op pointer
- [x] Deployed via `dbd deploy -d $DATABASE_URL -e dev --scope snap` from `database/`: 56 entities applied, 8 snap tables, snap invites seeded (DEMO-JUDGES/DEMO-LOCAL), demo session, round-trip session→object→impl→trace verified by psql counts
- [x] Seed via `dbd import`: DEMO-JUDGES/DEMO-LOCAL present; re-run idempotent (counts unchanged)
- [x] DB contract tests (Vitest `test:db`: one DDL+policy file per table, CSV seeding) + live psql round-trip verified

## 2. App scaffold (no Kavach)
- [~] `app/package.json` (SvelteKit 2, Svelte 5, Rokkit 1.9, UnoCSS, Vitest, Playwright) — no `@kavach/*`
- [ ] `svelte.config.js`, `vite.config.ts` (no kavach plugin), `uno.config.js`, `rokkit.config.js` (Zen-Sumi tokens)
- [ ] `src/app.html` (PWA manifest + theme-color), `src/app.css`, `src/service-worker.ts` (app-shell cache)
- [ ] `static/manifest.webmanifest` + icons
- [ ] `.env.example` (PUBLIC_SUPABASE_URL/ANON_KEY, server-only SUPABASE_SERVICE_ROLE_KEY, META_API_KEY)
- [ ] `bun install && bun run dev` serves Workshop shell; `bun run check` clean
- [ ] Rokkit audit: Btn/Chip/Banner/Card/Dialog/Sheet/Tabs/Progress equivalents listed; gaps filed as components

## 3. Domain: schemas + Object→Impl (TDD)
- [ ] Failing tests first: measurement math (card px/mm, circle minor-axis, ±5% fixtures)
- [ ] `domain/schemas.ts` — zod strict `SceneAnalysis`, `DesignSpec`, `BurnEvents` (+ JSON Schema export)
- [ ] `domain/object.ts` — `ObjectSpec` types; templates coaster/finger_box_open/ornament emit **no device geometry** (contract test)
- [ ] `domain/geometry.ts` — DesignSpec→ObjectSpec, kerf/clearance, finger-joint intent→per-Impl rendering hook
- [ ] `domain/nesting.ts` — shelf packer, 3mm spacing, overflow→new sheet
- [ ] `domain/measure.ts` — scale from reference mask, target dims, confidence
- [ ] Coverage ≥90% lines on `domain/` (`bun run test:coverage`)

## 4. Device adapters (TDD)
- [ ] `devices/types.ts` — `DeviceAdapter` interface + abstract ops (`cut-through` etc.) + registry
- [ ] Adapter contract test suite (plan covers all parts; validate flags oversize; preview≈estimate; re-plan $0 model calls)
- [ ] `devices/laser.ts` — full: presets, nesting, engrave-before-cut, G-code, SVG, ZIP emit
- [ ] `devices/simulator.ts` — playback timeline from any ImplPlan (ordered ops, durations from feed rates)
- [ ] `devices/cricut.ts`, `devices/printer3d.ts` — stubs: capabilities/validate/preview; emit throws `Phase2Error`, UI-labelled
- [ ] Re-plan test: one Object → laser Impl (finger walls) vs Cricut Impl (folded blank); Object unchanged

## 5. State vs presentation separation
- [ ] `state/session.svelte.ts`, `state/conversation.svelte.ts`, `state/design.svelte.ts` (Object+selected Impl), `state/playback.svelte.ts`, `state/trace.svelte.ts` — rune classes, unit-tested transitions
- [ ] Components take props/fire events only; grep gate: no `fetch(` / `$state` mutation of parent in `components/`
- [ ] Presentation snapshot tests for key components (Workshop, PlanCard, SimulateView)

## 6. Meta server routes (TDD)
- [ ] `server/meta/*` clients (Spark, SAM, Image, Voice relay, Wonder) behind `META_API_KEY`
- [ ] `server/guard.ts` — invite+18+ cookie, budget caps, kill switch, rate limit (unit tests)
- [ ] `server/trace.ts` — ledger → `snap.trace_events`; cost pill totals match (test)
- [ ] Routes: `/api/scene`, `/api/design`, `/api/art`, `/api/preview`, `/api/watch`, `/api/batch`, `/ws/voice`
- [ ] Fallbacks per PRD 04 §4.4 (no-reference ask, SAM-empty bbox crop, Image policy skip, 429 backoff)

## 7. Snap UI (screens S1–S10)
- [ ] S10 `/snap/welcome` gate · S1 Workshop (voice push-to-talk, captions, text fallback) R-CV-1..6
- [ ] S2 Scene+Measure overlay (burn-in masks, editable callouts) R-UN-5/6
- [ ] Object card → "Make it with…" picker → Impl Plan card (exploded SVG, assumptions) R-DS-7
- [ ] S4 Art picker (n=3) R-AR-1/2/6 · S5 Preview (ordered refs, re-roll) R-AR-3
- [ ] S6 Canvas: Design/Simulate/Export toggle, voice edits R-DS-6, Make bar (preflight+downloads) R-MK-1..4
- [ ] Playback: SimulateView (play/pause/scrub/1x/4x/16x, op labels, time sync) + AssemblyPlayer (exploded↔assembled)
- [ ] S7 Burn Watch recorded (timeline events) R-BW-1/3 · S9 Under-the-hood drawer + cost pill R-UT-1..3
- [ ] S8 Wonder batch (P1+, cut-first) R-WB-1..4

## 8. E2E (Playwright) — `app/tests/e2e/`
- [ ] Config: `playwright.config.ts` (webServer `bun run dev`, local Supabase, trace on failure)
- [ ] `hero.spec.ts` — voice-stub→photo→measure→Object→Impl→art→preview→simulate→download G-code; trace shows ≥5 models
- [ ] `playback.spec.ts` — Simulate without device: play advances op label, scrub seeks, assembly slider assembles
- [ ] `impl-switch.spec.ts` — switch Laser→Cricut re-plans (piece list changes), no new trace cost
- [ ] `gate-and-guard.spec.ts` — wrong invite blocked; budget cap friendly-stop; kill switch
- [ ] `watch.spec.ts` — upload clip → event timeline markers render
- [ ] E2E green in CI command: `bun run test:e2e`

## 9. Daily verification (you, ~2 min on live preview URL)
- [ ] D1 Workshop shell + spike curl Ø within ±5% · D2 device-switch re-plan + G-code dims
- [ ] D3 voice→measure→Simulate · D4 full hero + trace $ · D5 watch/gate/guard · D6 sim vs real burn
- [ ] D7 draft video + all submission links (clean browser) · D8 receipt + submitted URL · D9 smoke only

## 10. Submission
- [ ] Eval table (10 samples) · trace export JSON · demo video ≤3min · deck 10 · white paper 6–8pp · README+arch diagram
- [ ] Draft package EOD D7 · **Final submit EOD D8** · D9 buffer

## 11. Convert pipeline (Stage 11)
- [x] Sample set git-ignored (now `samples/`); 33 samples classified live (Spark vision) -> `samples/manifest.local.json`: 32/33 convertible (14 layered, 15 composite-3d, 3 pattern-shape; 1 mug correctly rejected)
- [x] Domain convert + shrink scaling (design = final / ratio, calibrated) + build breakdown (pieces cut->final, materials, tools, assembly)
- [x] Shrink adapter registered (plan/validate/preview; emit Phase 2 labelled)
- [x] /api/convert live vision verified on coffin.jpg with user comment (variations honour the comment)
- [x] /snap/convert UI: drop/import + camera, description+comment, group select, variations -> agree -> breakdown; e2e 9/9; deployed

## 12. App shell: shared state + responsive (Stage 12) · `docs/roadmap/12-app-shell-responsive.md`
- [x] UnoCSS breakpoints md 1024 / lg 1320
- [x] `AppState` context in `routes/snap/+layout.svelte`; pages use `useApp()` (arch check: no `new …State(` in routes)
- [x] Phone shell < md: app bar (mark, title, cost pill → hood, theme), section tabs, docked composer
- [x] Studio shell ≥ md: nav rail, workspace, Katachi chat panel (collapsible)
- [x] Page titles "Katachi · …"; `/` → gate
- [x] e2e `responsive.spec.ts` (390×844 and 1280×800) green; phone + studio screenshots checked. Found and fixed: Rokkit Button links render `target="_self"`, which SvelteKit treats as external (full reload) — every Button link passes `target=""` (arch-checked)

## 13. Snap → Make stage routes (Stage 13)
- [x] scene · plan · art · preview routes; canvas from the design (nested real pieces)
- [x] hood route (cost pill), capture source modes (Upload → Convert; 6 views / Reference disabled until Stage 14), suggestion chips → camera
- [x] `deriveCoasterSet()` from the measured mug; editable measurements; lid; composer edits (`walls N mm taller`); watch selection + acknowledge
- [x] Hero e2e on phone + studio viewports (24/24 e2e)
- [ ] User verifies the hero on the live URL (HANDOFF)

## 14. Image → layers UI (Stage 14)
- [x] `LayerFlowState` + `content/layers.ts`; 7 steps + views/reference branches
- [x] Phone steps < md, art + controls grid ≥ md; app-drawn fixture (code-drawn 'Mountain sunset'), no mock images or their colour-grade data
- [ ] Live layered sample once doc 04 #1–7 land (HANDOFF) — UI runs on the fixture until `/api/segment` + `/api/layers` return masks

## 15. Desktop editor + rail screens (Stage 15, stretch)
- [x] Editor state + toolbar, zoomable grid canvas, Properties/Layers/Job panel (one right panel at a time with the chat)
- [ ] Chat action cards that patch the editor (mock `applyAct`) and rulers — not built
- [x] Rail screens: materials (presets table), settings (devices, density, theme), annotations
- [ ] Projects screen — needs Supabase auth + saved projects (P2)
