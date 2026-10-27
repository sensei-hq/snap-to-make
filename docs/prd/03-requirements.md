# 03 — Requirements

IDs: `R-<module>-<n>`. Phase: **P1** (demo-critical) · **P1+** (stretch this week) · **P2** · **P3**. Each P1 requirement has acceptance criteria (AC).

## Module map
| Module | Name | Primary model(s) | Phase |
|---|---|---|---|
| CV | Conversation & Voice | Voice Transcribe, Spark | P1 |
| SN | Snap (capture) | — | P1 |
| UN | Understand & Measure | Spark 1.3, SAM 3.1 | P1 |
| TR | Trace (vectorize) | SAM 3.1 + potrace | P1 |
| DS | Design generation | Spark 1.3 (structured output) + deterministic geometry | P1 |
| AR | Art & Preview | Muse Image | P1 |
| MK | Make (output) | Device adapters (code): G-code/SVG/.burn | P1 |
| BW | Burn Watch | Spark 1.3, SAM 3.1 (video) | P1 (recorded) / P1+ (live) |
| WB | Wonder Batch projects | Muse Wonder | P1+ |
| GL | Glimmer offline copilot | Muse Glimmer (local) | P1+ |
| UT | Under-the-hood trace & cost | all | P1 |
| PL | Platform: proxy, budget, privacy | — | P1 |

---

## CV — Conversation & Voice
| ID | Requirement | Phase |
|---|---|---|
| R-CV-1 | The app opens to the **sparse workshop screen** (J1 step 1, S1): Burn-E avatar or waveform, mic button, text input always visible. | P1 |
| R-CV-2 | **Push-to-talk** voice capture streams 16-bit PCM (24 kHz) to the server, which relays to Muse Voice Transcribe realtime (`PUSH_TO_TALK` mode) with `keywords` biasing (maker vocabulary: kerf, finger joint, birch, basswood, plywood, acrylic, engrave, Longer Ray, xTool, Cricut…). | P1 |
| R-CV-3 | Partial transcripts render live; the final transcript is sent as a user turn to the conversation orchestrator (Spark 1.3). | P1 |
| R-CV-4 | Burn-E's replies render as **styled captions**. Spoken output uses the browser's built-in speech synthesis (Web Speech API, on-device, not a cloud model), toggleable, default on for the demo. *(Meta has no TTS; see 10-risks.)* | P1 |
| R-CV-5 | The orchestrator tracks the conversation slots: **intent, device, material, thickness, dimensions/fit target, art** and invokes **UI toolkit actions** (show scene card, measure overlay, plan card, art picker, preview, canvas) via Spark tool calls. | P1 |
| R-CV-6 | Burn-E has the **workshop buddy** personality: brief, opinionated, uses maker lingo, never blocks on missing info, proposes defaults. | P1 |
| R-CV-7 | Hands-free "Hey Burn-E" wake word, ENDPOINTING mode. | P2 |

**AC (P1):** speaking "make four coasters 3 mm birch" produces a correct transcript within ~1 s of release, and the orchestrator fills `{intent: coasters, qty: 4, material: birch, thickness: 3}`.

## SN — Snap (capture)
| ID | Requirement | Phase |
|---|---|---|
| R-SN-1 | Capture or upload **1–4 photos** (camera on mobile/laptop; file picker or drag-drop on desktop). | P1 |
| R-SN-2 | Optional **short video** (≤ 15 s, MP4) for multi-angle measuring or a narrated walkthrough. | P1+ |
| R-SN-3 | Client downsizes images to ≤ 2048 px long edge, strips EXIF location data. | P1 |
| R-SN-4 | Capture tips overlay: "include a credit card or ruler for accurate size", "shoot from straight above". | P1 |

## UN — Understand & Measure
| ID | Requirement | Phase |
|---|---|---|
| R-UN-1 | Spark 1.3 returns a **`SceneAnalysis` JSON** (structured output): objects (label, role: `art`/`fit_target`/`reference`/`other`, bbox, short description), the detected reference type and known size, plus notes. | P1 |
| R-UN-2 | Known references: **ID-1 card 85.60 × 53.98 mm**, US letter paper, A4, a ruler or cutting mat (grid pitch read by Spark), US quarter (24.26 mm). | P1 |
| R-UN-3 | For each reference and fit-target, call **SAM 3.1** with a text prompt (from the Spark label) to get a pixel-exact mask; compute the scale (**px/mm**) from the reference mask's fitted rectangle (min-area rect), correcting for mild perspective with the card's aspect ratio. | P1 |
| R-UN-4 | Fit-target dimensions (diameter for round, W×H for rectangular) are computed **in code from the SAM masks + scale**, not guessed by the LLM. Spark sanity-checks ("a mug base of 82 mm is plausible") and assigns a confidence. | P1 |
| R-UN-5 | The **Measure overlay** shows glowing masks and dimension callouts; the user can tap any number to correct it. | P1 |
| R-UN-6 | No reference detected → Burn-E asks for one or offers "assume standard mug (Ø 80 mm)". | P1 |

