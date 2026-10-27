# Stage 04 — State layer + presentation shell · AUTO

Prereqs: Stage 03. Enforces the user's separation rule. PRD screens S1/S10 shell, `docs/prd/06-screens.md`.

## Architecture rule (enforced by tests + grep gate)

- **State** = `app/src/lib/state/*.svelte.ts` rune classes. Own ALL transitions/reactivity/async: `session.svelte.ts` (invite/attestation/budget), `conversation.svelte.ts` (transcript/captions/slots intent·device·material·thickness·dims·art), `design.svelte.ts` (Scene→Object→selected Target→ImplPlan), `playback.svelte.ts` (play/pause/scrub/speed/current op), `trace.svelte.ts` (entries, totals, cost pill).
- **Presentation** = `src/lib/components/*.svelte` + route pages. Props in, callbacks/events out. Forbidden in components/routes: `fetch(`, direct store writes to another component's state, Meta/Supabase imports. Rokkit primitives only for visuals.
- State classes are unit-testable without rendering (plain Vitest, fake timers for playback).

## TDD sequence

1. State transition tests first (red): conversation slot-filling from transcript fixture ("make four coasters 3mm birch" → intent/qty/material/thickness); design flow Scene→Object→Impl selection→re-plan keeps Object; playback play→advance→pause→scrub→speed; trace totals sum + budget trip at cap.
2. Implement state classes until green.
3. Presentation components (Workshop shell: `BurnEAvatar`, `MicButton`, `CaptionStream`, `SuggestionChips`, cost pill, Under-the-hood drawer shell) — props-only; component tests assert render-from-props + emitted events, no internal fetching (mock fetch must not be called).
4. Grep gate script in `package.json` (`test:arch`): fails if `fetch(` or `$lib/server` appears under `components/` or routes' `<script>` presentation files.

## Exit criteria

- State tests green, coverage `state/` ≥90%; component tests green; `test:arch` green. Proceed unattended to Stage 05.
