# 02 — User Journeys

## J1 ★ Hero journey: "Coasters for a friend" (THE demo)
**Actor:** Dev, a hobby maker with a Longer Ray 5 (10 W). **Time budget:** under 5 minutes of software time.

| # | User does / says | Katachi shows / does | Models |
|---|---|---|---|
| 1 | Opens Katachi; sparse workshop screen; taps the mic: *"Hey Katachi, I want to make coasters for my friend Maya."* | Live transcript; the Katachi avatar reacts; asks: "Love it. Show me what we're working with: the design, and a mug if you've got one." | Voice Transcribe (realtime) → Spark (conversation) |
| 2 | Snaps **one photo**: hand-drawn "M" logo sketch next to a mug and a credit card on the bench | Photo lands in a **Scene card**; objects get labeled chips: *Sketch · Mug · Credit card (reference)* | Spark 1.3 (image understanding, structured output) |
| 3 | — | **Measure overlay:** SAM outlines glow over the card, mug base and sketch; dimension callouts appear: *Mug base Ø 82 mm (±2)* | SAM 3.1 (masks) + Spark (scale reasoning) |
| 4 | *"Four coasters, a bit bigger than the mug, 3 mm birch, with a little holder box with finger joints."* | **Build plan card** (exploded parts): 4 × Ø 95 mm coasters, holder: base + 4 walls with finger joints, sized for 4 × 3 mm + clearance. "Six parts, fits on one 300×300 sheet. Engrave the M on each coaster?" | Spark (planning → `DesignSpec` JSON) |
| 5 | *"Yes, and clean up my logo."* | **Art card**: 3 cleaned-up variants of the M logo (line art, laser-friendly); user taps #2 | Muse Image (edit with the sketch as reference) |
| 6 | — | **Preview card**: photoreal render of the birch coasters in the holder on a coffee table, with the M engraved | Muse Image (role-ordered references: art + birch material + scene) |
| 7 | *"Looks great. Make it."* | Plan zooms into the **canvas**: real parts nested on the sheet, engrave in blue, cuts in red; properties panel slides in | Deterministic geometry (Object) + laser adapter (Impl) + SAM/potrace vectors |
| 8 | Drags a coaster bigger; *"make the walls 5 mm taller"* | Canvas updates; Katachi: "Walls at 45 mm. Holder still fits the sheet." | Spark tool-calls → canvas actions |
| 9 | Taps **Burn** | G-code generated with the Longer Ray 5 + birch 3 mm preset; **cost & model trace** toast: "This design used 5 Meta models · $0.11" | Laser device adapter (code) |
| 10 | Props the phone up, starts **Burn Watch** | Live view with SAM tracking the workpiece; mid-burn: ⚠ "Flare on coaster 3, pause and check air assist." | Spark (frames) + SAM 3.1 (video tracking) |
| 11 | Holds up the finished coasters | **Done card**: before/after (photo of sketch → photo of the real object), share image | Muse Image (share card) |

**Demo-critical success:** steps 1–9 live; step 10 can use a pre-recorded burn clip analyzed live; step 11 is the closing shot of the video.

## J2 "Fit this thing": measurement-first
"Make a phone stand for *this* phone at 60°." The user photographs the phone on a cutting mat. Spark reads the mat grid (reference) → dimensions → parametric stand with a slot sized to the phone's thickness + 1 mm → preview → G-code. *Shows Spark measurement + deterministic geometry.*

## J3 Sketch → Cricut (SVG export)
A crafter photographs a hand-drawn "Happy Birthday Leo" banner sketch. SAM isolates the drawing, Muse Image cleans it into cut-friendly lettering, it's vectorized, and the user exports an SVG sized to 12 × 4 in for Cricut Design Space. *Shows reach beyond lasers.*

## J4 ★ Seller batch with Wonder (P1+, the second demo beat)
Sam uploads a CSV of 40 names and says *"Christmas ornaments, 3 inch, star shape, name engraved, birch 3 mm."* **Muse Wonder** runs as a background job: designs one ornament template, generates 40 variants, **nests** them onto 300×300 sheets, estimates burn time per sheet, looks up birch sheet prices (web search) and writes a materials list and job order. The user gets a notification: "4 sheets, est. 3 h 10 m burn, $18 of birch. Ready." *Shows Wonder's long-horizon agent work, kept off the interactive path.*

## J5 Burn Watch (P1 with a recorded clip; live P1+)
The phone camera faces the laser bed. Every ~2 s a frame (or a 5 s clip) goes to Spark plus SAM tracking ("workpiece", "flame"). Katachi alerts on flare-ups, workpiece shift, or "cut didn't go through" (gap visible after the pass). P2: auto-pause via a machine connection.

## J6 Offline shop copilot (P1+ stretch)
No Wi-Fi in the garage. Katachi falls back to **Muse Glimmer** running locally (LM Studio / Ollama) for canvas commands: "mirror this", "add 2 mm kerf", "array 4 across". Vision features show "needs internet".

## J7 Returning user (P2)
"My Workshop": saved device, materials, past projects; "make another one like last time but for 6 mugs".
