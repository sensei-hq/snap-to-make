# 08 — Roadmap

## 8.1 Hackathon week (P1 / P1+), Mon Oct 26 → Wed Nov 4, 9 PM ET (target: submit by **noon**)
Each day ends with a **demoable increment** recorded as a short clip (raw material for the final video).

| Day | Date | Goal | Requirements | Exit criteria |
|---|---|---|---|---|
| D0 | Mon 10/26 | Orientation + workshops; PRD frozen; API key; capture `samples/` (logo sketch + mug + card, phone on mat, 3 burn clips) | — | PRD v1, keys working, 10 sample photos with caliper truth |
| D1 | Tue 10/27 | **Spikes + skeleton.** Spark SceneAnalysis on samples; SAM masks → px/mm → Ø accuracy table; Muse Image art cleanup + preview; Voice relay hello-world. Scaffold `app/` (SvelteKit server routes), schemas (zod), trace ledger, budget guard | R-UN-1…4, R-AR-1/3 (spike), R-CV-2 (spike), R-PL-1/2, R-UT-1 | Accuracy within ±5%; one end-to-end curl: photo → masks → measurements |
| D2 | Wed 10/28 | **Geometry.** Templates (coaster, finger_box_open, ornament), nesting, DesignSpec → ObjectSpec → laser Impl, potrace trace → engrave art | R-DS-1…5, R-TR-1…3 | Unit tests green; the hero spec produces valid G-code |
| D3 | Thu 10/29 | **UI flow I.** Workshop screen, mic + captions, Scene card + Measure overlay, Plan card; orchestrator tool calls drive the cards | R-CV-1…6, R-UN-5/6, R-DS-7 | Voice → photo → measured plan in the browser |
| D4 | Fri 10/30 | **UI flow II.** Art picker, Preview, morph into the canvas, voice edits, Make bar (G-code/SVG/ZIP + preflight), Under-the-hood drawer + cost pill | R-AR-1…3/6, R-DS-6, R-MK-1…4, R-UT-1…3 | **Full hero journey works end to end** (feature freeze for P1) |
| D5 | Sat 10/31 | **Wow layer.** Burn Watch (recorded), Wonder batch job (ornaments), first-run gate; deploy to Cloudflare Workers | R-BW-1/3, R-WB-1…4, R-PL-3…5/7 | Public URL + invite code; batch demo works |
| D6 | Sun 11/1 | **Polish.** Workshop theme tokens, motion (mask burn-in, morph, develop), empty/error states; Glimmer offline (stretch); eval run on 10 samples | 07, R-GL-1/2 (P1+), R-BW-2 (P1+) | Looks like the mockups; eval table ready |
| D7 | Mon 11/2 | **Real burns + filming.** Burn the hero project on the Longer Ray 5; film the demo (screen + overhead camera); burn the ornaments | — | All footage captured |
| D8 | Tue 11/3 | **Story.** Edit the demo video (≤ 3 min), deck (10 slides), white paper (6–8 pages), README + architecture diagram | 09 | Draft package reviewed |
| D9 | Wed 11/4 | **Ship.** Final fixes, submit by noon ET, spare budget check, judges' invite code | — | Submitted ✓ |

### Cut order if behind (drop from the top)
1. Glimmer offline (R-GL-*)
2. Live Burn Watch (keep recorded)
3. Share card (R-AR-4), multi-turn preview refinement (R-AR-5)
4. Phone stand / sign templates (keep coaster, box, ornament)
5. Wonder batch (move to a "coming next" slide with a recorded run)

**Never cut:** voice → Spark scene → SAM measure → DesignSpec → Muse Image art + preview → canvas → G-code → Under the hood. That chain *is* the pitch.

### Daily rituals
- Morning: 15-min plan against this table; evening: record a 30-s clip + update the trace numbers.
- Watch the spend in the dashboard; it bills at $20 or Nov 1 beyond the free credits.

## 8.2 After the hackathon (ambitious, P2 → P3)
| Phase | Horizon | Theme | Highlights |
|---|---|---|---|
| **P2 · Burn-E v1** | Nov–Dec 2026 | Shippable product | Supabase auth + saved projects, Stripe plans (Maker/Seller), Standard-mode privacy + policy, **Web Serial machine streaming + auto-pause**, LightBurn/xTool/Glowforge export presets, 15 templates, mobile-first capture app, returning-user "My Workshop" |
| **P2.5 · Fit-anything** | Q1 2027 | Measurement superpowers | Multi-photo/short-video measuring (Spark video + SAM tracking), 3D fit targets (SAM 3D for objects), inserts for drawers/toolboxes ("Gridfinity for lasers"), material calibration from a test-grid photo (Spark reads burn darkness → power/speed) |
| **P3 · Maker OS** | 2027 | Beyond lasers | CNC (2.5D toolpaths), 3D printing (STL from parts), Cricut-native integration, **Ray-Ban/Oakley Meta glasses** hands-free capture (Wearables Device Access Toolkit), Meta AI Connector ("Hey Meta, ask Burn-E to make…"), marketplace for parametric designs, fine-tuned Glimmer "maker" model running fully on-device |
