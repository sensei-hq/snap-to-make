# Stage 12 — App shell: shared state + responsive layout · AUTO

Prereqs: Stages 01–11, Katachi rename. Design: [`docs/design/06-ui-gap-analysis.md`](../design/06-ui-gap-analysis.md) §4–5, mock `mockups/svelte` (`routes/mobile/+layout.svelte`, `routes/app/+layout.svelte`, `desktop/NavRail.svelte`).

## Goal
One route tree that renders the **phone column below 1024 px** and the **studio (rail + workspace + chat panel) at 1024 px and up**, with state that survives navigation between sections.

## Work
1. **Breakpoints**: `uno.config.js` theme `breakpoints: { md: '1024px', lg: '1320px' }` (the mock's). Layout switches use `md:` / `lt-md:` variants only; no JS width checks.
2. **App context** (`lib/state/app.svelte.ts` + `lib/state/context.ts`): one `AppState` created in `routes/snap/+layout.svelte` (`setContext`), holding `session`, `flow`, `trace` and `chat` (open/closed). Pages read it via `useApp()`; no page constructs its own `FlowState`/`TraceState`.
3. **Shell** (`routes/snap/+layout.svelte` + `lib/components/shell/*`):
   - Phone: `AppBar` (KatachiMark, title, subtitle, cost pill linking to the hood, theme toggle) · section tabs · page · docked composer.
   - Studio: `NavRail` (sections with Solar icons and `aria-current`, chat toggle, theme at the bottom) · page in a scrollable workspace · `ChatPanel` (Katachi chat + composer, 336 px, collapsible).
   - Sections: Workshop, Convert, Capture, Canvas, Watch, Batch (+ Hood from the pill).
4. **Titles**: every page sets `<svelte:head><title>Katachi · …</title>`.
5. **Entry**: `/` goes to `/snap/welcome` (the gate), the gate goes to `/snap`.

## TDD
- Unit: `AppState` holds one shared `FlowState`/`TraceState`; chat toggle; sections list (ids, hrefs, labels) in `lib/content/sections.ts`.
- Arch: pages under `routes/snap/*` must not `new FlowState(` / `new TraceState(` (extend `scripts/check-arch.mjs`).
- E2E (`tests/e2e/responsive.spec.ts`): at 390×844 the section tabs are visible and the rail is hidden; at 1280×800 the rail and chat panel are visible and the phone tabs hidden; navigating Workshop → Watch → Workshop keeps the trace pill value.

## Exit
`bun run verify` green, e2e green (existing 12 + responsive), screenshots of phone and studio layouts compared against the mock, recorded in the checklist §12.
