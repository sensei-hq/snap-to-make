# Checkpoint — Katachi · Snap → Make Phase 1

- Slice: screens from the artboards — image → layers flow follows `mockups/desktop` D1–D6 and `mockups/mobile` 01–09. Code complete, committed on main (not pushed).
- Done: studio frame = icon rail (kept) · top bar with six step tabs (Import · Segment · Layers · Gaps · 6 views · Output; cutout lights Segment, material lights Layers) · left controls · work on graph paper with actions bottom-right · Katachi column (page context card above the chat, no tabs). Phone = back chevron, seven-step strip, one column with Katachi's note inline, actions docked above a bottom icon nav (sections + Katachi sheet with the composer). Chat on Rokkit ChatTimeline/ChatMessage/ChatComposer (agent dot, user bubble, one-line composer with send/voice in its toolbar). All nine step pages rebuilt on `StepScreen` + `stepContext()`.
- Gates: 173 unit, 40/40 e2e, arch/lint/check 0 errors, coverage 91 % stmts.
- Next: `cd app && bun run verify:full`, then push and deploy (`bun run deploy`); then doc 04 #1–7 so layers run on real uploads.
- Open: D5 parts schematic drawing not built (rows + joinery are); D6 device rows lack adapter/status lines; D3 exploded stack is not clickable (pick from the left list); "Browse files" links to the capture upload rather than a drop target on the card; Convert's own chat still inline; editor Properties panel separate from the Katachi column; repo not registered as a Sensei workspace.
- Known broken: none in tests.
