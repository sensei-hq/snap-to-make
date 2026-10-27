# Stage 03 — Device adapters (Impl layer) · HANDOFF

Prereqs: Stage 02. PRD: R-DS-3..5, R-MK-1..4. Core idea (user-confirmed): **Object → Impl**; Impl differs per object×device; user selection generates pieces + assembly.

## Files (`app/src/lib/devices/`)

- `types.ts` — abstract ops (`cut-through|engrave-surface|score-crease|draw-line|extrude-solid`); `DeviceAdapter { id, kind, capabilities, validate(obj,target), plan(obj,target): ImplPlan, emit(plan): Artifact[], preview(plan): PlaybackTimeline, estimate(plan) }`; `Target { adapterId, deviceId, materialId, thickness_mm }`; registry.
- `laser.ts` — FULL. Longer Ray 5 10W/20W (device + material presets as data): kerf 0.1mm, finger-joint geometry rendered here (not in templates), engrave-before-cut ordering, nesting via Stage 02 packer, emits G-code (written in this adapter; `.burn` is an internal laser artifact), SVG (red cut/blue engrave), `.burn`+ZIP.
- `simulator.ts` — wraps any adapter's `ImplPlan` → ordered playback timeline (durations from feed rates/path lengths). No emit.
- `cricut.ts` / `printer3d.ts` — STUBS: real `capabilities/validate/preview` (Cricut: folded-blank decomposition, 12" mat; Printer: extruded-part layout on build plate), `emit()` throws `Phase2Error`. UI must label "Phase 2".

## TDD sequence

1. Adapter contract suite run against **every** registered adapter: plan accounts for every Object part; validate flags an oversized part; preview duration ≈ estimate; plan is deterministic (same input → identical plan).
2. Laser tests: hero Object → G-code parses, bounding box ≤400×400, holder walls have finger geometry, engrave precedes cut, SVG colours correct.
3. Re-plan test (the Object→Impl proof): one stored Object → laser Impl (5 holder pieces, finger joints) vs Cricut Impl (1 folded blank + tabs) vs printer stub (5 solids); Object hash unchanged; zero model calls (assert trace empty).
4. Simulator tests: timeline ops ordered engrave→cut, per part/sheet; total duration >0 and monotonic.

## Exit criteria

- Contract + laser + re-plan + simulator tests green; coverage `devices/` ≥90%.

## HANDOFF — user verifies (~2 min, debug route `/snap/canvas?debug=1` or test report)

Same coaster+holder design re-plans Laser (nested sheet + downloadable G-code, holder inner 97×14mm) → Cricut (12" mat layout, "Phase 2" on download). Say `go` for Stage 04.
