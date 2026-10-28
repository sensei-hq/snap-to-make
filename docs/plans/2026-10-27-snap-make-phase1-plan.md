# Katachi — Snap → Make · Phase 1 Implementation Plan

> Status: **Executing** (started 2026-10-27). Checklist: [2026-10-27-snap-make-phase1-checklist.md](2026-10-27-snap-make-phase1-checklist.md) — every item tracked to closure there.
> Source of truth: `docs/prd/` (start `docs/prd/README.md`). Requirements cited as `R-<module>-<n>`.
> Rule: **models perceive, reason and imagine; code measures and builds geometry.** The LLM never emits raw coordinates.

## 1. Goal & deadlines

- Hero journey J1 live end-to-end; Burn Watch on a recorded clip.
- Draft submission package EOD **D7 Mon Nov 2**; **final submission EOD D8 Tue Nov 3**; Wed Nov 4 buffer only.
- Public preview URL updated every evening; each day verifiable in ~2 min (checklist §Daily verification).

## 2. Decisions (closed — see also §8)

| Decision | Choice |
|---|---|
| Scaffold | New `app/` SvelteKit app. |
| Auth | **None in P1.** Invite code + 18+ attestation (R-PL-4/5), server-checked signed cookie. Kavach + Supabase Auth in P2 (R-PL-6). |
| UI | Rokkit 1.9 components on named tokens (`@rokkit/ui`, `@rokkit/forms`, theme *zen-sumi*), UnoCSS `presetRokkit`; Katachi brand (Zen-Sumi palette, see `docs/prd/07-design-language.md`). Mock: `mockups/svelte` (local). |
| State vs presentation | **State** in `*.svelte.ts` rune classes under `src/lib/state/` — owns transitions, reactivity, async. **Presentation** in `*.svelte` under `src/lib/components/` + routes — props in, events out, no fetch, no store mutation. |
| DB | Local Supabase cluster (`supabase/` in this repo, ports 54321/54322). dbd-style DDL mirrored in `database/ddl/table/snap/*.ddl`; deployable migrations in `supabase/migrations/`. |
| Abstraction | **Object → Impl.** Object = device-agnostic (intent, mm dims, art, assembly intent). Impl = device+material+process plan (pieces, joints, layout, toolpaths, assembly steps). User picks target at "Make it with…"; switching re-plans with code only, $0. |
| Devices | Adapter pattern (`validate/plan/emit/preview/estimate`). P1 full: Laser (Longer Ray 5 10W/20W) + Simulator. P1 stub: Cricut, 3D printer (capabilities/validate/preview, emit disabled "Phase 2"). |
| Playback | Demo/playback mode on canvas: Simulate (toolpath playback, play/pause/scrub/speed) + Assembly (exploded↔assembled). No hardware needed. |
| Testing | **TDD throughout.** Vitest unit (target ≥90% lines on `src/lib/domain`, `src/lib/devices`, `src/lib/state`), Playwright e2e in `app/tests/e2e/`. No production code without a failing test first. |
| Responsive | One route tree. Phone column below `md` (1024 px); studio (nav rail + workspace + Katachi chat panel) at `md` and up, incl. tablet landscape. UnoCSS `md`/`lg` = 1024/1320 px (the mock's); no JS width checks. |
| App state | One app context created in `routes/snap/+layout.svelte`; pages read it (`useApp()`), never construct their own flow/trace state. |
| Server | SvelteKit `+server.ts` routes own `META_API_KEY`. Routes: `/api/scene|design|art|preview|watch|batch`, `/ws/voice` relay. Budget guard $1/session, $10/day + kill switch (R-PL-2). |

## 3. Architecture

```
Photo+voice → SceneAnalysis/MeasureResult (Spark+SAM; code measures)
  → DesignSpec (Spark strict JSON) → ObjectSpec (deterministic, canonical)
  → [user picks target] → DeviceAdapter.plan() → ImplPlan (pieces/layout/toolpaths)
  → emit() files (G-code/SVG/ZIP/STL-later) · preview() playback timeline
app/src/lib/
  domain/    pure TS: schemas (zod), Object/Impl types, measurement math, geometry, templates, nesting
  devices/   adapter interface + registry; laser/, simulator/, cricut-stub/, printer3d-stub/
  state/     *.svelte.ts rune state classes (session, conversation, design, playback, trace)
  components/ pure presentation (Rokkit) — props/events only
  server/    Meta clients, vision (scale/contour/potrace), guard, trace ledger (server-only)
app/src/routes/  /snap/+layout (shell: phone bar+tabs < md · rail+chat ≥ md)
                 /snap (Workshop) · capture · scene · plan · art · preview · canvas · watch · hood · batch · convert
                 /snap/layers/{source…cut, views, reference} (Stage 14) · /snap/welcome (gate) · api/*
```

DB (schema `snap`, §5 of checklist): `sessions, media, scenes, objects, impls, trace_events, batch_jobs`. RLS enabled, no policies in P1 (server service-role only; browser never talks to Supabase directly).

## 4. Daily targets

D0 orientation+truth · D1 spikes+skeleton · D2 Object→Impl foundation + DB · D3 UI flow I + Impl picker + playback v1 · D4 UI flow II (freeze) · D5 Burn Watch + gate + hardening · D6 polish + eval + first real burn · D7 film + draft package · D8 final submit · D9 buffer. Full table with daily verify steps in the checklist.

## 4a. UI parity with the mockups (Stages 12–15)

Gaps are tracked in `docs/design/06-ui-gap-analysis.md`. Order: **12** app shell + shared state + responsive → **13** Snap → Make stage routes → **14** image → layers flow (needs `docs/design/04-gap-analysis.md` #1–7) → **15** desktop editor (stretch). Mock images under `mockups/svelte/static/layers` are third-party derived and are never shipped.

## 5. Cut order (if behind)

Glimmer → live Burn Watch (keep recorded) → share card/preview refinement → stand/sign templates → Wonder batch → stub-adapter preview richness. Cut first within the UI stages: rail screens (15) → six-view and reference branches (14) → desktop editor (15). Never cut: responsive shell (12), hero chain, Object→Impl interface, Laser+Simulator adapters, playback, trace/budget guard.

## 6. Risks (top)

1. SAM measurement accuracy (±5% gate on D1 spike). 2. Object→Impl leak (templates emitting device geometry — blocked by contract tests). 3. Rokkit gaps vs the specced screens (D1 audit; build missing primitives in Rokkit style).
