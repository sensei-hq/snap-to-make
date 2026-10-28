# Stage 08 — UI flow II: art, preview, canvas, Make, Under-the-hood · HANDOFF (feature freeze)

Prereqs: Stage 07. PRD: R-AR-1..3/6, R-DS-6, R-MK-1..4, R-UT-1..3, screens S4/S5/S6/S9.

## Build

- Art picker (S4): Muse Image edit `n=3` on SAM-cropped sketch (web-search/shell disabled), tiles on birch preview, re-roll, "Use original" fallback; traces via Stage 02/05 vision → engrave paths.
- Preview (S5): Responses ordered captioned refs [art, material swatch, scene photo], "AI preview" badge, blur→sharp develop, re-roll via `previous_response_id`, refinements ("darker engraving") P1 if cheap else P1+ note.
- Canvas (S6): Plan→canvas morph, progressive panel reveal, Katachi dock + suggestion strip, voice edits (`resize_part/set_param/add_engrave/remove_part/duplicate/rotate/change_material` incl. "make it for the Cricut instead" → re-plan, $0), drag-resize syncs Object.
- Make bar: adapter `validate()` preflight (bed fit, closed paths, min feature, est time) narrated; downloads from selected adapter (`.gcode`/SVG/`.burn` ZIP); stubs show Phase 2.
- Under-the-hood (S9): drawer timeline from `trace` state (model chip colours per design language, latency bar, cost), session pill, Export JSON.

## TDD / verification

- Component + state tests for art selection, preview re-roll, voice-edit mapping (utterance fixtures → canvas ops), Make preflight messages.
- Playwright `hero.spec.ts` completes: voice-stub→photo→measure→Object→Impl→art→preview→simulate→download (assert `.gcode` download, trace ≥5 models, ≈$ total). API mocked by default; live mode behind env flag.

## Exit criteria

- All tests green; **FEATURE FREEZE for P1 at end of this stage** (later stages fix/polish only).

## HANDOFF — user verifies full hero on live URL (~3 min) + freeze confirmation. Say `go` for Stage 09.
