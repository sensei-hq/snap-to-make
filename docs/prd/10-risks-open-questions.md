# 10 — Risks & Open Questions

## 10.1 Risks
| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| 1 | Measurement accuracy from photos is too poor | Med | High | A reference card is required; minor-axis method for circles; editable values; Day-1 spike decides the tolerance we claim |
| 2 | SAM prompt misses the right object (e.g., the mug body instead of the base) | Med | Med | Spark writes specific `sam_prompt`s ("bottom rim of the mug"); point-prompt fallback; user tap-to-fix |
| 3 | Muse Image changes the sketch's character too much | Med | Low | Offer "use original"; low reasoning strength; strict style prompt; trace the original as a fallback |
| 4 | **No Meta TTS** | Certain | Low | Browser Web Speech API (on-device) + captions; state it plainly in the white paper; check whether the rules restrict non-Meta components |
| 5 | Wonder latency/cost | High | Low | Background only; one recorded run as a demo fallback |
| 6 | Video length limits/latency for Burn Watch | Med | Med | Clip ≤ 60 s, 480p; SAM on sampled frames; recorded mode for the demo |
| 7 | Rate limits (Muse Image 150 RPM; early Wonder 429s) | Low | Med | Backoff; pre-generate demo assets as a cache for the live judging URL |
| 8 | Free-credit data terms (Meta may use inputs) | Certain | Med | Our own media only; public-demo notice; Standard mode after the credits |
| 9 | Laser safety / liability | Low | High | Advisory-only language, a first-use safety notice, never imply unattended operation |
| 10 | Scope creep in 9 days | High | High | Cut order in 08; feature freeze end of D4 |
| 11 | Rokkit lacks a primitive a screen needs | Med | Med | Audit Rokkit at scaffold; build missing primitives in Rokkit style under `src/lib/components`; presentation stays props-in/events-out |
| 12 | Device geometry leaks into the Object layer, breaking $0 re-plan | Med | High | `domain/` emits no device geometry; the adapter contract suite runs against every registered adapter; re-plan test asserts the Object is unchanged when the target switches |

## 10.2 Open questions (resolve at orientation / D1)
1. Are **non-Meta models or services** allowed in the product (browser TTS, potrace)? Does mixing reduce scores?
2. Demo video **maximum length** and format; are live URLs, repos or open source required?
3. Do **open-weights** models (Glimmer, Spark Open) count toward "Use of Meta AI tooling"?
4. Are the judging weights and prize split confirmed?
5. Is the Batch API documented, and is there a discount (useful for Wonder jobs)?
6. Can the Voice Transcribe realtime socket accept browser connections with short-lived tokens (would remove the relay)?
7. Product name: keep **Burn-E** or brand the hackathon entry **"Snap → Make"**?
8. Do we ship a **phone-first** capture page (QR handoff from the laptop) in P1 or P1+?
