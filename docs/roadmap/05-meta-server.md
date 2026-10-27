# Stage 05 — Meta server routes + guard + trace · AUTO (needs META_API_KEY)

Prereqs: Stage 04, local Supabase up (Stage 00). PRD: R-PL-1/2/3/5/7, R-CV-2/3, R-UT-1..3, `docs/prd/04-model-orchestration.md` §§4.2/4.4/4.5. All Meta calls server-side only.

## Files

- `src/lib/server/meta/{client,spark,sam,image,voice-relay,wonder}.ts` — OpenAI-compatible client `baseURL https://api.meta.ai/v1`, models `muse-spark-1.3|muse-wonder-1.0|muse-image-1.0|sam-3.1|muse-voice-transcribe-1.0`. Key from server env only.
- `src/lib/server/vision/{scale,contour,trace}.ts` — mask→px/mm glue over Stage 02 math, RDP simplify (0.2mm), potrace invoke.
- `src/lib/server/guard.ts` — invite-code check vs `snap.invites` + 18+ attestation → signed session cookie (`snap.sessions` row), budget caps ($1/session, $10/day, env-overridable), kill switch (`BURN_E_KILL_SWITCH=1` → 503 friendly), rate limit, 429/503 backoff (max 3).
- `src/lib/server/trace.ts` — every Meta call appends `snap.trace_events` (model/purpose/latency/units/cost) + updates session spend; export JSON.
- Routes: `src/routes/api/{scene,design,art,preview,watch,batch}/+server.ts`, `src/routes/ws/voice/` relay (server holds key; browser streams PCM 24kHz).

## TDD sequence

1. Guard tests (red first): wrong invite rejected, no-attestation rejected, cap trip, kill switch, backoff retries then degrades.
2. Trace tests: fake Meta client → ledger rows written, cost totals match pill math, export shape valid.
3. Route contract tests with **mocked Meta client** (no live key in CI): scene route returns strict `SceneAnalysis` (schema-validated, invalid model output → 502 with fallback), design route returns `DesignSpec`; fallbacks per PRD 04 §4.4 (no-reference ask, SAM-empty bbox crop, Image policy-violation skip).
4. Live smoke (manual, key present): one `curl` photo → masks → measurements; record in checklist. Never commit keys/responses with user media.

## Exit criteria

- Guard/trace/route tests green (mocked); live curl smoke recorded if key available (else mark [!] blocked-on-key and proceed to Stage 06 with mocks — UI must not depend on live calls). 
