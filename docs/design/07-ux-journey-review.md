# 07 · UX journey review: one craft, start to finish

A senior UX review of the app as deployed on 2026-10-28 (`f8b8aa3`), walked at 390 px (phone) and 1440 px (studio). Docs [04](04-gap-analysis.md) and [06](06-ui-gap-analysis.md) cover the gaps between the pipeline and the mockups. This doc covers the **journey**: can a first-time maker understand Katachi, start a craft, finish it and find it again?

**Verdict:** the individual screens are solid, but the product has no spine. It ships **two separate flows**: the coaster flow (scene → plan → art → preview → canvas) and the image → layers flow (`/make/*`). It also has a nav made of tools rather than steps, no place where finished work lives, and a front door that never says what the app does. The fix is one canonical **craft journey** that every screen, route, nav item and chat message points at.

---

## 1. The canonical journey (target)

```
Landing ─► Home ─┬─► New craft ─► 1 Capture ─► 2 Shape ─► 3 Layers & joins ─► 4 Sheets ─► 5 Assemble ─► Saved craft
 (what it is,    │   (talk / type /  (snap · upload  (what is it, make  (stacked layers    (one sheet   (step-by-step,   (layers +
  how Muse is    │    pick a start)   · sketch;       it as, cutout,     or joined parts,   at a time,   then Save)       instructions +
  used, gate)    │                    1 photo or      keep regions)      gaps, edits)       to a device)                  chat notes)
                 └─► Recent crafts / Crafts gallery ─► reopen where you left off (or the finished craft)
                                    Chat (Katachi): guides each step · refines a layer or section · notes are saved with the craft
                                    Work area (/canvas): manual edits at any step
```

| # | Step | Routes | What the user decides | Muse models |
|---|---|---|---|---|
| 0 | Landing | `/` | Understand the app, get in | (illustrated) |
| 0 | Home | `/workshop` | New craft (talk/type/pick a start) or continue a recent one | Voice Transcribe, Spark (intent) |
| 1 | Capture | `/capture` | Snap · Upload · Sketch; one photo, or six sides for a 3D object | — |
| 2 | Shape | `/make/import`, `/make/cutout`, `/make/segment`, `/make/reference` | What it is, what to make it as, the brief; outline; which regions become parts | Spark 1.3 (sees), SAM 3.1 (cuts out), Muse Image (cleans) |
| 3 | Layers & joins | `/make/layers`, `/make/gaps` (stacked) · `/make/views` (joined) | Layer order, merge/split, what fills the hidden areas; or the parts and joinery | Spark (plans), Muse Image (imagines gaps) |
| 4 | Sheets | `/make/output` | Device, then feed → cut → check, one sheet at a time | code (device adapter) |
| 5 | Assemble | `/make/assemble` | Follow the steps, then **Save craft** | Spark (writes the steps) |
| — | Crafts | `/crafts` | Find, reopen and delete crafts | — |
| — | Settings | `/settings` | Devices (default, status), theme, density | — |

**Rule:** the phone step strip, the studio step tabs, the Katachi step messages and the saved craft's progress all use the same five names: Capture · Shape · Layers · Sheets · Assemble.

---

## 2. Gaps and resolutions

Severity: **S1** blocks understanding or completion · **S2** causes confusion or rework · **S3** polish.

### 2.1 Front door

| # | Gap (observed) | Sev | Resolution | Status |
|---|---|---|---|---|
| G1 | The landing says *"Show it. Say it. Burn it."* and nothing else. It has no picture of the outcome and no hint of what the Muse models do. A judge can't tell what the app makes. | S1 | **Hero illustration:** a picture becomes an exploded stack of layers that become sheets that become the finished piece. Below it, **How it works** in five steps, each tagged with the model that does it (Voice Transcribe · Spark 1.3 · SAM 3.1 · Muse Image · code). | Built |
| G2 | At 1440 px the landing is half empty: a short pitch on the left and a form floating on the right. | S2 | Desktop layout: hero text plus illustration across the top, with the gate as a card beside it; the how-it-works band below. Phones stack them: pitch, illustration, form, then steps. | Built |
| G3 | The gate is the only thing on the page. Visitors without a code learn nothing. | S2 | Put the pitch and how-it-works above the gate so the landing works as a mini product page. | Built |

### 2.2 Home (workshop)

