# 06 · UI gap analysis: app vs mockups

[04-gap-analysis.md](04-gap-analysis.md) covers the *pipeline* (pixels → geometry). This doc covers the *screens*. It compares `app/` with the runnable mock `mockups/svelte` (local only) and with [01-image-pipeline.md](01-image-pipeline.md), as of 2026-10-27, after the Katachi rename.

## Summary

| Area | Mock | App today | Gap |
|---|---|---|---|
| Phone · Snap → Make | 10 routed stages: gate, workshop, snap, scene, plan, art, preview, make, watch, hood | ~6 of 10, mostly stacked on one long `/snap` page | Stage routing, shared state, interactions |
| Phone · Image → layers | 9 screens: source, cutout, objects, layers, gaps, material, cut, views, reference | none; `/snap/convert` is a looser stand-in | Whole flow (needs doc 04 #1–7) |
| Desktop · editor + rail screens | `/app/design` (canvas, tools, properties, chat), projects, materials, annotations, settings | none | Desktop shell + editor |
| Desktop · layers studio | import, segment, stack, gaps, views, output | none | Whole studio (needs doc 04 #1–8) |
| Responsive | Separate trees by URL (`/mobile/*` phone frame, `/app/*` full window); breakpoints `md` 1024, `lg` 1320 | phone column everywhere; convert has one `lg:` grid | One route tree that renders phone or desktop by breakpoint |

The structure underneath is sound and stays: state/presentation split, Object → Impl, Rokkit components on named tokens, server routes with fixture fallback, trace ledger.

## 1. Phone · Snap → Make

| Mock | App | Gap | Size |
|---|---|---|---|
| `/mobile` gate | `/snap/welcome` | Live invite-format validation and disabled CTA until valid; `/` should land on the gate, not `/snap`. | S |
| `/mobile/workshop` | top of `/snap` | Suggestion chips are inert; no agent reply line after release; cost pill does not open the hood. Extra controls (Build plan, logo, preview) belong to later stages. | S |
| `/mobile/snap` | `/snap/capture` | **SourceModes** tabs (Photo · Upload · 6 views · Reference) that fork into the layers flow; shot counter; video. | S |
| `/mobile/scene` | inline `SceneCard` | Own route; editable measurements (`startEdit`/`setMeasurement`); "Fix a number" wired; measure label from data, not hardcoded. | M |
| `/mobile/plan` | inline `PlanCard` | Own route; parts derived from the measured mug (coaster = mug + 13 mm), not a fixed `diameterMm: 95`; editable assumptions. | M |
| `/mobile/art` | inline `ArtPicker` | Own route; "Use original" wired; selected-take hero; re-roll counter. | S |
| `/mobile/preview` | inline `PreviewStage` | Own route; scene cycle and darker-engraving toggle; caption from geometry. | S |
| `/mobile/make` | `/snap/canvas` | Plan comes from the design (not a fixture); lid offer/added/declined; composer edits ("walls 5 mm taller"); live estimate. App-only Simulate + Assembly stay (PRD S6). | M |
| `/mobile/watch` | `/snap/watch` | Alert hides after acknowledge; events selectable; timeline scaled to clip length. | S |
| `/mobile/hood` | inline `TraceDrawer` | Own route/sheet opened from the cost pill; trace covers every route (watch, canvas, convert). | S |

App-only screens: **convert** (front door to the layers flow, keep), **batch** (Wonder, keep), **Simulate/Assembly** (keep, PRD S6).

## 2. Phone · Image → layers

None exist. Each screen maps to a pipeline stage (doc 01) and a backend gap (doc 04):

| Mock | Stage | Blocked by (doc 04) |
|---|---|---|
| `layers/source` (kind picker: flat · 3D · reference) | S1–S2 | #3 ImageBrief |
| `layers/cutout` (before/after, checks) | S3 | #1 masks, #2 raster, #4 segment |
| `layers/objects` (region keep/drop, kept %) | S4 | #1, #4 |
| `layers/layers` (colour-graded stack, merge/split) | S5a | #2, #5 LayerStack |
| `layers/gaps` (extend · leave · imagine · draw) | S6 | #5, #9 imagine |
| `layers/material` (paper/wood per layer) | S8 | #5 |
| `layers/cut` (sheets, registration, send) | S7 → adapter | #6 vectorise, #7 geometry, #8 adapters |
| `layers/views` (six-view capture) | S5b | #10 (post-hackathon) |
| `layers/reference` (reference + changes) | entry | #11 EditOp |

The UI state for all of it is one class, `LayerFlowState` (kind, regions/keep, layer sets, gaps, materials, views, changes, device), which the app does not have yet. `ConvertState` overlaps only on source/objects/reference/output.

## 3. Desktop

| Mock | App | Gap |
|---|---|---|
| App shell: WindowChrome (38 px) + NavRail (48 px: projects, design, materials, annotations, │ panel toggles │ settings) + main | none | Shell + rail; the app needs its own sections (below), not the mock's file-editor rail as is |
| `/app/design`: floating toolbar, rulers, grid canvas with zoom and tool palette, Properties/Layers/Job panel (288 px), Katachi chat (336 px), one right panel at a time | none (`/snap/canvas` is the phone sheet) | Editor; `ShellState` (tool, op, tab, rightPanel, zoom, params, chat) |
| projects · materials · annotations · settings | none | Rail screens; settings carries the **density** axis the app lacks |
| layers studio: tab header (Import · Segment · Layers · Gaps · 6 views · Output), three columns 300–320 / flex / 340–360 with DeskChat | none | Studio; reuses `LayerFlowState` from §2 |

## 4. Responsive design (decision)

The mock separates phone and desktop by URL. The app renders **one route tree** and picks the layout by width, using the mock's breakpoints:

| Width | Layout |
|---|---|
| `< md` (< 1024 px): phones portrait and landscape, small tablets portrait | **Phone column**: app bar (mark, title, cost pill, theme), section tabs, content, composer docked at the bottom |
| `≥ md` (≥ 1024 px): tablets landscape, laptops, desktops | **Studio**: nav rail (48 px) with the sections + panel toggle, main workspace, Katachi chat panel on the right (336 px, collapsible); stage content gets a centred column (`max-w-prose`) or a two-pane grid where the mock has one |
| `≥ lg` (≥ 1320 px) | wider grids (two-pane stages side by side, chat always open) |

UnoCSS breakpoints are set to `md: 1024px`, `lg: 1320px` in `app/uno.config.js`; screens use `md:`/`lt-md:` variants, never JS width checks. Phones in landscape stay on the phone layout (they are < 1024 px wide).

## 5. Shared state

The mock has one provider (`provideAppState()` + `use*()`); the app creates state per page (`new FlowState()`), so nothing survives navigation from `/snap` to `/snap/canvas` or `/snap/watch`. The fix: an app-level context created once in `routes/snap/+layout.svelte` (session, flow, trace, theme/density), with pages reading it. This is the prerequisite for stage routes.

## 6. Assets: publishing rule

The mock's `static/layers/*` (ref-paper, ref-wood, forest-*, lake-*) are derived from **third-party listing photos** in `samples/` (`ref-paper.jpg` is a downscale of `samples/layered paper craft.jpg.webp`). They must never be copied into `app/static` or deployed, and the mock itself must not be deployed. The layers UI ships with app-drawn illustrations or images the user owns or generates (Muse Image) until real uploads flow through.

## 7. Brand

Katachi everywhere in `app/src`; no user-visible "Burn-E" remains. Remaining items: no page `<title>`s (the mock titles every page "Katachi · …"), and `BURN_E_KILL_SWITCH` in `app/.env.example` is unread by the code (rename to `KATACHI_KILL_SWITCH` when the kill switch is wired).

## 8. Build order

| # | Slice | Depends on | Size | Roadmap |
|---|---|---|---|---|
| U1 | Shared app context + responsive shell (phone bar/tabs/composer < md; rail + workspace + chat ≥ md), page titles, gate as entry | — | M | [12](../roadmap/12-app-shell-responsive.md) |
| U2 | Snap → Make stage routes (scene, plan, art, preview, make, hood) with derived geometry and the interactions in §1 | U1 | L | [13](../roadmap/13-snap-make-stages.md) |
| U3 | Image → layers flow, phone + studio layout (`LayerFlowState`, step strip, 7 steps; views/reference as branches) | U1 + doc 04 #1–7 | L | [14](../roadmap/14-image-layers-ui.md) |
| U4 | Desktop editor (`/snap/design`), rail screens, density | U1, U2 | L | [15](../roadmap/15-desktop-studio.md) |

Hackathon cut (by Nov 4): **U1 and U2 must**; U3 for the layered path once doc 04 #1–7 land; U4 editor is stretch, rail screens post-hackathon.
