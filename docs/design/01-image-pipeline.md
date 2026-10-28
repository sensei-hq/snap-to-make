# 01 · Image → parts pipeline

The pipeline has one spine and four entry modes. Every mode ends in the same `ObjectSpec`, so adapters (doc 03) never care where an image came from.

```
            ┌── Snap (camera) ─┐
 ENTRY ─────┼── Upload ────────┼──► S1 Intake ─► S2 Classify ─► S3 Cutout ─► S4 Objects ─► [ask: which regions?]
            ├── 6 views (3D) ──┘                    │                                         │
            └── Reference + changes ────────────────┘ (S2 routes)                             ▼
                                                                                         S5 Decompose
             ┌──────────── flat / layered ─────────────┬────── 3D object ────────┬── pattern ──┐
             ▼                                         ▼                         ▼             │
     S5a Colour-grade layers                 S5b Multi-view faces          S5c Single outline  │
     [ask: merge / split?]                   [ask: missing views]                               │
             ▼                                         ▼                                       │
     S6 Depth order + gaps ◄──────────────────────────┘                                        │
     [ask: how to fill hidden areas?]                                                           │
             ▼                                                                                 ▼
     S7 Vectorise (masks → closed mm paths) ─► S8 Material map [ask: material per layer] ─► S9 ObjectSpec
                                                                                         ─► adapter (doc 03)
```

## Stage table

