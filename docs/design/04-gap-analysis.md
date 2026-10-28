# 04 · Gap analysis: current code vs this design

Reviewed:

- `app/src/lib/{devices,domain,server/meta,state}`
- `routes/api/*`
- the PRD
- roadmap stages 00–11
- `CHECKPOINT.md`

The checkpoint reports 110 unit tests and 12/12 e2e, deployed. The structure is sound: the state/presentation split, Object → Impl, a fixture fallback on every server route, and the trace ledger. The gaps are almost all in the *pixels → geometry* middle, which is currently stubbed.

## What exists and is reusable as is

| Area | File(s) | Keep |
|---|---|---|
| Meta client, key server-side | `server/meta/client.ts` | ✓. Add `imageEditWith(image, prompt)`, which today sends no image, and a mask-returning SAM call |
| Spark strict JSON | `client.sparkJson / sparkVision` | ✓ |
| Convert flow (photo/description → objective → variations → breakdown) | `server/meta/convert.ts`, `state/convert.svelte.ts`, `/snap/convert` | ✓ as the **front door**; its `conversionClass` maps to `ImageBrief.class` |
| Adapter contract + registry + Phase2Error | `devices/types.ts`, `registry.ts`, `adapters.spec.ts` | ✓ shape. Split per doc 03 |
| Shrink scaling | `domain/convert.ts`, `devices/shrink.ts` | ✓. Becomes a pre-planner transform |
| Measurement math (card → px/mm, ellipse minor axis) | `domain/measure.ts` | ✓. Also used by 6-view and reference scale |
| Trace / budget guard | `server/trace.ts`, `server/guard.ts` | ✓. Add the `stage` field |

## Gaps, in build order

| # | Gap | Today | Change | Size |
|---|---|---|---|---|
| 1 | **SAM masks** | `parseSamBoxes` reads boxes only; `samMask` discards the result | Decode one-bit masks (`@meta-sam/parser` per PRD 04-C, or a small RLE decoder) into a `Mask { w, h, bits: Uint8Array }`; store as one-bit PNG in `snap.media` | M |
| 2 | **Raster toolkit** | none | `domain/raster/`: `Mask` ops (dilate, erode, fill holes, components, area, centroid), ellipse/rect fit, OKLab conversion, k-means (sub-sampled), mode filter, island removal. Pure TS, unit tested on `samples/` crops (local only) | L |
| 3 | **ImageBrief (S2)** | `analyseScene` sends a *hard-coded text* description and no image; `convert` sends the image but returns pieces, not regions | New `analyze_image` with the `ImageBrief` schema (doc 01), generated from zod; `/api/scene` and `/api/convert` both call it with the real image | S |
| 4 | **Cutout + objects (S3–S4)** | `/api/segment` returns one box | `/api/segment` → `{ subjectMaskId, outline, regions[] }`; fan-out SAM in parallel | M |
| 5 | **LayerStack (S5a + S6)** | `FALLBACK_PIECES.layered` = 3 fixed layers; `KIND_SIZE` guesses sizes | `domain/layers.ts`: `gradeLayers(subject, regions, k)`, `orderLayers()`, `hiddenMasks()`, `applyFillPolicy()`. New route `/api/layers` (code-only, plus the optional Spark naming) | L |
| 6 | **Vectorise (S7)** | PRD mentions potrace, but it is not in `package.json`; laser `emit` draws *rectangles* | Add `potrace` (pure JS port) → `domain/vector.ts` (paths in mm, kerf offset via clipper-lib, min-feature check, registration holes) | M |
| 7 | **ObjectSpec carries geometry** | `profile` is a bounding box only | Add `paths: PathMm[]` per part and `layers?: { n, name, colour, partIds }[]`; keep `profile` as a derived bbox for nesting | M |
| 8 | **Adapter split (doc 03)** | adapter = profile + plan + emit in one object; `Target` is strings | `profiles/`, `planners/`, `emitters/`, `connectors/`; the laser emitter writes real paths from #7; the Cricut planner emits one mat per layer colour (P1 can download SVG; only the Design Space handoff is P2) | M |
| 9 | **Gap fill: Imagine** | — | `client.imageEditWith(crop, prompt)`, then re-quantise k = 1 and merge into the hidden mask | S |
| 10 | **6-view (S5b)** | none | `CaptureState` gains a `views` mode; `/api/views` → `FaceSet`; geometry: faces + joints → existing `finger_box`-style generator | L (P1+ / stretch) |
| 11 | **Reference + changes** | the convert `comment` is free text | `EditOp[]` schema; Spark parses; touched regions re-run S4–S7 | M (P1+) |
| 12 | **State + routes** | `ConvertState` holds everything | `LayerFlowState` (`stage`, `brief`, `regions`, `stack`, `fills`, `materials`) as a `*.svelte.ts` class; routes `/snap/layers/{cutout,objects,layers,gaps,material,cut}`; components from the mockups (`mockups/svelte`) | M |
| 13 | **Tests / eval** | eval on caliper measurements only | Golden tests: the two reference images → expected layer count ±1, order, visible % within 3 points; vector closed-path checks | S |

**Size key:** S ≤ ½ day, M ≈ 1 day, L ≈ 2 days.

## Suggested cut for the hackathon (by Nov 4)

**Must:**

- items 1–7: masks, raster, brief, segment, layers, vector, Object geometry;
- the laser emitter from #8 (real paths);
- #12 for the layered path.

That gives a live demo of *upload paper-art photo → regions → 8 layers → gaps → per-layer SVG/G-code*.

**Stretch:**

- #9 Imagine fill;
- the Cricut SVG mats;
- #11 Reference edits.

**Post-hackathon:**

- #10 six views;
- connectors (Web Serial, xTool LAN, Design Space);
- FDM and CNC planners.

## Risks

- **Worker CPU.** k-means plus potrace on 2048 px can exceed the Worker CPU limit. Mitigations: sub-sample, run the grading at 1024 px with a full-res final pass per layer, or move raster work into the browser (a Web Worker) with the same pure TS module. The design keeps it pure, so either host works.
- **SAM mask resolution.** See the open question in doc 02.
- **Hidden-area semantics.** For wood pieces the "back panel" may include the wall seen through an open frame (the lake sample shows this). S4's `likelyBought` and a "see-through" region type handle it; the UI already flags "needs your call".
