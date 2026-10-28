# 09 — Demo, Deck, White Paper & Submission

## 9.1 Judging map (reported weights; confirm against the Official Rules)
| Criterion | Weight* | How Katachi scores |
|---|---|---|
| Impact | 30% | Millions of idle desktop lasers/cutters; idea → object in minutes; paid tiers; Cricut reach |
| Use of Meta AI tooling | 25% | **6 Meta models**, each in its strongest role; live "Under the hood" proof with per-call cost |
| Demo | 25% | A physical object at the end; glowing SAM masks; photoreal preview; voice-driven |
| Technical depth | 20% | Structured-output orchestration, SAM-based metrology, deterministic geometry, video tracking, background agent, open-weights offline mode, eval table |
*From a secondary source (reconscribe.com); the official weights are pending.

## 9.2 Demo video (≤ 3:00): shot list
| Time | Shot | Voiceover / on-screen |
|---|---|---|
| 0:00–0:12 | Cold open: hands put a pencil sketch, a mug and a credit card on a birch bench. "Hey Katachi, coasters for Maya." | Title: **Show it. Say it. Burn it.** |
| 0:12–0:40 | Screen: photo → masks burn in (blue, red, amber) → "Ø 82 mm ±2" | "SAM 3.1 outlines everything; Spark measures against the card." |
| 0:40–1:05 | Voice: "four coasters, 3 mm birch, finger-joint holder" → Plan card with assumptions | "Muse Spark plans the parts; our code builds exact geometry." |
| 1:05–1:30 | Art picker (3 variants) → Preview develops | "Muse Image cleans the sketch and shows the finished piece before any wood is cut." |
| 1:30–1:50 | Morph to canvas, "walls 5 mm taller", Make → G-code; Under-the-hood drawer: "5 models · $0.11" | |
| 1:50–2:15 | Overhead: the laser burning (time-lapse); Burn Watch flags a flare | "Spark and SAM watch the burn." |
| 2:15–2:35 | Batch: 40 names → Wonder plan (4 sheets, 3 h 10 m, $18) → ornaments time-lapse | "Muse Wonder runs the whole production plan in the background." |
| 2:35–2:50 | Finished coasters in hand next to the original sketch; offline badge (Glimmer) | "Six Meta models. One workshop buddy." |
| 2:50–3:00 | End card: logo, URL, "Powered by Meta's Muse models" | |

## 9.3 Pitch deck (10 slides, Workshop template)
1. **Title:** Katachi: Show it. Say it. Burn it. (hero photo: sketch → coasters)
2. **Problem:** millions of makers own cutters; design is the wall (3 pains: measure, trace, imagine)
3. **Demo moment:** 4-frame strip (photo → masks → preview → object)
4. **How it works:** EAR · EYE · BRAIN · HAND · IMAGINATION diagram with model chips
5. **Why Meta:** a table of model → job → why it's the best fit (from 04)
6. **Models perceive, code builds:** the precision story (measurement accuracy table, deterministic geometry)
7. **Beyond one design:** Wonder batch production plan + Burn Watch
8. **Under the hood:** real trace numbers: calls, latency, $/design, margin
9. **Business:** personas, pricing ($7.99 Maker), roadmap P2/P3 (glasses, machine streaming, Maker OS)
10. **Team & ask:** Jerry, the builder's story (woodworker + engineer)

## 9.4 White paper outline (6–8 pages): "From Pixels to Parts: Orchestrating Meta's Muse Models for Physical Making"
1. Abstract (1 paragraph)
2. The design gap in consumer fabrication
3. System overview (Figure 1: model orchestration)
4. Perception: Spark scene understanding + SAM 3.1 metrology (method, accuracy table on 10 samples)
5. Reasoning: structured-output DesignSpec, models choose and code computes (schema excerpt)
6. Imagination: Muse Image for art cleanup and previews (prompt design, reference ordering)
7. Operations: Burn Watch (video tracking) and Wonder production planning (agent tool loop)
8. Cost, latency and privacy (the trace table; free-credit/Contributor data terms; budget guard)
9. Limitations and future work (P2/P3)
10. Appendix: schemas, prompts, and how it was built

## 9.5 Submission checklist
- [ ] Track: **Indie** · Theme: **Build for Your World** (mention Push the Frontier: manufacturing)
- [ ] Demo video ≤ 3 min (check the official limit), captions on
- [ ] Live URL + invite code for judges; budget guard on; kill switch tested
- [ ] Repo/README with the architecture diagram and "which Meta model does what"
- [ ] Deck PDF + white paper PDF (Workshop template)
- [ ] Under-the-hood trace export + eval table
- [ ] Credits/attribution: the toolchain stated honestly (01 §3 of the submission notes), "AI preview" labels; laser safety note
- [ ] Submitted by **Nov 4, noon ET**
