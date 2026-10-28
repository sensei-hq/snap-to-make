# 06 — Screens

The screens of the craft journey ([J0](02-user-journeys.md), [design/07](../design/07-ux-journey-review.md)), as built in `app/`. For each screen: **purpose · route · state · models · notes**. Visual rules are in [07-design-language.md](07-design-language.md).

## Rules every screen follows

1. **State and presentation are separate.** Pages (`src/routes`) and components (`src/lib/components`) render values and fire events. They never fetch, never call a model and never read files. Every transition lives in a state class (`src/lib/state/*.svelte.ts`), reached through the one `AppState` (`useApp()`). `bun run test:arch` enforces this.
2. **Models and agents are reached only through `MuseAgents`** (`lib/state/muse.svelte.ts`), called by `AppState` methods. The jobs are catalogued in `lib/content/agents.ts`, each with its model, step and the server route it will use. Jobs not wired yet return fixtures in the live shape. The step's **activity strip** (`AgentActivity`) shows each job with its model and a *placeholder* label.
3. **One route tree, two layouts.** Below 1024 px: phone column, app bar (back, title, cost pill, settings, theme), step strip, actions docked above the icon nav (Home · Crafts · Current craft · Work area · Watch · Katachi). From 1024 px: studio rail (+ Batch, Materials, Annotations, Settings), top bar with the five step tabs, work area, Katachi column on the right.
4. **The same five step names everywhere:** Capture · Shape · Layers · Sheets · Assemble (`lib/content/journey.ts`).

## Route map

| Route | Screen | Journey step |
|---|---|---|
| `/` | Landing + gate | — |
| `/workshop` | Home | — |
| `/crafts` | Crafts gallery | — |
| `/capture` | Capture | 1 Capture |
| `/make/import` · `/make/reference` · `/make/cutout` · `/make/segment` | What it is · Remix changes · Outline · Parts | 2 Shape |
| `/make/layers` · `/make/gaps` · `/make/views` | Stack · Gaps · Parts & joins (3D) | 3 Layers |
| `/make/output` | Sheets | 4 Sheets |
| `/make/assemble` | Assemble | 5 Assemble |
| `/canvas` | Work area (manual edits) | any |
| `/watch` · `/batch` · `/hood` | Burn Watch · Wonder batch · Under the hood | — |
| `/settings` · `/materials` · `/annotations` | Settings (devices) · Materials · Annotations | — |
| `/scene` `/plan` `/art` `/preview` | redirect → `/workshop` (R-UX-11) | — |

---

## S0 Landing `/`
- **Purpose:** say what Katachi makes and how the Muse models do it; let invited users in (R-UX-1, R-PL-3/4/5). Always reachable; signed in, the gate card offers *Open the workshop* (design/07 G23).
- **State:** `SessionState` (code, three ticks, message).
- **Notes:** hero = headline + `HeroJourney` (your picture → `ExplodedLayers` → cut & assembled, with Muse Spark / SAM 3.1 / Muse Image / Code on the arrows). The gate card sits beside it from 1024 px and below it on phones. *How it works* band: five cards, each with its model chips.

## S1 Home `/workshop`
- **Purpose:** start a craft or pick one up (R-UX-2).
- **State:** `AppState.startCraft(start | text)`, `listenToStart()`, `projects`, `progressOf()`, `openExample()`.
- **Models:** `intent.classify` (Spark, placeholder: keyword match).
- **Notes:** *Start a craft* card (mic, "Say it or type it", four starting points) and *Continue* (the open craft with its five steps), or *How a craft goes* for first-time users. *Recent crafts* grid (`CraftCard`) with *See all*; an empty state offers the example craft.

## S2 Crafts `/crafts`
- **Purpose:** find, reopen and delete crafts (R-UX-8).
- **State:** `projects`, `removeCraft()`, `open()`, `openExample()`.
- **Notes:** filter All · In progress · Finished; 2 columns on phones, 3–4 in the studio; delete asks inline (no browser dialogs).

