# Stage 06 — UI flow I: voice → measure → Object → Impl picker · HANDOFF

Prereqs: Stages 04+05. PRD: R-CV-1..6, R-SN-1..4, R-UN-5/6, R-DS-7, screens S1/S2/S3/S10 (`docs/prd/06-screens.md`), mock `docs/mockups/Katachi.html`.

## Build (components props-only; all flow in state classes)

- `/snap/welcome` (S10): invite + 18+ + safety/media notice → session cookie.
- Workshop (S1): push-to-talk (AudioWorklet PCM 24kHz → `/ws/voice`), live partial captions, final transcript → orchestrator; text input always visible; Web Speech TTS toggle (default on); suggestion chips.
- Capture: 1–4 photos (camera/file/drag-drop), client downsize ≤2048px + EXIF strip, tips overlay.
- Scene card + Measure overlay (S2): SAM masks burn-in (600ms, role colours art=blue/fit=red/ref=amber), dimension callouts editable on tap, confidence dot, "Looks right / Fix a number".
- Object card → **"Make it with…"** picker (device+material+thickness; default Ray5+birch 3mm; session-remembered) → Impl Plan card (S3): exploded SVG from assembly intent rendered per-Impl, parts table, assumptions with edit pencils, sheet-fit meter.

## TDD / verification

- Component tests per card (props→render, edit events). State tests already cover flow (Stage 04) — add integration test: transcript fixture + photo fixture (mocked `/api/scene`) drives Workshop→Measured→ImplPlan in jsdom.
- Playwright: extend `tests/e2e/hero.spec.ts` up to Impl Plan (mocked API via route interception). Full live journey is Stage 08/10.

## Exit criteria

- Unit/integration green; Playwright partial-hero green.

## HANDOFF — user verifies on live preview URL (~2 min)

Say "make four coasters 3mm birch" (or type it), add the sample photo, see `Ø 82mm ±2`, tap-edit a number, pick Ray 5 + birch, see the Impl Plan. Say `go` for Stage 07.
