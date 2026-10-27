# 04 — Model Orchestration

> The heart of the pitch: **each Meta model does the job it's uniquely best at, and plain code does what must be exact.**
> Rule of thumb: *models perceive, reason and imagine; code measures and builds geometry.*

Base URL `https://api.meta.ai/v1` (OpenAI-compatible; we use the official `openai` npm SDK with `baseURL`). Model IDs: `muse-spark-1.3`, `muse-wonder-1.0`, `muse-image-1.0`, `sam-3.1`, `muse-voice-transcribe-1.0`. Muse Glimmer runs locally (no API ID).

## 4.1 The pipeline at a glance

```
   EAR                 EYE + BRAIN                      HAND                     IMAGINATION
 Voice Transcribe ──► Spark 1.3 orchestrator ──tools──► SAM 3.1 masks ──► code: scale, contours, potrace
   (realtime)          │  SceneAnalysis (JSON)                                    │
                       │  DesignSpec (JSON)  ──────────► code: geometry generator ─┤──► Object ► adapter ──► G-code / SVG
                       │                                                           │
                       └──tools──► Muse Image: art cleanup · photoreal preview ◄───┘
   BACKGROUND: Muse Wonder batch agent (nesting, materials, job plan)
   WATCH:      Spark 1.3 + SAM 3.1 video tracking on burn footage
   OFFLINE:    Muse Glimmer (local) for canvas commands
```

## 4.2 Model roles, calls and settings