**AC:** with a card in frame, shot within ~20° of top-down, the measured mug base is within ±5% of a caliper reading (Day-1 spike), with a target of ±3%.

## TR — Trace (vectorize)
| ID | Requirement | Phase |
|---|---|---|
| R-TR-1 | **Art tracing:** SAM 3.1 mask of the art region → crop → threshold (or the Muse Image cleaned art, R-AR-1) → **potrace** → SVG paths → normalised closed paths → `SurfaceArt` on the Object (`engrave-surface` op). | P1 |
| R-TR-2 | **Outline tracing:** a SAM mask contour of an object (e.g., a phone or a hand-drawn shape) → simplified closed path (Ramer–Douglas–Peucker, tolerance 0.2 mm) → cut layer, scaled with px/mm. | P1 |
| R-TR-3 | Traced paths are normalized (closed, deduplicated, min feature 0.5 mm) and placed at a user-chosen size. | P1 |
| R-TR-4 | Fill-engrave (raster/hatch) for solid art areas: hatch fill at 0.1 mm line pitch. | P1+ |

## DS — Design generation
| ID | Requirement | Phase |
|---|---|---|
| R-DS-1 | Spark 1.3 converts intent + measurements into a **`DesignSpec` JSON** (strict schema): parts (name, qty, primitive: `circle`/`rect`/`rounded_rect`/`traced_outline`, dimensions mm), joints (finger joints between named edges, material thickness, kerf), engrave placements (art id, size, position), sheet, material, device. | P1 |
| R-DS-2 | A **deterministic geometry generator** (TypeScript, `snap-web/src/lib/domain/geometry.ts`) turns the `DesignSpec` into a device-agnostic `ObjectSpec`; the device adapter (`src/lib/devices/laser.ts`) renders it into pieces: rectangles, circles, finger-joint edges, traced paths. **The LLM never emits raw coordinates.** | P1 |
| R-DS-3 | Built-in parametric templates: **coaster (round/square/hex)**, **open box / holder with finger joints**, **ornament (star/circle/custom outline)**, **phone/tablet stand**, **name sign**. | P1 (coaster, box, ornament); P1+ (stand, sign) |
| R-DS-4 | Kerf compensation (default 0.1 mm diode laser) and clearance (default +1 mm for fit targets) are applied by the generator. | P1 |
| R-DS-5 | Simple **nesting** (shelf/row packing, 3 mm spacing) onto the sheet size; overflow creates new sheets (`src/lib/domain/nesting.ts`). | P1 |
| R-DS-6 | **Edit by voice:** Spark tool calls map utterances to canvas operations: `resize_part`, `set_param`, `add_engrave`, `remove_part`, `duplicate`, `rotate`, `change_material`. | P1 |
| R-DS-7 | **Build plan card**: an exploded parts list with dimensions, generated from `DesignSpec` (an SVG illustration, not an image model). | P1 |

**AC:** "4 coasters Ø 95 mm + finger-joint holder for 4 × 3 mm coasters" produces valid pieces that the laser adapter emits as G-code; the holder's inner width is 95 + 2 mm and its inner depth is 4 × 3 + 2 mm.

## AR — Art & Preview (Muse Image)
| ID | Requirement | Phase |
|---|---|---|
| R-AR-1 | **Art cleanup:** the sketch crop (from the SAM bbox) is sent to `muse-image-1.0` edit with an instruction like *"Redraw as clean, bold, single-color black line art on pure white, laser-engraving friendly, keep the composition"*; it returns **3 variants** (`n=3`), and the user picks one. | P1 |
| R-AR-2 | **Generate art from words** ("a mountain line drawing", "Maya in script lettering") with the same laser-friendly style constraints. | P1 |
| R-AR-3 | **Photoreal preview:** Responses API with ordered, captioned references: [1] chosen art, [2] material swatch photo (birch/basswood/walnut/acrylic library), [3] optional scene photo from the user; the prompt describes parts, dimensions and engraving. One render, plus a re-roll option. | P1 |
| R-AR-4 | **Share card** (before/after, project name, "Made with Burn-E") for social posts. | P1+ |
| R-AR-5 | Multi-turn refinement ("make the engraving darker", "put it on a kitchen counter") using `previous_response_id`. | P1+ |
| R-AR-6 | Disable `enable_shell` and `enable_web_search` for art cleanup (determinism, cost/latency); allow search for "in the style of [public-domain style]" prompts. | P1 |

