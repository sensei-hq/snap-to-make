# 03 · Device adapters: Object → Impl → machine

**Goal:** after the hackathon, adding a Cricut, a 3D printer, a CNC or a Glowforge should mean one new folder and one registry line, with no changes to the pipeline or the UI.

## Today (`app/src/lib/devices/`)

`DeviceAdapter` already has the right shape: `validate · plan · emit · preview · estimate`. It mixes three concerns, though:

- it knows the device, the material settings and the file format;
- the `Target` is a loose string bag;
- there is no notion of *sending* a job;
- `ObjectSpec` only carries bounding boxes (`profile.wMm/hMm`), so no adapter can emit real paths or layers.

## Target architecture

```
                 ObjectSpec (device-agnostic, mm)
                 parts · layers · paths · ops · assembly intent
                               │
         ┌─────────────────────┼──────────────────────────────┐
         ▼                     ▼                              ▼
   DeviceProfile          MaterialProfile                UserWorkshop
  (what the machine      (sheet sizes, kerf, colours,   (devices owned, supplies,
   can do, workspace,     power/speed or blade/pressure  preferences)
   ops, formats)          per device kind)
         └──────────┬──────────┴──────────────────────────────┘
                    ▼
   ① Capability match ── picks Strategy per part (cut / score+fold / extrude / engrave / draw)
                    ▼
   ② Planner (per process)  ObjectSpec + Target → ImplPlan
        laser-planner · blade-planner · fdm-planner · cnc-planner
        (joints, nesting, layer→sheet, supports, tool order)
                    ▼
   ③ Emitter (per format)   ImplPlan → Artifact[]
        gcode-grbl · svg-colour-ops · dxf · lightburn-lbrn · cricut-svg · stl · 3mf · gcode-marlin
                    ▼
   ④ Connector (per transport)   Artifact[] → Job
        download · web-serial(GRBL) · lan-http(xTool) · cloud(Glowforge) · design-space-handoff · octoprint · bambu-lan
                    ▼
   ⑤ Monitor (optional)   Job → events  (Burn Watch: camera + SAM; or device telemetry)
```

A **device adapter** is a *composition* of these pieces plus a profile:

```ts
// devices/types.ts (target)
export type Process = 'laser' | 'blade' | 'fdm' | 'cnc' | 'pen' | 'shrink'
export type Op = 'cut-through' | 'engrave-surface' | 'score-crease' | 'draw-line' | 'extrude-solid' | 'pocket'

export interface DeviceProfile {
  id: string; label: string; vendor: string; process: Process
  workspaceMm: { w: number; h: number; z?: number }
  ops: Op[]; formats: string[]            // e.g. ['gcode-grbl','svg']
  materials: string[]                     // MaterialProfile ids it supports
  connectors: string[]                    // e.g. ['download','web-serial']
  phase: 'p1' | 'p2' | 'p3'               // UI labels Phase 2 automatically
}
export interface MaterialProfile {
  id: string; label: string; kind: 'paper'|'cardstock'|'ply'|'hardwood'|'acrylic'|'pla'|'shrink-film'|'vinyl'
  thicknessMm: number; sheetMm?: { w: number; h: number }; colour?: string
  settings: Partial<Record<Process, Record<string, number|string>>>   // laser: { powerPct, speedMmS, passes, kerfMm }
}
export interface Target { deviceId: string; materialByLayer: Record<string, string>; connectorId: string }

export interface Planner   { process: Process; plan(obj: ObjectSpec, t: ResolvedTarget): ImplPlan; validate(obj: ObjectSpec, t: ResolvedTarget): PreflightIssue[] }
export interface Emitter   { format: string; emit(plan: ImplPlan, t: ResolvedTarget): Artifact[] }
export interface Connector { id: string; available(): Promise<boolean>; send(a: Artifact[], t: ResolvedTarget, on: (e: JobEvent) => void): Promise<JobHandle> }

export interface DeviceAdapter {           // what the registry exposes; built from the parts above
  profile: DeviceProfile
  planner: Planner
  emitters: Emitter[]
  connectors: Connector[]
  preview(plan: ImplPlan): PlaybackTimeline
  estimate(plan: ImplPlan, t: ResolvedTarget): Estimate
}
```

### ImplPlan grows sheets and layers

```ts
ImplPlan {
  deviceId, process,
  sheets: { id, materialId, sizeMm, pieces: PlacedPiece[] }[]   // one sheet per layer colour for paper; nested for wood
  pieces: { id, partId, layerN?, paths: PathMm[], ops: Op[], joint?: JointSpec }[]
  order: { sheetId, pieceId, op }[]                              // engrave → score → cut, inner → outer
  assembly: { step, text, pieces: string[] }[]
}
```

## How each device plugs in

| Device | Planner | Emitters | Connectors | Specific logic |
|---|---|---|---|---|
| Longer Ray 5 (P1) | laser | gcode-grbl, svg | download → web-serial (P2) | kerf offset, engrave-first, finger joints, tabs |
| xTool S1 / Glowforge (P2) | laser | svg-colour-ops, lbrn | lan-http / cloud | colour → op mapping, Proofgrade presets |
| Cricut Maker (P2) | blade | cricut-svg | download → design-space handoff | **one mat per layer colour**, 12×12 in mat, score lines, fold tabs, min blade feature 1.2 mm |
| Silhouette (P3) | blade | dxf, svg | download | registration marks |
| FDM printer (P3) | fdm | stl, 3mf, gcode-marlin (via slicer) | download, octoprint, bambu-lan | layers → **extruded plates** (each layer becomes a 0.6–1.2 mm slab; multi-colour by filament swap at a height, or separate plates); 3D objects → STL from faces + joints |
| CNC router (P3) | cnc | gcode-grbl | web-serial | tool diameter → inside-corner dog-bones, pockets for layered relief from ONE board (layer n → depth n·t) |
| Shrink film (P1 sim) | blade or pen | svg | download | scale ×1/ratio before planning (existing `shrink.ts` logic becomes a **pre-planner transform**) |

The **layered** piece shows why splitting the planner matters:

- **laser-wood:** 6 nested sheets of birch with stain notes;
- **blade-paper:** 8 mats, one per colour;
- **fdm:** 8 thin plates or one multi-material print;
- **cnc:** one board pocketed to 6 depths.

Same `ObjectSpec`; only the planner differs.

## Registry and extension

```ts
// devices/registry.ts
registerDevice(longerRay5)           // profile + composed parts
registerEmitter(gcodeGrbl); registerConnector(webSerial)
export const devicesFor = (obj, workshop) => ...   // filters by ops the Object needs ∩ devices the user owns
```

**New device checklist**

1. Add a profile JSON in `devices/profiles/` (no code if planner, emitter and connector already exist).
2. If the process is new, add `planners/<process>.ts`.
3. If the format is new, add `emitters/<format>.ts`.
4. If the transport is new, add `connectors/<id>.ts`.
5. The contract suite (`adapters.spec.ts`) runs automatically against every registered device:
   - every Object part is planned;
   - oversize parts are flagged;
   - the plan is deterministic;
   - emit parses, or throws `Phase2Error` when `phase !== 'p1'`;
   - preview total ≈ estimate.

**Rules**

- Planners are pure (no I/O, no model calls).
- Connectors are the only place with side effects. They live in state (browser: Web Serial) or on the server (cloud APIs), never in components.
- Device and material choices are data, so "what devices do you have?" (Sketch → Make, doc 05) is just a filter over profiles.
