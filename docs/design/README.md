# docs/design: how Snap → Make turns a picture into parts

The PRD (`docs/prd/`) says *what* we build. This folder says *how*:

- how an image is broken down;
- which Muse model does which job;
- how the output reaches a machine.

Read in order:

| Doc | What it covers |
|---|---|
| [01-image-pipeline.md](01-image-pipeline.md) | The stages from "image in" to "layers / parts out", with data contracts and where the user is asked |
| [02-muse-models.md](02-muse-models.md) | Model-by-stage matrix: which Muse model, why, call shape, cost, fallback |
| [03-device-adapters.md](03-device-adapters.md) | Object → Impl architecture. Adapters split into planner, emitter and connector so Cricut, 3D printers, CNC and more plug in after the hackathon |
| [04-gap-analysis.md](04-gap-analysis.md) | What the code does today vs what this design needs, file by file, in build order |
| [05-sketch-to-make.md](05-sketch-to-make.md) | Phase 2: sketch → interpreted model → style + devices → full build |
| [06-ui-gap-analysis.md](06-ui-gap-analysis.md) | The app's screens vs the mockups: phone and desktop, responsive layout, shared state, asset rule, build order (roadmap 12–15) |

Mockups for these flows:

- `mockups/svelte` (runnable SvelteKit);
- the "Katachi · Snap → Make" design canvas (Overview, Mobile Snap → Make, Mobile Image → Layers, Desktop Image → Layers).

## Three rules carried from the PRD

1. **Models perceive, reason and imagine; code measures and builds geometry.** No model ever emits a coordinate that is cut. Masks come from SAM, and everything after the mask is code.
2. **Ask at the forks, default everywhere else.** The user is asked only where the photo cannot answer:
   - which regions to keep;
   - merge or split a colour group;
   - what fills the hidden areas;
   - which material and which device.
   Every question comes with a proposed default.
3. **One Object, many Impls.** The analysis produces a device-agnostic Object (layers, parts, paths in mm). Changing the device re-plans in code with zero model calls.
