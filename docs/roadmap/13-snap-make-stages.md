# Stage 13 — Snap → Make stage routes (mock parity) · HANDOFF: hero journey on phone + studio

Prereqs: Stage 12. Design: [`06-ui-gap-analysis.md`](../design/06-ui-gap-analysis.md) §1, mock `routes/mobile/*`, `state/snap-session.svelte.ts`.

## Goal
Split the long `/snap` page into the mock's stages, each its own route, driven by the shared `FlowState`, with geometry derived in code from the measured scene.

| Route | Content |
|---|---|
| `/snap` | Workshop: captions, mic, suggestion chips (pick → heard text → capture), composer |
| `/snap/capture` | Camera with **source modes** (Photo · Upload · 6 views · Reference; the last three fork to the layers flow) |
| `/snap/scene` | Scene photo, role chips, **editable measurements**, Fix a number / Looks right |
| `/snap/plan` | Exploded view, material/device, parts **derived from the mug base** (coaster = mug + 13 mm), sheet fit, editable assumptions, Make it with… |
| `/snap/art` | Three takes, selected hero, re-roll count, use original |
| `/snap/preview` | Render, scene cycle, darker engraving, caption from geometry |
| `/snap/canvas` | Sheet from the design (not a fixture), lid offer, composer edits (`walls N mm taller`), preflight + live estimate, Simulate + Assembly, G-code/SVG |
| `/snap/watch` | Alert hides on acknowledge, selectable events, timeline scaled to the clip |
| `/snap/hood` | Under the hood (phone: sheet; studio: page), opened from the cost pill; trace from every route |

## TDD
- Domain: `deriveParts(mugBaseMm, wallHeightMm, lid)` (pure, in `domain/`), tested against the mock numbers.
- State: `FlowState.setMeasurement`, `raiseWalls`, `addLid/declineLid`, `runCommand` regex, art `reroll/useOriginal`, preview `nextScene/toggleEngraving`, watch `selectEvent`.
- E2E: hero journey walks the routes in order on phone and studio viewports.

## Exit
Gate green; hero journey on the live URL on a phone and a laptop (user verifies). Checklist §13.
