# Stage 10 — E2E, eval, deploy, submission package · HANDOFF ×2

Prereqs: Stage 09. PRD: `docs/prd/09-demo-and-submission.md`, roadmap D6–D9.

## E2E suite (Playwright, `app/tests/e2e/`, `bun run test:e2e`)

- `smoke.spec.ts` (Stage 01) · `hero.spec.ts` (Stages 06–08) · `playback.spec.ts` (Stage 07) · `impl-switch.spec.ts` (Laser→Cricut re-plan, no new trace cost) · `gate-and-guard.spec.ts` (Stage 09) · `watch.spec.ts` (Stage 09).
- Config: `playwright.config.ts` boots `bun run dev` + local Supabase (Stage 00), seeded DEMO-JUDGES session; Meta APIs mocked by route interception by default, live mode only with `E2E_LIVE=1` + key. Traces/videos on failure. All specs green is a hard gate for both handoffs below.

## Eval + polish (D6)

- Eval run: 10 `samples/` photos with caliper truth → accuracy table (claim only what it supports). Motion/theme pass vs `docs/mockups/Burn-E.html` (mask burn-in, morph, develop). First real burn on Ray 5; simulation-vs-burn order comparison recorded.

## Deploy

- Build (`bun run build`), Cloudflare Worker deploy (`wrangler`), `META_API_KEY` + Supabase service key as Worker secrets, public URL + judges invite live, budget/kill-switch verified on the public URL (not just local).

## HANDOFF 1 — Draft package (EOD D7 Mon Nov 2)

Demo video ≤3min (opens on Simulate → cuts to real burn; shot list PRD 09 §9.2), 10-slide deck, white paper 6–8pp (incl. Object→Impl + adapter section), README + architecture diagram, trace export JSON, eval table. User watches video once + opens every link in a clean browser. **Stop here unattended.**

## HANDOFF 2 — Final submission (EOD D8 Tue Nov 3)

Only Handoff-1 fixes. Re-verify public URL + invite + budget. Submit; record receipt in checklist §10. D9 (Wed Nov 4): buffer only, morning smoke check.