| # | Stage | Input → Output | Who does it | Asks the user |
|---|---|---|---|---|
| S1 | **Intake** | file / camera frame / 6 frames / reference + utterance → `ImageIntake` | code: EXIF strip, downscale to 2048 px long edge, sha256, 24 h TTL media row | — |
| S2 | **Classify** | `ImageIntake` → `ImageBrief` (what it is, class, likely material, reference object, top-down score, SAM prompts) | **Spark 1.3** vision, strict JSON, `reasoning_effort: medium` | "Looks like layered paper art. Right?" (one chip row; default = Spark's guess) |
| S3 | **Cutout + outline** | image + `ImageBrief.subjectPrompt` → subject mask, outline (circle / rect / freeform), cleaned RGBA | **SAM 3.1** (subject mask), then code: hole fill, largest component, ellipse/rect fit, alpha matte | Only if the outline is ambiguous: "Is the frame part of it?" |
| S4 | **Objects** | cutout + `ImageBrief.regions[]` (noun phrases) → `RegionSet` (one mask per region, area %, centroid) | **SAM 3.1** fan-out, one call per region phrase in parallel; code: de-overlap (later wins), drop < 0.3 % | **Which regions become parts?** Defaults: everything except things Spark tagged `likely_bought` (frames, hoops, hardware) |
| S5a | **Colour-grade layers** | kept regions → `LayerStack` draft: k colour groups, each a mask | code: k-means in **OKLab** on masked pixels (k from Spark, 4–10), 5×5 mode filter, min island 0.15 %; Spark names each group | **Merge or split?** Pre-selects merges when ΔE < 8 and the area is small |
| S5b | **Multi-view faces** | 6 `ImageIntake` frames (front, right, back, left, top, base) + reference → `FaceSet` with mm sizes | Spark (view label, face correspondences, joinery guess) + SAM (face masks) + code (scale from reference, edge-length reconciliation across views) | **Missing views**; roof pitch / depth if a view is absent ("guess 35° or shoot the top?") |
| S5c | **Single outline** | kept region → one profile + inner detail lines | SAM mask, then code: contour + Douglas–Peucker; inner lines from the luminance edges inside the mask | — |
| S6 | **Depth order + gaps** | `LayerStack` → ordered back→front; each layer = `visible` mask + `hidden` mask | code: order by occlusion. A layer is behind B if dilated A ∩ B is mostly B's boundary; ties broken by lightness (sky/back is usually lighter) then Spark. Hidden = union of all masks in front ∩ subject outline − visible | **How to fill the hidden areas?** `extend` (solid sheet) / `leave` (+3 mm glue lip) / `imagine` (Muse Image inpaint) / `draw`. Default from S6 rules below |
| S7 | **Vectorise** | per-layer final mask + px/mm → closed paths in mm | code: potrace (turdsize 4, alphamax 1.0, opttolerance 0.2), kerf offset per material, min feature check (paper ≥ 1.2 mm, 3 mm ply ≥ 2 mm bridges), registration holes | Thin-feature warnings: "12 needles in Front pines are under 1 mm: thicken or engrave?" |
| S8 | **Material map** | layer colours + user's supplies + device list → material per layer (paper colour, wood + stain/paint) | code: nearest swatch in the user's supply list (ΔE in OKLab); **Spark** proposes paint vs stain vs natural for wood and writes the finishing notes | **Material per layer**: one tap to switch the whole set between paper and wood |
| S9 | **ObjectSpec** | everything above → `ObjectSpec` with `layers[]`, `parts[]`, `paths`, assembly | code only | — |

### Gap rule (S6 default)

- **Solid** when the layer carries the stack: it is the back layer, or the next layer up is more than 60 % hidden, or the visible area is fragmented (more than 12 islands).
- **Open** when the visible area is one or two connected pieces and paper saving is above 40 %.
- **Imagine** is never the default. It costs a Muse Image call and only matters when the user plans to shift or re-space layers.

## Entry modes

| Mode | Differs at | Notes |
|---|---|---|
| **Snap** | S1 | Camera frame plus live tips ("card in frame", "straight above"). The existing hero coaster journey is Snap with class `fit-target`, which skips S5a/S6 |
| **Upload** | S1 | No live tips, so S2's `topDownConfidence` matters more. Below 0.6 we warn and ask for a reference size or a typed diameter |
| **6 views** | S2 → S5b | Guided capture with turn prompts. Spark checks that each new frame is the expected view before accepting it |
| **Reference + changes** | S2 + after S6 | Run the full pipeline on the reference, then apply edits. Spark turns the utterance and the circled areas into `EditOp[]` (`replace_region`, `add_element`, `scale`, `recolour`, `merge_layers`). Only the touched layers are regenerated: Muse Image edits the crop, then S4–S7 re-run on that region |

## Data contracts (zod in `app/src/lib/domain/`, JSON Schema for Spark)

```ts
ImageIntake  { id, mode: 'snap'|'upload'|'views'|'reference', view?: 'front'|'right'|'back'|'left'|'top'|'base',
               wPx, hPx, sha256, mediaId }
ImageBrief   { subject: string, class: 'layered'|'composite-3d'|'pattern-shape'|'fit-target',
               likelyMaterial: 'paper'|'wood'|'acrylic'|'mixed'|'unknown',
               subjectPrompt: string,                       // SAM phrase for S3
               regions: { id, label, samPrompt, likelyBought: boolean, note }[],
               colourGroupsHint: number,                    // k for S5a, 4..10
               reference: { kind, samPrompt } | null, topDownConfidence: number, notes: string }
RegionSet    { regions: { id, label, maskId, areaPct, centroid:[x,y], keep: boolean }[] }
LayerStack   { pxPerMm: number | null, layers: { n, name, colour: '#RRGGBB', maskId,
               visibleMaskId, hiddenMaskId, visiblePct, hiddenPct,
               fill: 'extend'|'leave'|'imagine'|'draw', materialId?: string }[] }
FaceSet      { faces: { view, maskId, wMm, hMm, features: { kind:'hole'|'slot'|'window', bbox, dMm? }[] }[],
               joints: { a, b, kind:'finger'|'butt'|'tab'|'bevel' }[], missing: string[] }
EditOp       { kind, target: 'layer:n'|'region:id'|'all', params: Record<string, string|number> }
```

Masks are stored as one-bit PNGs in `snap.media` (`kind = 'mask'`) and referenced by id. They are never inlined in JSON that goes to a model.

## Where it runs

- **S1, S3 cleanup, S5a, S6, S7, S8 (matching):** pure TypeScript in `lib/domain/raster/`. Unit-testable; the worker CPU budget is fine at 2048 px. k-means on 2 M pixels is subsampled to 50 k pixels for centroids, then a full-image nearest-centroid pass.
- **S2, S4 naming, S5b reasoning, S8 finishing notes, EditOp parsing:** Spark, via `lib/server/meta/`.
- **S3, S4, S5b masks:** SAM 3.1 via `lib/server/meta/sam.ts`. This needs real mask decoding (doc 04, item 1).
- **Imagine fill and reference edits:** Muse Image `/images/edits` on a SAM-cropped region.

## UI mapping (mockups)

| Stage | Mobile board | Desktop board |
|---|---|---|
| S1 | M01 Source, Snap (now with Upload / 6 views / Reference) | D1 Import |
| S3 | M02 Cutout | D2 Segment (Cutout tab) |
| S4 | M03 Objects | D2 Segment |
| S5a | M04 Layers | D3 Layer stack editor |
| S6 | M05 Gaps | D4 Gap review, D3 properties |
| S5b | M08 Six views | D5 Six views |
| S8 | M06 Material | D3 properties |
| S9 → adapter | M07 Stack & cut | D6 Output + device |
| Reference | M09 Reference + changes | D1 "Reference + changes" |
