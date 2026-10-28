# Checkpoint — Katachi · Snap → Make Phase 1

- Slice: Stages 12–15 (app shell, Snap → Make stage routes, image → layers UI, desktop editor + tools). Code complete, pushed, deployed.
- Done: shared AppState; phone < 1024 px / studio ≥ 1024 px; stage routes with geometry derived from the measured mug; canvas from the real plan; layers flow (7 steps + views/reference) on the app's own code-drawn fixture; editor toolbar + properties panel; materials, annotations, settings (density).
- Gates: 154 unit, 30/30 e2e, arch/lint/check 0 errors, coverage 92%, rokkit doctor PASS (chart WARN only), dbd doctor clean.
- Next command: doc 04 #1–7 (SAM masks → raster → layer grading → vectorise) so `/snap/layers/*` runs on real uploads; doc 04 #8 so the laser adapter emits every holder wall.
- Open: chat action cards and rulers in the editor; projects screen (P2 auth). User HANDOFFs: hero on the live URL (phone + laptop), a user-owned layered photo through the layers flow.
- Known broken: none in tests. Dev-only: after a Vite dependency re-optimise the theme can reset to dark (Rokkit vibe default re-evaluated); normal reloads and navigation keep the saved mode.
