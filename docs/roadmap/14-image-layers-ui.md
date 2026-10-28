# Stage 14 — Image → layers flow UI · AUTO (UI) → HANDOFF (live layered sample)

Prereqs: Stage 12; pipeline gaps #1–7 and #12 from [`04-gap-analysis.md`](../design/04-gap-analysis.md) for live data. Design: [`01-image-pipeline.md`](../design/01-image-pipeline.md), [`06-ui-gap-analysis.md`](../design/06-ui-gap-analysis.md) §2, mock `routes/mobile/layers/*`, `routes/app/layers/*`, `state/layer-flow.svelte.ts`.

## Goal
The seven-step layers flow (source → cutout → objects → layers → gaps → material → cut) with views and reference as branches, rendered as phone steps below `md` and as the three-column studio (steps · bed · inspector + chat) at `md` and up, from one `LayerFlowState`.

## Work
- `lib/state/layer-flow.svelte.ts`: kind, regions + keep, layer stack + selection, gap rule + per-layer overrides, materials, device; derived kept %, material %, gap cards.
- `lib/content/layers.ts`: steps, kinds, gap choices, devices (copy only).
- Routes `/snap/layers/{source,cutout,objects,layers,gaps,material,cut,views,reference}` + `+layout.svelte` (step strip on phone, numbered tabs on studio).
- Components: StepStrip, MaskView, LayerList (Rokkit `List` + `Switch`), Hatch, Swatch, ExplodedStack, GapCard, DeviceRadio (Rokkit `Toggle`/`InputField`).
- Data: `/api/segment` + `/api/layers` (doc 04 #4–5); until they land, the flow runs on **app-drawn** fixtures. **Never** the mock's `static/layers/*` images (third-party derived).

## TDD
- State: every transition and derived value above, ≥ 90% lines.
- E2E: walk the seven steps on phone and studio; gap rule "use for all"; device switch re-plans with zero model calls.

## Exit
UI gate green on fixtures; then (HANDOFF) one user-owned layered photo → 4–10 layers → per-layer SVG on the live URL.
