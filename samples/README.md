# samples/ — D0 capture set (owner: Jerry, physical)
Capture on the bench, phone ~top-down: logo sketch + mug + ID-1 card in one frame.
Record caliper truth in `truth.csv` (id,object,truth_mm). Target: 10 photos.
Run eval: `cd app && bun run test:unit -- src/lib/domain/eval.spec.ts` (fixtures) —
live eval replaces fixtures with per-photo mask px from SAM once META_API_KEY is set.
