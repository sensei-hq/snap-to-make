# 06 — Screens

Each screen lists: **purpose · route · components · state · states · design notes**. All screens live in `app/`: pages under `src/routes/snap/`, presentation-only Svelte components under `src/lib/components/` (Rokkit primitives + UnoCSS), and the state class that owns their data under `src/lib/state/`. Components take props and fire events; they never fetch. Visual rules are in [07-design-language.md](07-design-language.md).

Shared chrome: `ScreenHeader` (title, subtitle, cost pill, light/dark toggle via `UiState`), `AppNav` (Workshop · capture · canvas · convert · watch · batch), `AskBar` (text input, always visible). Layout is a phone column (`.phone-col`, max 430 px) that also works on a laptop.

---

## S1 Workshop (home / conversation)
- **Purpose:** the sparse, warm, voice-first start of J1 (step 1). Nothing on screen but Burn-E, the mic and the text input.
- **Route:** `/snap` (`src/routes/snap/+page.svelte`).
- **Components:** `WorkshopShell` (Burn-E avatar, greeting, live transcript, mic button, suggestion chips), `AskBar`, `ScreenHeader`.
- **State:** `FlowState` (step, mic, transcript), `ConversationState` (slots: intent, qty, material, thickness, device, art).
- **States:** idle · listening (ring pulses with level) · thinking (ember glow) · speaking (captions type on) · offline (Glimmer badge).
- **Design notes:**
  > Full-screen "Workshop" home for Burn-E, a laser-maker assistant. Dark charcoal background with a subtle birch-wood grain texture at 6% opacity. Centered: an animated circular ember avatar (amber glow) above a large round push-to-talk mic button with an animated level ring. Below it a caption area showing Burn-E's reply in warm off-white sans text and the user's live transcript in muted gray. A slim text input with placeholder "Or type: what are we making today?" is pinned at the bottom with 3 suggestion chips: "Coasters from my sketch", "Box that fits this", "Ornaments for 40 names". No menus or sidebars. Top-right: a tiny cost pill "$0.00 · Meta AI" and an "Under the hood" icon button. Rokkit buttons and chips, radius 10 px.

## S2 Scene card + Measure overlay
- **Purpose:** show what Burn-E sees and measured (R-UN-1…6).
- **Route:** `/snap/capture` (capture), then the card appears in `/snap`.
- **Components:** `SnapCapture` (camera/upload, capture tips), `SceneCard` (photo with object chips, mask overlay coloured by role: art = engrave blue, fit target = cut red, reference = amber; dimension callouts with leader line + mm value + ± + edit-on-tap; confidence dot).
- **State:** `CaptureState` (shutter, upload, analyse), `FlowState`.
- **States:** analysing (scan-line shimmer over the photo) · masks drawn one by one (staggered 150 ms) · measured · needs-confirmation (amber callout).
- **Design notes:**
  > A "Scene" card that floats over the Workshop screen. It shows a top-down photo of a workbench with a hand-drawn logo, a mug and a credit card. Overlay glowing segmentation outlines: blue for the logo (label "Art"), red for the mug base (label "Fit target"), amber for the card (label "Reference · 85.6×54 mm"). Dimension callouts with thin leader lines: "Ø 82 mm ±2" on the mug, "62 × 58 mm" on the logo. Each value is tappable and editable. A footer row: "Scale from credit card · confidence high" with a green dot, and buttons "Looks right" (primary) and "Fix a number". Include a scanning shimmer state.

## S3 Build plan card + "Make it with…"
- **Purpose:** exploded parts diagram (J1 step 4; R-DS-7) and the fabrication target choice (Object → Impl).
- **Components:** `PlanCard` (SVG exploded view generated from the Object, parts list with name/qty/size, **assumptions** list with edit affordances, sheet-fit indicator "fits 1 sheet 300×300"), `ImplPicker` (Rokkit `Toggle`: Laser · Cricut · P2 · 3D print · P2).
- **State:** `DesignState` (Object → selected Target → `ImplPlan`; re-plan is code only, $0).
- **Design notes:**
  > A "Build plan" card with an isometric exploded line illustration of 4 round coasters and an open finger-jointed holder box (base + 4 walls), in thin warm-white lines on charcoal, with labeled parts and dimensions. Right side (below on phone): a parts table (Coaster ×4 Ø95 mm; Base 103×20 mm (inner 97×14 + 3 mm walls); Long wall ×2; Short wall ×2), a material chip "Birch 3 mm", a device chip "Longer Ray 5 · 10 W", a sheet-fit meter "1 of 1 sheet · 72% used", and an "Assumptions" list with small edit pencils ("Coaster = mug base + 13 mm", "Clearance 1 mm"). A "Make it with…" toggle under the parts; Phase-2 targets are labelled. Buttons: "Change something" and "Looks good".

