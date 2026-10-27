# Stage 02 — Domain: schemas, measurement, geometry (Object layer) · AUTO

Prereqs: Stage 01. PRD: R-UN-1..6, R-TR-1..3, R-DS-1..5, `docs/prd/04-model-orchestration.md` §SceneAnalysis/DesignSpec. Pure TS in `snap-web/src/lib/domain/` — no Svelte, no fetch, fully unit-testable.

## Files

- `schemas.ts` — zod strict schemas (`additionalProperties:false` equivalent) for `SceneAnalysis`, `DesignSpec`, `BurnEvents` + `MeasureResult`; export JSON Schema for Spark structured output.
- `measure.ts` — reference scale (card 85.60×53.98mm: px/mm = mean(long/85.60, short/53.98); aspect error >6% warns), circle minor-axis diameter, rect W×H, confidence. Constants for letter/A4/quarter/mat.
- `object.ts` — `ObjectSpec` types: parts (2D profile in mm, thickness, named edges), `surfaceArt[]` (abstract op intent only), `assembly` steps as intent. **No device fields** (no power/feed/deviceId).
- `templates.ts` — coaster (round/square/hex), `finger_box_open`, ornament. Each declares `implVariants: ('laser'|'vinyl'|'printer3d')[]` + joinery *intent* ("walls join base edges"), never joint geometry.
- `geometry.ts` — `DesignSpec → ObjectSpec` deterministic generator; kerf/clearance applied per-Impl later, defaults carried as data (0.1mm / 1mm).
- `nesting.ts` — shelf packer (3mm spacing, overflow → new sheet/plate).

## TDD sequence (each: red test → impl → green)

1. Schema tests: valid fixtures pass; extra keys / missing required fail; malformed Spark output rejected.
2. Measurement tests on synthetic masks: card at known px/mm recovers scale ±1%; ellipse minor-axis recovers Ø within 5% under 20° perspective fixture; no-reference returns `needs-reference`.
3. Template/geometry tests: hero spec (4× Ø95 coasters + holder for 4×3mm) → holder inner 97×14mm as *intent dims*; art placement centred; qty expansion correct.
4. Nesting tests: parts fit 300×300, spacing respected, overflow creates sheet 2.
5. Anti-leak contract test: `ObjectSpec` JSON contains no `power/feedRate/deviceId/gcode` keys anywhere (deep scan).

## Exit criteria

- `bun run test:coverage` — `domain/` ≥90% lines, all green. Proceed unattended to Stage 03.
