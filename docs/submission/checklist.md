# Submission package — final checklist

## Ready (agent-produced)
- [x] Live demo: https://snap-to-make.sensei-hq.com/snap (+ /snap/convert), invite DEMO-JUDGES
- [x] White paper draft: docs/submission/white-paper.md ([TRACE] filled from live run)
- [x] Deck outline: docs/submission/deck-outline.md
- [x] Trace export: docs/submission/trace-export.json (Spark 4,955 ms / $0.0057)
- [x] Sample conversion study: 32/33 convertible (docs/sample, git-ignored)

## Pending deploy (approval-enabled session)
- [ ] `cd app && bun run test:e2e && bun run deploy` — ships SAM segment overlays on Convert
- [ ] Retest /snap/convert: tap a piece -> its region highlights on the photo

## Needs you (physical / judgement)
- [ ] 10 sample photos + caliper truth -> samples/truth.csv -> fill [EVAL] table
- [ ] Burn downloaded G-code on the Ray 5; check holder fit (inner 97x14 mm); film it
- [ ] Demo video (<=3 min) from the burn + screen capture of Simulate/Assembly
- [ ] Final read of white paper + deck; submit