| # | Gap | Sev | Resolution | Status |
|---|---|---|---|---|
| G4 | On the studio layout, Home is a 720 px phone column floating in an empty canvas. It has no desktop layout. | S1 | Two zones from 1024 px: **Start a craft** (talk/type and the four starting points) beside **Continue** (the current craft with its step progress), and **Recent crafts** as a grid below. | Built |
| G5 | "New project", the mic, a text field, "Snap & measure" and "Snap a photo" sit together, with no hierarchy and three ways to start. "Snap & measure" starts the old coaster flow and leaves the craft journey. | S1 | One start: describe or say it, **or** pick a starting point (Layered picture · 3D object · Remix a picture · Sketch it). Each choice opens Capture already set up (shot count, source). Typed or spoken intent picks the start for you. | Built |
| G6 | No recent crafts gallery. "Open" is a plain list, and finished work has nowhere to live. | S1 | A **Recent crafts** grid on Home (up to 6) and a full **Crafts** page with All · In progress · Finished filters. Each card shows a thumbnail, the step reached and when it was last touched. An example craft shows when the gallery is empty, so the gallery is never blank in a demo. | Built |
| G7 | "Project" (code, Home) vs "craft" (product language) vs "piece" (chat). | S3 | The user-facing word is **craft**. `ProjectRecord` keeps its name in code. | Built |

### 2.3 The flow

| # | Gap | Sev | Resolution | Status |
|---|---|---|---|---|
| G8 | **Two flows.** Coaster: scene → plan → art → preview → canvas. Layers: import → … → output. They share neither nav, state nor naming, so the user can't tell which one they are in. | S1 | One craft journey (§1). `/scene`, `/plan`, `/art` and `/preview` redirect into it. Their capabilities move into steps: measuring against a reference → Shape; art cleanup → Shape (Muse Image); photoreal preview → Assemble. That folding is part of the integrated Muse build ([§4](#4-what-moves-to-the-integrated-muse-build)). | Routes redirected; capabilities listed for the integrated build |
| G9 | The nav lists tools (Workshop, Snap, Image to layers, Canvas, Burn Watch, Batch), not where you are. "Snap" and "Image to layers" are two halves of the same craft. | S1 | Nav: **Home · Crafts · Craft** (resumes the current craft at its step) **· Work area · Watch** (+ Batch in the studio rail) **· Settings**. Studio rail tools: Materials, Annotations, Settings. | Built |
| G10 | Capture isn't a numbered step. The step strip only appears after it (01/06 = Import), so the first thing you do doesn't count as progress. | S2 | Capture is step 1 of 5. The strip and tabs show on `/capture` too. | Built |
| G11 | Phone strip (six route steps: Import · Cutout · Segment · Layers · Gaps · Output) and studio tabs (six different steps: Import · Segment · Layers · Gaps · 6 views · Output) disagree. | S2 | One five-step journey. Each step owns routes: Shape = import + cutout + segment (+ reference); Layers = layers + gaps (+ views for 3D). The phone strip reads `02 / 05 · Shape · cutout`. | Built |
| G12 | You can't **sketch** a craft; only snap or upload. | S2 | Capture gets a third source, **Sketch**: a drawing pad (pen, eraser, clear) whose drawing becomes the captured image. | Built |
| G13 | 3D objects capture six sides on `/capture`, then land on `/make/views`, which asks for the views again. | S2 | Capture owns the shots. `/make/views` becomes **Parts & joins** (unfolded parts, joinery), with a shutter only for missing sides. | Built (copy + nav) |
| G14 | **Stacked vs joined** is implicit. Flat art always stacks, 3D always joins, and the user never sees the choice. | S2 | Layers shows the build as **Stacked layers** (flat, remix) or **Joined parts** (3D). It names the assembly method that Sheets and Assemble use. | Built (label + assemble) |
| G15 | **No assembly step.** The flow ends at Output with three hard-coded lines. The craft isn't "done", and nothing is saved as finished. | S1 | **Assemble** step: numbered instructions generated from the craft (each layer back → front with its spacer, or each part with its joinery). Step through them with the matching layer highlighted, then **Save craft**. The craft is marked finished and keeps its layers, instructions and chat notes. | Built |
| G16 | Chat refinements ("split the hills", "raise the sun on a spacer") disappear. They either trigger the old coaster scene analysis or nothing. | S1 | On a craft step, a chat message is a **refinement note** tied to the step and the selected layer. Katachi confirms it ("Noted for Layer 5 · Hills"). Notes are saved with the craft and listed on Assemble. Applying them for real is the integrated Muse build. | Built (capture + display) |
| G17 | The **work area** (`/canvas`, manual edits) is a separate island showing the coaster plan, whatever the craft. | S2 | Layers and Sheets link **Edit in work area**. The canvas must render the craft's sheets; that is in the integrated build. | Link built; canvas data in §4 |
| G18 | Back and forward between steps rely on the chat's Previous/Next and each page's own CTA. | S3 | Each step's primary action names the next step ("Find the outline", "Separate into layers", "Stack & cut", "Assemble"). The tabs and strip are links to reached steps. | Built |