### A. Muse Voice Transcribe: the ear
- **Endpoint:** `wss://api.meta.ai/v1/asr/realtime`, relayed by our server (the key goes in the handshake frame, never in the browser).
- **Handshake:** `{ authorization:{accessToken:"Bearer …"}, model:"muse-voice-transcribe-1.0", audioEncoding:"PCM_24KHZ", mode:"PUSH_TO_TALK", partialMode:"CUMULATIVE", keywords:[…maker vocabulary…] }`. Wait for `{sessionId}`, then send binary PCM frames at real-time pace, then `{"type":"endStream"}`.
- **Events used:** `transcript` (partial/final) → live caption; the final → orchestrator.
- **Why this model:** best-in-class English WER on Artificial Analysis (3.1%), keyword biasing for jargon, $0.18/hr.
- **Limits:** 60-min sessions, 5 s backlog max, no word timestamps (we don't need them).

### B. Muse Spark 1.3: the eye and brain (orchestrator)
One conversation loop (Responses API, `previous_response_id` for state; system prompt + tool schemas cached).

| Call | Input | Output | `reasoning_effort` |
|---|---|---|---|
| **converse** | transcript + session slots | text reply + UI tool calls | `low` |
| **analyze_scene** | 1–4 images (+ optional MP4) + intent | `SceneAnalysis` (strict JSON schema) | `medium` |
| **plan_design** | intent + measurements + templates catalog | `DesignSpec` (strict JSON schema) | `high` |
| **edit_design** | utterance + current spec | tool calls (`resize_part`, `set_param`, …) | `low` |
| **watch_burn** | burn clip or frames + design summary | `BurnEvents` JSON | `low` (live) / `medium` (recorded) |

**UI toolkit tools exposed to Spark** (the "UI appears around the conversation" principle, README): `show_scene_card`, `show_measure_overlay`, `show_plan_card`, `show_art_picker`, `show_preview`, `open_canvas`, `ask_user(question, options[])`, plus perception tools `segment(prompt, image_id)` → SAM, `generate_art(...)` → Muse Image, `render_preview(...)` → Muse Image.

**Why this model:** native multimodal (image + video with audio in one call), 1M context, parallel tool calling, strict structured output, fast (~230 tok/s), cheap ($1.25/$4.25 per M; $0.15 cached).

#### `SceneAnalysis` (abridged JSON Schema, strict)
```json
{ "objects": [ { "id":"o1", "label":"hand-drawn M logo on paper", "sam_prompt":"logo drawing",
                 "role":"art|fit_target|reference|other", "bbox":[x1,y1,x2,y2],
                 "shape_hint":"round|rectangular|freeform" } ],
  "reference": { "object_id":"o3", "kind":"id1_card|us_letter|a4|ruler|cutting_mat|quarter|none" },
  "camera": { "top_down_confidence": 0.0 },
  "notes": "string" }
```

#### `DesignSpec` (abridged)
```json
{ "project": "Coasters for Maya",
  "material": { "id":"birch", "thickness_mm":3 }, "device_id":"longer-ray5-10w",
  "sheet": { "w_mm":300, "h_mm":300 },
  "parts": [
    { "name":"coaster", "qty":4, "template":"coaster", "params": { "shape":"round", "diameter_mm":95 },
      "engrave": [ { "art_id":"art-2", "size_mm":60, "anchor":"center" } ] },
    { "name":"holder", "qty":1, "template":"finger_box_open",
      "params": { "inner_w_mm":97, "inner_d_mm":14, "inner_h_mm":40, "finger_mm":8 } } ],
  "kerf_mm": 0.1, "clearance_mm": 1,
  "assumptions": [ "mug base Ø82 mm measured; coaster = base + 13 mm" ] }
```

### C. SAM 3.1: the steady hand
- **Endpoint:** `POST /v1/responses`, `model:"sam-3.1"`, one user message with `input_text` (a noun phrase from Spark's `sam_prompt`) + `input_image` or `input_video`; `stream:true` for video; `metadata:{mask_encoding:"one_bit"}`.
- **Parse** with `@meta-sam/parser` (`parseImageStream` → `recordsOfKind(...,"mask")` → `decodeMaskToRaster` → W×H 0/1 raster). Boxes are in source pixels. Video yields one line per frame with **stable object IDs**.
- **One concept per request** → we fan out in parallel (reference, fit target, art) since the rate limit is 3,000 RPM.
- **Uses:** (1) scale from the reference mask; (2) fit-target dimensions; (3) art region crop; (4) outline tracing for cut paths; (5) Burn Watch workpiece tracking.
- **Why this model:** text-prompted, pixel-exact masks plus video tracking in one hosted call; $2.50/1K images, $0.20/1K frames.

### D. Muse Image: the imagination
- **Art cleanup** (`/v1/images/edits`, `n:3`, `output_format:"png"`, `tool_enablement:{enable_web_search:false, enable_shell:false, enable_image_search:false}`, `reasoning_strength:"low"`).
- **Photoreal preview** (`/v1/responses`): input parts in a deliberate order with inline captions, e.g. *"Image 1 is the engraving artwork. Image 2 is the birch plywood material. Render four round 95 mm birch coasters with Image 1 laser-engraved (dark brown burn) stacked in an open finger-jointed birch holder, on a wooden coffee table, soft morning light, product photo."* Re-rolls and refinements use `previous_response_id`.
- **Why this model:** generate + edit in one model, multi-reference composition, legible text, self-correcting; $0.01/image.
- **Note:** no masks, so the art region is pre-cropped using SAM.

### E. Muse Wonder: the project manager (background only)
- `POST /v1/responses` with `model:"muse-wonder-1.0"`, `background:true`, our function tools (`generate_variant`, `nest`, `estimate_burn_time`, `write_report`) + `web_search`. Poll or stream status into the job dashboard.
- **Why:** long-horizon planning with error recovery ("Active Focus") and lots of tool calls. **Not interactive:** about 19 s to first token and $4/$20 per M, so it's used only where waiting is natural.

### F. Muse Glimmer: offline copilot (P1+)
- Runs locally via LM Studio or Ollama (OpenAI-compatible `http://localhost:…/v1`). Same `edit_design` tool schema as Spark. Apache 2.0. Shows the open-weights side of the story.

### G. Muse Code: the builder
- The implementation is driven by Muse Code from this PRD (`AGENTS.md` points it here). The white paper reports how much was built with it.

## 4.3 Sequence: hero journey
```
User(voice) → Server → VoiceTranscribe (WS) → final transcript
Server → Spark.converse → tool: ask_user("show me the design and the mug")
User(photo) → Server → Spark.analyze_scene → SceneAnalysis
Server ⇉ SAM(reference) ∥ SAM(fit_target) ∥ SAM(art)          (parallel)
Server: px/mm from card; mug Ø from mask; art crop
Server → Spark.converse(measurements) → tool: show_measure_overlay
User(voice) "four coasters…" → Spark.plan_design → DesignSpec
Server: geometry generator → shapes; tool: show_plan_card
Server → MuseImage.edit(art crop, n=3) → art picker → user picks
Server → MuseImage.responses(art, birch, scene) → preview
User "make it" → open_canvas → laser adapter G-code → UT trace: 5 models, $0.11
```

## 4.4 Fallbacks & degradation
| Failure | Fallback |
|---|---|
| Voice relay fails | Text input (always visible) |
| No reference detected | Ask for one, or a typed dimension, or a standard-size assumption |
| SAM returns empty | Spark bbox crop + Otsu threshold; ask "tap the object" (point prompt, P1+) |
| Measurement confidence < 0.6 | Ask the user to confirm the number with a pre-filled editable value |
| Muse Image 400 `content_policy_violation` | Explain and skip; trace the original sketch directly |
| 429 / 503 | Exponential backoff (max 3); show "Burn-E is thinking…" |
| Budget cap hit | Friendly stop; everything already generated stays usable |

## 4.5 Cost model (per hero-journey session, Standard prices)
| Step | Volume | Cost |
|---|---|---|
| Voice Transcribe | ~3 min of speech | $0.009 |
| Spark converse ×8 (cached system prompt) | ~8 × (6K in / 0.4K out) | ~$0.04 |
| Spark analyze_scene | ~4K img tokens + 1K out | ~$0.01 |
| Spark plan_design (high) | ~6K in / 3K out incl. reasoning | ~$0.02 |
| SAM 3.1 | 3–4 images | ~$0.01 |
| Muse Image | 3 art + 1–2 previews | $0.04–0.05 |
| **Total** | | **≈ $0.13** |
| Burn Watch recorded 60 s @ 2 fps | 120 SAM frames (min 50) + Spark clip | ~$0.03–0.06 |
| Wonder batch (40 ornaments) | ~60K in / 15K out | ~$0.55 |

$150 of hackathon credit is enough for about 1,000 hero sessions. **Note:** usage on free credits may be used by Meta for product improvement, so use only our own media (see 03 R-PL-3).

## 4.6 Prompting principles
1. **Structured output for anything code consumes** (`SceneAnalysis`, `DesignSpec`, `BurnEvents`) with `strict:true` (every object has `additionalProperties:false`; all keys required, nullable where optional).
2. **Models choose; code computes.** Spark picks templates and parameters; the generator makes geometry; SAM + math make measurements.
3. **Show the reasoning:** Spark's `assumptions[]` are shown on the plan card ("coaster = mug base + 13 mm") so the user can correct them.
4. **Cache-friendly prompts:** a stable system prompt + tool schemas first, the dynamic turn last.
5. **Persona:** short sentences, maker lingo, one question at a time, always propose a default.
