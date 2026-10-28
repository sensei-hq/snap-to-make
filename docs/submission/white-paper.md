# From Pixels to Parts: Orchestrating Meta's Muse Models for Physical Making
*Katachi — Snap → Make · White paper draft (numbers marked [EVAL] come from the 10-sample eval; [TRACE] from a live trace export)*

## Abstract
Desktop laser cutters are consumer products, but the design step — measuring the real world, tracing sketches, designing joined parts, previewing the result — remains expert work. Katachi closes that loop with a voice-first workshop buddy: show a sketch and the object it must fit, say what you want, and receive a measured, cut-ready design, a photoreal preview, an on-screen fabrication simulation, and machine G-code. Six Meta models each do the job they are uniquely best at; deterministic code does everything that must be exact.

## 1. The design gap in consumer fabrication
Millions own diode lasers, Cricut cutters and 3D printers; most cut downloaded templates. The wall is not the hardware: it is measuring (the mug the coaster must fit), tracing (the hand-drawn logo), joining (a holder that fits four 3 mm coasters), and imagining the result before spending material.

## 2. System overview
EAR (Muse Voice Transcribe) → EYE+BRAIN (Muse Spark 1.3: scene understanding, planning, conversation orchestration via tool calls) → HAND (SAM 3.1 pixel masks + code: scale, contours, tracing) → IMAGINATION (Muse Image: art cleanup, photoreal preview) → BACKGROUND (Muse Wonder batch planning) → WATCH (Spark + SAM video on burn footage). Muse Code built the system from the PRD.

## 3. Perception: Spark + SAM metrology
Spark returns a strict-JSON `SceneAnalysis` (objects with roles art / fit_target / reference, sam_prompts, camera confidence) via structured output. For each reference and fit target, SAM 3.1 returns a pixel mask from a text prompt. Code — never the LLM — computes scale: an ID-1 card is 85.60 × 53.98 mm; px/mm is the mean of long/short side ratios from the reference mask's fitted rectangle, with an aspect-error warning above 6%. Round fit targets use the fitted ellipse's minor axis, which is perspective-robust. Accuracy on 10 bench photos with caliper truth: [EVAL: mean |error| and ±5% pass rate].

## 4. Reasoning: models choose, code builds
Spark plans a strict `DesignSpec` (parts, templates, dimensions in mm, material, assumptions in plain language). A deterministic generator expands it into an **Object**: device-agnostic parts, art placements, and assembly intent. The LLM never emits coordinates. This separation is what makes the system portable (§5) and testable (golden pipeline: photo → scene snapshot → spec → G-code bounding box).

## 5. One design, many machines: Object → Impl
An Object is not a cut file. The user picks a fabrication target ("Make it with…") and an adapter generates the **Impl** — pieces, joint geometry, layout, toolpaths, assembly: finger-jointed plywood walls on a laser (kerf 0.1 mm), a scored folded blank on a Cricut, extruded solids on a 3D printer. Switching targets re-plans from the same Object with code only — zero model calls, zero cost. Laser export (G-code, SVG, .burn) is implemented; Cricut/3D-print export is Phase 2 behind the same adapter interface, with planning and simulation live today. A Simulator adapter plays any Impl back on a virtual bed (engrave-then-cut order with feed-rate timing) and animates assembly — the demo and the preflight check need no hardware.

## 6. Imagination: Muse Image
The sketch crop (SAM bbox) is edited into laser-friendly line art (n=3 variants, search/shell disabled for determinism); the user picks one or keeps the original. The photoreal preview composes ordered, captioned references (art, material swatch, scene photo) so the user sees the finished object before any material is cut.

## 7. Operations: Burn Watch and Wonder batch
Recorded burn clips are tracked by SAM (workpiece) and analysed by Spark into a timestamped event timeline (flare, heavy smoke, shift, incomplete cut), advisory only. Muse Wonder runs batch jobs off the interactive path — 40 personalised ornaments become variants, nested sheets, a burn order, and a materials list via our function tools.

## 8. Cost, latency, privacy
Measured on the public deployment (`docs/submission/trace-export.json`): live Spark scene analysis 4,955 ms / $0.0057 per call; a scene+watch sequence totals $0.0397 across muse-spark-1.3 and sam-3.1, with design generation deterministic (no model cost). Full hero sessions (art cleanup ×3 + preview via Muse Image) add ≈ $0.04–0.05 at $0.01/image. A budget guard caps spend per session/day with a kill switch; the public demo is invite-gated and uses only our own media; EXIF is stripped and media expires in 24 h. The Meta API key lives only on the server.

## 9. Limitations and future work
Measurement needs a known reference and a near-top-down shot (±20°); values are always shown and editable. There is no Meta TTS — narration uses on-device browser speech with captions. Phase 2: auth + saved projects, Cricut/3D-print export, Web Serial machine streaming with auto-pause, more templates; later: multi-photo measuring, material calibration from test burns, hands-free capture on Meta glasses.

## Appendix
Schemas (SceneAnalysis/DesignSpec), prompts, and build notes: github repo `docs/prd/04-model-orchestration.md`. Built with Muse Code from `docs/prd/`.