### 2.4 Settings and devices

| # | Gap | Sev | Resolution | Status |
|---|---|---|---|---|
| G19 | Settings → Devices lists adapter names (laser, simulator, cricut, printer3d) with no status, no default and no way to tell which machine you own. Sheets has its own separate device list. | S2 | **My devices**: one card per machine (Cricut Maker 3 · paired, xTool S1 · online, Glowforge Pro · offline) with status, format and bed. **Default device** is used by Sheets. "Add a device" is labelled Phase 2 (Web Serial / LAN pairing). The adapters are listed separately as "Supported". | Built |

### 2.5 Process: design → code handoff

| # | Gap | Sev | Resolution |
|---|---|---|---|
| G20 | Mockups (Claude Design export, `mockups/svelte`) and code drift; each pass re-interprets the mock. | S1 | **The app is the prototype.** From this review on, flow changes go into `app/` first, behind the same tokens. The mockups are frozen as visual reference. This doc and [PRD 06](../prd/06-screens.md) are the spec. Acceptance is the e2e journey test plus screenshots at 390 px and 1440 px (`tests/e2e/journey.spec.ts`). |
| G21 | PRD 06 still describes `/snap/*` routes and a phone-only column. | S2 | PRD 06 rewritten to the craft journey and the current routes. PRD 02 gains J0, the canonical craft journey. PRD 03 gains `R-UX-*`. |
| G22 | Model calls are scattered: some pages trigger analysis through the chat, and no screen shows which model did what on the current step. | S1 | **State owns every model and agent interaction** (§5). `MuseAgents` is the only path to Meta models, each step shows its jobs in an activity strip, and unwired jobs are labelled placeholders. |

---

## 3. Screen notes (as built)

Screenshots from the e2e run (`tests/e2e/journey.spec.ts`), 1440 px and 390 px: [07-screens/](07-screens/).

- **Landing** `/`: top bar (mark, theme). Hero: eyebrow, headline, one-line promise, **exploded-layers illustration** (the code-drawn Mountain sunset split into its layers), the gate card. Band: *How it works*, five steps with model chips. Footer: "Muse models on the Meta Model API · cut paths computed on your device".
- **Home** `/workshop`: greeting; **Start a craft** card (mic + "What are we making?" + four starting points); **Continue** card (thumbnail, name, `Step 3 of 5 · Layers`, Resume); **Recent crafts** grid with *See all*.
- **Crafts** `/crafts`: filter toggle, card grid (2 columns on phones, 3–4 in the studio), card actions Open and Delete (delete asks to confirm inline, no browser dialogs), empty state with the example craft and New craft.
- **Capture** `/capture`: step 1 of 5. Source: Camera · Upload · **Sketch**. Shots: Single · 6 sides (preset from the start choice).
- **Assemble** `/make/assemble`: step list on the left (studio) or below (phone); the current step's illustration (layer highlighted, or the joined object); Previous / Next / mark done; your notes; **Save craft** → "Saved to Crafts" with Open crafts / Start another.
- **Settings** `/settings`: My devices (default radio, status pill, format, bed), Supported adapters, Workspace (density, theme).

## 4. What moves to the integrated Muse build

