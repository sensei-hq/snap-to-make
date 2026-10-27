# Stage 07 — Playback: fabrication simulation + assembly · HANDOFF

Prereqs: Stage 06 (Simulator adapter from Stage 03). PRD: R-MK-3 (preflight trust), plan §demo/playback. No hardware, no downloads required.

## Build

- Canvas gains mode toggle **Design · Simulate · Export** (Rokkit Toggle, props-only).
- `SimulateView` (presentation) + `playback.svelte.ts` (state, Stage 04): virtual bed at selected device workspace; toolhead/laser dot traverses `preview()` timeline in order (engrave→cut, part-by-part, sheet-by-sheet); scorch reveal (engrave fades in, cuts burn through); play/pause/scrub, 1×/4×/16×; elapsed vs estimated; current-op label ("Engraving coaster 2 of 4"); sheet advance.
- `AssemblyPlayer`: exploded ↔ assembled isometric SVG slider from Object assembly + Impl joints; step list ("Slot long walls into base…") per Impl.
- Stub adapters playable too: switching target re-plans and Simulate follows the new layout (Cricut mat / build plate outline).

## TDD / verification

- Playback state tests (fake timers): play advances op index, scrub seeks deterministically, speed scales, end state reached, op labels match timeline.
- Simulation-fidelity test: timeline op order equals laser plan op order (Stage 03 fixture).
- Playwright `playback.spec.ts`: open Simulate with seeded demo session (Stage 00 seed), play advances label, scrub seeks, assembly slider assembles. **This spec must pass with no device and no Meta key.**

## Exit criteria

- Tests + `playback.spec.ts` green.

## HANDOFF — user verifies (~2 min)

On the live URL with no device attached: hit Simulate, watch engrave-then-cut, drag the assembly slider. Say `go` for Stage 08.