## MK — Make (output)
| ID | Requirement | Phase |
|---|---|---|
| R-MK-1 | G-code (GRBL) emitted by the laser adapter (`src/lib/devices/laser.ts`) with the selected **device + material + thickness preset** (Longer Ray 5 10 W / 20 W presets as data). Engrave before cut. | P1 |
| R-MK-2 | **SVG export** (cut = red hairline, engrave = black/blue fill) for Cricut, Glowforge, xTool and LightBurn. | P1 |
| R-MK-3 | Pre-flight checks: parts within the work area, minimum feature size, cut paths closed, estimated burn time. Burn-E narrates problems ("your holder is taller than the 400 mm bed, so I split it"). | P1 |
| R-MK-4 | Download `.burn` project + `.gc` files as a ZIP. | P1 |
| R-MK-5 | Stream G-code to the machine via **Web Serial** (GRBL). | P2 |

## BW — Burn Watch
| ID | Requirement | Phase |
|---|---|---|
| R-BW-1 | **Recorded mode (P1):** upload a burn clip (≤ 60 s) → SAM 3.1 video tracking of "workpiece" plus Spark 1.3 analysis of the clip → a timeline of events (`flare`, `smoke_heavy`, `workpiece_shift`, `incomplete_cut`, `ok`) with timestamps and the frames highlighted. | P1 |
| R-BW-2 | **Live mode (P1+):** the phone browser streams a frame every 2 s → Spark (low `reasoning_effort`) → alert banner + sound; a SAM tracking overlay for the workpiece. | P1+ |
| R-BW-3 | Alerts are advisory ("Pause and check"); never claim safety. A **laser safety disclaimer** is shown on the first use. | P1 |
| R-BW-4 | Auto-pause via machine connection. | P2 |

## WB — Wonder Batch projects
| ID | Requirement | Phase |
|---|---|---|
| R-WB-1 | Start a **background job** with `muse-wonder-1.0` (Responses API, background mode) from a template + data (CSV of names, or a list). | P1+ |
| R-WB-2 | Wonder uses **our tools** (function calls): `generate_variant(spec)`, `nest(parts, sheet)`, `estimate_burn_time(sheet)`, `web_search` (materials pricing), `write_report`. | P1+ |
| R-WB-3 | A job dashboard shows progress steps (from Wonder's tool-call stream) and the final **production plan**: sheets, burn order, time, materials and cost list. | P1+ |
| R-WB-4 | Never on the interactive path; the user is notified on completion. | P1+ |

## GL — Glimmer offline copilot
| ID | Requirement | Phase |
|---|---|---|
| R-GL-1 | If the API is unreachable or the user toggles "Shop offline", canvas commands (R-DS-6) route to a **local Muse Glimmer 30B** (LM Studio/Ollama, OpenAI-compatible endpoint on localhost) with the same tool schema. | P1+ |
| R-GL-2 | The UI marks which features need the cloud (vision, image, voice). | P1+ |

## UT — Under the hood (the judges' view)
| ID | Requirement | Phase |
|---|---|---|
| R-UT-1 | An **"Under the hood" drawer** lists every model call in the session: model, purpose, latency, tokens/images/frames, **cost**, and a one-line rationale ("SAM 3.1: outline the mug base"). | P1 |
| R-UT-2 | A session cost meter in the corner (e.g., "$0.11 · 5 models"). | P1 |
| R-UT-3 | Export the trace as JSON (for the white paper's numbers). | P1 |

## PL — Platform
| ID | Requirement | Phase |
|---|---|---|
| R-PL-1 | **All Meta API calls go through the Burn-E server** (the API key never reaches the browser), including the Voice Transcribe WebSocket relay. | P1 |
| R-PL-2 | **Budget guard:** per-session and per-day spend caps (default $1/session, $10/day for the demo deployment), plus a global kill switch. | P1 |
| R-PL-3 | **Privacy:** while on hackathon free credits, inputs may be used by Meta, so the demo uses our own media; show a notice "Don't upload personal photos" on the public demo. P2: Standard mode plus a privacy policy. | P1 |
| R-PL-4 | Demo access via an **invite code** (judges get one); no full auth in P1. | P1 |
| R-PL-5 | 18+ attestation checkbox on first launch (ToS). | P1 |
| R-PL-6 | Supabase auth, saved projects ("My Workshop", J7) and subscriptions for the Maker/Seller plans (01 §1.6). | P2 |
| R-PL-7 | Retry with exponential backoff on 429/503; graceful degraded modes (e.g., skip the preview if Muse Image fails). | P1 |