These need the live pipeline (doc 04 #1–11) and are deliberately not faked in the UX pass:

1. Shape: measure against a reference card (SceneAnalysis + SAM scale) for crafts that must fit something; this replaces `/scene`.
2. Shape: sketch cleanup with Muse Image (3 variants), the Sketch source's natural next step; this replaces `/art`.
3. Layers: apply refinement notes through Spark tool calls (merge, split, raise on a spacer, recolour).
4. Work area: render the craft's real sheets (vectorised layers) instead of the coaster plan; this replaces the coaster `/plan` → `/canvas` path.
5. Assemble: Spark writes the instructions from the ObjectSpec; Muse Image renders the finished piece (replaces `/preview`).
6. Crafts: server-side storage with auth (R-PL-6, P2); today crafts live in browser storage.

## 5. The state / agent boundary (R-UX-10)

```
 Page / component  ──props──▶ renders             (no fetch, no model, no file I/O; `test:arch` fails the build otherwise)
        │ events
        ▼
 AppState (useApp())  ──▶ LayerFlowState · CaptureState · ProjectStore …   (every transition)
        │
        ▼
 MuseAgents (lib/state/muse.svelte.ts)  ──▶ server routes /api/* (own META_API_KEY) ──▶ Meta models
        │ records an AgentTask per job: running → done | placeholder | failed
        ▼
 AgentActivity strip on the step (model · what it did · "placeholder")
```

| Job (`lib/content/agents.ts`) | Model | Step | Runs when | Today |
|---|---|---|---|---|
| `intent.classify` | Muse Spark 1.3 | Home | you say or type what you're making | placeholder (keywords) |
| `capture.describe` | Muse Spark 1.3 | Capture | Continue | placeholder |
| `shape.cleanSketch` | Muse Image | Shape | a sketch is captured | placeholder |
| `shape.cutout` / `shape.segment` | SAM 3.1 | Shape | Outline / Parts first open | placeholder |
| `layers.plan` | Muse Spark 1.3 | Layers | Stack first opens | placeholder |
| `layers.imagineGaps` | Muse Image | Layers | Gaps first opens | placeholder |
| `layers.unfold` | Muse Spark 1.3 | Layers | Parts & joins first opens | placeholder |
| `layers.refine` | Muse Spark 1.3 | Layers | a chat note on any step | placeholder |
| `sheets.vectorise` | Code | Sheets | Sheets first opens | placeholder |
| `assemble.instructions` | Muse Spark 1.3 | Assemble | Assemble first opens | placeholder (code-derived steps) |
| `assemble.render` | Muse Image | Assemble | *Picture it finished* | placeholder |

Wiring a job means replacing one method body in `MuseAgents` with a call to its route and flipping its `status` to `live`. No page changes. The coaster flow's live calls (`/api/scene`, `/api/convert`, `/api/design`) already sit behind `FlowState` / `AppState` the same way.

## 6. Review round 2 (2026-10-28)

| # | Feedback | Resolution |
|---|---|---|
| G23 | The landing vanished once signed in: `/` redirected to Home. | `/` is always the landing. Signed in, the gate card becomes **You're in → Open the workshop / Your crafts**. The Katachi mark (rail and phone bar) links back to it. |
| G24 | Capture said "Photo captured" but the stage was blank until the next page. | `CaptureState.shown`: the stage shows the latest shot as soon as every slot is filled, or the slot you pick. |
| G25 | Do pages run on mock data held in state, so swapping in live data keeps the flow? | **Yes, now end to end.** Pages read only state fields (`subject`, `outline`, `cutoutChecks`, `regionList`, `stack`, `parts`, `assembly`, devices). Fixtures are only those fields' starting values. Each `MuseAgents` job returns data in the live shape, and `AppState` writes it into the fields (`applyCutout`, `applyRegions`, `applyLayers`, `applyParts`, `instructions`). Katachi's step messages are built from the same fields (`noteFor`). Making a job live changes one method; no page changes. |
| G26 | Show model actions and costs in the chat. | Every call is posted in the thread as a **model-call row**: model, what it did, cost and time. Live calls come from the server trace with their billed cost. Placeholders show the job's typical cost from PRD 04 §4.5 as **est.** and are tagged *placeholder*. Estimates are not added to the session cost pill. |
| G27 | The work area felt out of place (coaster demo). | `/canvas` is now the **craft's sheet editor**: sheets list (back → front, or parts for 3D), the selected sheet on the bed with registration holes, and a sheet panel (name, material, laser op, power, speed) with links to Layers and Sheets. With no craft open it shows an empty state. Drawing on the bed is the integrated build. The coaster Simulate/Assembly playback left the page. |
| G28 | Burn Watch should look like Sheets. | Burn Watch lists the craft's **cuts**: thumbnail, status (next / cutting n% / check it / cut / waiting), watch result (n alerts / clean), **Send** on the next sheet, **Watch** on the others, and **Download .zip**. The stage shows the selected cut on the bed with the tracking outline, the alert, the timeline and the events. Sending from Sheets starts watching that cut too. With no craft open it plays the demo clip. |

Storage: crafts (name, step reached, path, thumbnail, every choice and every model result) live in this browser's `localStorage` (`katachi.projects`, `katachi.current`, and `katachi.device` for the default device). They are read back on load and on Open. Server-side crafts arrive with auth (R-PL-6).

## 7. Still open

- The studio assistant column stacks the step inspector over the chat log, and on tall inspectors (Layers) the log is clipped underneath.
- Drawing and vector edits on the bed in the work area; real cut files in the .zip (needs `sheets.vectorise`).
- Remix crafts have no strip position of their own for the Reference screen.
