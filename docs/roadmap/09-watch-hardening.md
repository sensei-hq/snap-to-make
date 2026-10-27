# Stage 09 — Burn Watch, hardening, Wonder batch (P1+) · AUTO

Prereqs: Stage 08 freeze. PRD: R-BW-1/3, R-PL-3/7, R-WB-1..4 (P1+), R-GL (cut-first).

## Build (in cut order — drop from the bottom if behind)

1. Burn Watch recorded (S7): upload clip ≤60s → SAM video tracking + Spark `BurnEvents` → `WatchView` timeline (flare/smoke/shift/incomplete/ok markers), thumbnails, advisory-only banner + first-use safety disclaimer. Live 2s-frame mode only if recorded is solid (else recorded-only, per cut order).
2. Hardening: degraded modes (PRD 04 §4.4) wired in UI, empty/error states, EXIF/TTL cleanup job note, rate-limit UX ("Burn-E is thinking…"), kill-switch + budget re-test on public URL.
3. Wonder batch (S8, P1+): background job (`muse-wonder-1.0`, tools generate_variant/nest/estimate_burn_time/web_search/write_report), `snap.batch_jobs` polling UI, production plan (sheets/order/time/materials $). Never on interactive path.
4. Glimmer offline (P1+, first to cut): localhost OpenAI-compatible endpoint for canvas commands; "needs internet" badges.

## TDD / verification

- Watch route tests with mocked SAM/Spark on a fixture clip → event timeline shape; Playwright `watch.spec.ts` (markers render).
- Guard regression: invite/budget/kill-switch Playwright `gate-and-guard.spec.ts`.
- Batch job state-machine tests (queued→running→done/failed) with mocked Wonder.

## Exit criteria

- Tests green; watch + gate e2e green. Proceed unattended to Stage 10 (stop at its D7 handoff).
