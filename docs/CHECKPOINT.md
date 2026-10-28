# Checkpoint — Katachi · Snap → Make Phase 1

- Slice: Stage 12 app shell + responsive layout (done) and the first Stage 13 flow fixes (hood route, chips, camera source modes). Pushed, not yet deployed.
- Done: Burn-E → Katachi rename committed; brand colours are Rokkit tokens; UI gap analysis `docs/design/06-ui-gap-analysis.md`; roadmap stages 12–15; plan decisions (responsive, shared state). Shared `AppState` via `useApp()`; phone tabs + docked composer below 1024 px, studio rail + Katachi chat panel from 1024 px.
- Gates: 123 unit, 20/20 e2e, arch/lint/check 0 errors, coverage ≥ 90% on domain/devices/state, rokkit doctor PASS (chart WARN only).
- Next command: Stage 13 — `docs/roadmap/13-snap-make-stages.md` (scene, plan, art, preview routes; `deriveParts()` from the measured mug; canvas from the design). Then `cd app && bun run deploy`.
- Open: Stage 14 layers UI waits on `docs/design/04-gap-analysis.md` #1–7; mock `static/layers/*` images are third-party derived and never ship. Rokkit Button `target="_self"` default breaks SvelteKit client navigation — worth fixing in Rokkit.
- Known broken: none in code. Live site still serves the pre-shell build until the next deploy.
