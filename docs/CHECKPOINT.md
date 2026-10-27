# Checkpoint — Snap → Make Phase 1

- Slice: Convert SAM segment overlays (code complete, undeployed).
- Done: SAM 3.1 live probe confirmed real segment output (boxes + encoded masks); parseSamBoxes (2 tests), /api/segment live-with-fixture-fallback, tapping a dissection piece highlights its segment region on the photo (accent overlay + label); state caches overlay per selection.
- Gates (sandbox): 70 unit tests pass, arch/lint/check 0 errors, coverage 91.08%.
- Blocked this run: e2e + deploy need unsandboxed execution; approval prompts disabled in this session.
- Also ready: docs/submission/checklist.md (package tracker).
- Next command: `cd app && bun run test:e2e && bun run deploy` in an approval-enabled session, then user retest on /snap/convert.
- Open: caliper truth samples, Ray 5 burn film, final submission assembly.
- Known broken: none in code; deployed site still at prior version (no SAM overlay yet).