## S4 Art picker
- **Purpose:** pick a cleaned-up engraving art variant (R-AR-1/2).
- **Components:** `ArtPicker` (original sketch thumbnail → arrow → 3 variant tiles, "Re-roll", "Use original").
- **State:** `FlowState`.
- **Design notes:**
  > On the left a small thumbnail of a rough pencil sketch of the letter M with leaves; an arrow; then three larger tiles of cleaned-up laser-friendly line-art variants shown as dark engraving on a light birch texture. One tile selected with an amber ring and check. Under the tiles: "Made with Muse Image" micro-label, buttons "Re-roll" and "Use this".

## S5 Preview
- **Purpose:** the photoreal "this is what you'll get" moment (R-AR-3).
- **Components:** `PreviewStage` (large image with a subtle reveal, blur → sharp; "AI preview" badge; actions).
- **State:** `FlowState`.
- **Design notes:**
  > A full-bleed "Preview" stage showing a photoreal product photo of four birch coasters with an engraved M logo in an open finger-jointed holder on a coffee table. Top-left badge "AI preview · Muse Image". Bottom glass bar with buttons: primary "Make it" (ember/amber), secondary "Try another scene", "Darker engraving". Include a reveal animation state from blurred to sharp.

## S6 Canvas, Simulate and Make (progressive reveal)
- **Purpose:** refine, rehearse and output (J1 steps 7–9; R-DS-6, R-MK-*).
- **Route:** `/snap/canvas` (sheet + downloads); Simulate and Assembly also play inline in `/snap`.
- **Components:** `CanvasSheet` (nested pieces on the sheet, engrave blue / cut red, preflight list, est. time, "Download G-code", "Export SVG"), `SimulateView` (toolpath playback on a virtual bed: play/pause/scrub/speed, engrave before cut), `AssemblyPlayer` (exploded ↔ assembled), `AskBar` (voice/text edits).
- **State:** `CanvasState` (plan, preflight, G-code/SVG), `DesignState`, `PlaybackState`.
- **Behavior:** the plan illustration morphs into canvas parts (motion); panels appear only when needed (properties on the first selection, piece list on the second part, toolbar on the first engrave edit).
- **Design notes:**
  > Parts already laid out on a 300×300 mm sheet (4 coasters with blue engraved M logos, holder parts with red cut outlines and finger joints). A small circular Burn-E ember avatar with a mic docked bottom-left, a slim suggestion strip at the bottom ("Next: want a lid?" with Yes/No), and a right-aligned "Make" bar with preflight checks (✓ fits bed, ✓ paths closed, est. 14 min) and buttons "Download G-code", "Export SVG". Simulate shows the laser head tracing the same sheet with a progress scrubber; no device needed.

## S7 Burn Watch
- **Purpose:** R-BW-1/2.
- **Route:** `/snap/watch`.
- **Components:** watch stage (video with SAM tracking outline on the workpiece), event timeline (scrubber with coloured event markers), alert banner.
- **State:** `WatchState` (clip, events).
- **Design notes:**
  > A large video of a laser engraver bed mid-cut with a thin blue tracking outline around the workpiece labeled "Workpiece · tracked". A red alert banner at top: "⚠ Flare on coaster 3 · 0:42: pause and check air assist". Below, a timeline scrubber with markers: green "OK", amber "Heavy smoke", red "Flare". A side list of events with timestamps and thumbnails. Small footer: "Advisory only: never leave your laser unattended."

## S8 Batch job (Wonder)
- **Purpose:** R-WB-*.
- **Route:** `/snap/batch`.
- **Components:** composer (template + CSV/name list), job progress (live steps from Wonder tool calls), production plan (sheet thumbnails, burn order, time, materials and cost list).
- **State:** `BatchState` (job status, steps, plan).
- **Design notes:**
  > Left (top on phone): a composer with a star-ornament template thumbnail, a dropped CSV chip "names.csv · 40 rows", and fields (size 3 in, birch 3 mm). Center: a live agent progress list with checkmarks ("Designed template", "Generated 40 variants", "Nested onto 4 sheets", "Looked up birch prices", "Estimated burn time 3 h 10 m") and a label "Running on Muse Wonder". Right: a production plan with 4 sheet thumbnails showing nested stars, a burn order, and a materials list with total "$18.40". Button "Download all".

## S9 Under the hood (drawer)
- **Purpose:** R-UT-* (judges love it).
- **Components:** `TraceDrawer` (timeline of calls with model chip, purpose, latency bar, units, $; totals per model; "Export JSON").
- **State:** `TraceState` (entries, totals).
- **Design notes:**
  > A right-side drawer "Under the hood" (bottom sheet on phone). A vertical timeline of AI calls, each row with a coloured model chip (Voice Transcribe, Spark 1.3, SAM 3.1, Muse Image, Wonder, Glimmer), a one-line purpose ("SAM 3.1 · outline the mug base"), a latency bar (e.g., 640 ms) and cost ($0.0025). Top summary: "Session · 5 Meta models · 14 calls · $0.11 · 38 s total AI time" with a small stacked bar by model. Footer button "Export trace".

## S10 First-run gate
- **Route:** `/snap/welcome`. **State:** `SessionState` (invite, attestation, budget).
- Invite code + 18+ attestation + laser safety + "demo uses our own media" notice, as a single form with three checkboxes; the server (`/api/gate`) checks the code and sets an httpOnly session cookie.
