# Stage 15 — Desktop editor + rail screens · AUTO (stretch for Nov 4)

Prereqs: Stages 12–13. Design: [`06-ui-gap-analysis.md`](../design/06-ui-gap-analysis.md) §3, mock `routes/app/*`, `state/shell.svelte.ts`, `components/desktop/*`.

## Goal
At `md` and up, the Canvas section becomes the full editor: floating toolbar, rulers + grid canvas with zoom and tool palette, Properties / Layers / Job panel, Katachi chat (one right panel at a time). Rail screens follow post-hackathon.

## Work
- `lib/state/editor.svelte.ts` (`ShellState` port): tool, op, tab, rightPanel, zoom, params (power/speed/passes), air assist, grid/annotations; chat messages with action cards that patch the editor state.
- Components on Rokkit: Toolbar/ToolbarGroup, Tabs, Range, Switch, List, Card, ChatMessage/ChatComposer.
- Rail screens: projects (needs Supabase auth + projects, P2), materials (device/material presets table), settings (devices, **density** via `vibe.density`), annotations.

## TDD
State transitions (tool/op/tab/panel/zoom/params/applyAct), e2e: editor at 1280×800 toggles panels and applies a chat action card.

## Exit
Editor usable at ≥ 1024 px with the phone canvas unchanged below it. Checklist §15.