## S3 Capture `/capture`
- **Purpose:** step 1 (R-UX-4).
- **State:** `CaptureState` (mode, source, slots, `uploadFiles()`), `AppState.startFromCaptureMedia()`.
- **Models:** `capture.describe` (Spark), `shape.cleanSketch` (Muse Image) for sketches.
- **Notes:** Shots: Single · 6 sides. Source: Camera · Upload · **Sketch** (`SketchPad`: pen, eraser, line weight, clear). Continue names the craft (file name, or *Photo · date* / *Sketch · date*).

## S4 Shape `/make/import` → `/make/cutout` → `/make/segment` (remix: `/make/reference`)
- **Purpose:** step 2: what it is, what to make it as, the brief; the outline; which regions become parts.
- **State:** `LayerFlowState` (kind, makeAs, brief, keep, segment view, refine tool), `AppState.askForBrief()` (live: `/api/convert`).
- **Models:** `shape.cutout`, `shape.segment` (SAM 3.1, placeholders) run when each route first opens.

## S5 Layers `/make/layers` → `/make/gaps` (3D: `/make/views`)
- **Purpose:** step 3: stacked layers (order, duplicate, merge down, split, solid/hidden view, gap fill) or joined parts (parts list, joinery) (R-UX-5).
- **State:** `LayerFlowState`; chat notes via `AppState.refine()` (R-UX-7).
- **Models:** `layers.plan`, `layers.imagineGaps`, `layers.unfold`, `layers.refine` (Spark / Muse Image, placeholders).
- **Notes:** *Edit in work area* opens `/canvas`.

## S6 Sheets `/make/output`
- **Purpose:** step 4: device (default from Settings), then feed → cut → check, one sheet at a time; files export.
- **State:** `LayerFlowState.job`, `setDevice()`.
- **Models:** `sheets.vectorise` (code, placeholder).
- **Notes:** primary action **Assemble** once the sheets are cut (or for a files-only export).

## S7 Assemble `/make/assemble`
- **Purpose:** step 5: put it together, then save (R-UX-6).
- **State:** `AppState.assembly` (from `domain/assembly.ts`), `LayerFlowState.assembleAt / assembled / notes`, `finishCraft()`, `renderFinished()`.
- **Models:** `assemble.instructions` (Spark), `assemble.render` (Muse Image), both placeholders.
- **Notes:** the step list and your notes on the left (studio) or below (phone); the current step's picture (the stack up to that layer, or the joined object); Done, Previous, Next, *Picture it finished*; **Save craft** → "Saved to your crafts".

## S8 Work area `/canvas`
- **Purpose:** manual edits to the open craft's sheets (design/07 G27).
- **State:** `LayerFlowState` (`selectLayer`, `renameLayer`, `setLayerMaterial`), `EditorState` (tool, zoom, grid, op, power, speed).
- **Notes:** toolbar (studio), sheets list, the sheet on the bed, sheet panel; empty state with no craft. Vector drawing arrives with the integrated build.

## S9 Settings `/settings`
- **My devices** (default radio, status, kind, bed, format; *Add a device*: P2), **Supported adapters**, **Workspace** (density, theme) (R-UX-9). Reached from the rail, or the gear in the phone app bar.

## S10 Burn Watch `/watch`
- **Purpose:** watch each cut (design/07 G28; R-BW-*).
- **State:** `WatchState` (`watchSheet`, `alertsOn`, `acknowledge`, per-cut results), `AppState.sendSheet()`, `watchCut()`, `exportSheets()`.
- **Notes:** cut list like Sheets (status, Send / Watch, Download .zip); the stage shows the selected cut; the demo clip plays with no craft open.

## S11 Batch · Under the hood
- Unchanged: R-WB-*, R-UT-*. The cost pill in every top bar opens Under the hood. Model calls also appear in the chat with their action and cost (design/07 G26).
