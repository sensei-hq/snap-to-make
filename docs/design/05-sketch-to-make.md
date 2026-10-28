# 05 · Sketch → Make (Phase 2)

**Idea:** take a rough sketch, understand what the person means, clean it up, and ask *how* they want to build it (style + the devices they own). Then produce every piece and the assembly. It reuses the image pipeline (doc 01) and the adapters (doc 03); what's new is **interpretation** and **style planning**.

## Flow

```
Sketch (photo / upload / stylus)
  → I1 Interpret        Spark: what is it? (object, scene, character, mechanism), parts named, proportions, views implied
  → I2 Clean up         Muse Image edit: clean line art in the same composition (n = 3, user picks), SAM: stroke mask
  → I3 Confirm intent   ask: "A fox sitting, curled tail, about 20 cm tall?"  (default sizes from Spark, editable)
  → I4 Style            ask: Layered · Wood (slotted/finger) · Paper (pop-up / layered) · Origami · Woodworking (joinery)
                        ∩ devices you own (Workshop profile)  → feasible styles only
  → I5 Plan             Spark plan_build (high): style template + parameters → DesignSpec / FaceSet / LayerStack
  → I6 Geometry         code: style generator (doc 01 S5–S7 or 3D generators below)
  → I7 Preview          Muse Image: the built object in the chosen material
  → adapter → files, cut order, assembly steps
```

## Styles and their generators

| Style | Structure | Generator (code) | Devices |
|---|---|---|---|
| **Layered** | 4–10 flat stacked layers | doc 01 S5a–S7 on the cleaned art (k from the Spark palette) | laser, blade, CNC (pocketed), FDM plates |
| **Wood: slotted** | 2–3 cross sections that slot together | silhouette extrusion → orthogonal sections, slot width = thickness + kerf | laser, CNC |
| **Wood: stacked contour** | Many horizontal slices | contour slicing of an inferred 3D shape (Spark proportions → simple revolved / lofted body) | laser, CNC |
| **Paper: pop-up** | Card with V-folds | fold-line generator on layer depth | blade (score), laser (score) |
| **Origami / papercraft** | Unfolded net with tabs | low-poly mesh → unfold (one-piece net + glue tabs) | blade, laser, printer (print and cut) |
| **Woodworking** | Real joinery, cut list | parts from FaceSet + joint library (finger, dado, dowel); output is a cut list and drawings, plus optional CNC files | CNC, laser (jigs), table saw cut list |

## Data additions

```ts
SketchIntent   { subject, kind: 'object'|'scene'|'character'|'mechanism', parts: { name, role }[],
                 proportions: Record<string, number>, sizeMm: { h?: number, w?: number }, views: string[] }
StyleChoice    { style: 'layered'|'slotted'|'contour'|'popup'|'papercraft'|'joinery', params: Record<string, number|string> }
Workshop       { devices: string[], materials: string[], tools: string[] }   // also feeds doc 03 devicesFor()
```

## Models

- **Spark:** interpret, style feasibility, `plan_build`.
- **Muse Image:** cleanup and preview.
- **SAM:** stroke and part masks.
- **Wonder:** long builds such as a 40-piece contour model (background) with a progress report.
- **Glimmer:** offline edits.

## Why Phase 2

It needs Object 3D primitives (a mesh or lofts) and three new generators (sections, unfold, joinery). The P1 work in doc 04 (masks, raster, vector, adapter split) is the foundation it stands on, so nothing built now is thrown away.
