# 01 — Vision & Positioning

## 1.1 Problem
Desktop laser cutters, CNC routers and vinyl cutters (Cricut, Silhouette) have become consumer products. Millions of people own one. The hardware is easy; **the design step is the wall**:

- Turning an idea ("a coaster set with my logo that fits my mugs") into a cut file means learning a vector editor (LightBurn, Illustrator, Inkscape, xTool Creative Space).
- **Measuring the real world** (the mug, the shelf gap, the phone that goes in the stand) and carrying those numbers into the design is manual and error-prone.
- Hand sketches and photos must be **traced** by hand or with brittle auto-trace tools.
- You don't know what it will **look like** until you've burned material.
- Burns are **unattended**: flare-ups, a shifted workpiece or an incomplete cut are found too late.

Result: most machines cut the same downloaded templates, and many sit idle.

## 1.2 Solution
**Katachi Snap → Make** is a voice-first workshop buddy that goes from *the real world* to *the cut file* to *the finished object*:

1. **Show it**: snap a photo or short video of a sketch, the object it must fit, and a reference (a credit card or ruler).
2. **Say it**: "Four coasters with this logo, sized for this mug, 3 mm birch, plus a finger-joint holder."
3. **See it**: Katachi measures, traces, designs the parts and renders a **photoreal preview** before any material is used.
4. **Burn it**: one tap to G-code (GRBL) or SVG (Cricut/Glowforge/xTool); Katachi **watches the burn** through the phone camera and warns about problems.

## 1.3 Why Meta's models (the core of the pitch)
Each step needs a different kind of intelligence. Meta's Muse family covers all of them, and each model does what it's uniquely good at:

| Human skill | Meta model | Role in Katachi |
|---|---|---|
| Listening in a noisy shop | **Muse Voice Transcribe** | Realtime speech with maker vocabulary biasing |
| Seeing and reasoning about the scene | **Muse Spark 1.3** | Identifies objects, measures against a reference, plans the parts, writes the design spec as validated JSON |
| A steady hand for tracing | **SAM 3.1** | Pixel-accurate outlines from a text prompt ("the logo sketch", "the mug base"), plus tracking during the burn |
| Imagining the result | **Muse Image** | Turns a rough sketch into clean engrave art; renders the finished object in the user's material and setting |
| A project manager | **Muse Wonder** | Long-running batch jobs ("50 personalized ornaments"): planning, nesting, materials list, job sequencing |
| Working offline in the shop | **Muse Glimmer** (open weights, P1+) | A local command copilot when there's no internet |

**Tagline for judges:** *Six Meta models, one workshop buddy: from what you see and say to something you can hold.*

## 1.4 Personas (all 18+, per Meta API terms)
| Persona | Context | Job to be done | Will pay? |
|---|---|---|---|
| **Hobby maker "Dev"** | Owns a 10–20 W diode laser (Longer, xTool, Ortur), cuts on weekends | "I have an idea and a machine. Get me from idea to cut without spending an evening in LightBurn." | Yes, $5–10/mo (already pays for LightBurn, $60+) |
| **Crafter "Priya"** | Cricut owner, makes gifts and party decor | "Turn my kid's drawing / my sketch into a clean cut file sized for this jar." | Yes, per project or monthly |
| **Etsy seller "Sam"** | Sells personalized wood goods | "Take this order list of 40 names and produce nested cut files and a material plan overnight." | Yes, $15–30/mo (pays for time) |
| **Makerspace lead** (P2) | Runs onboarding for new members | "Get new members to a successful first cut safely." | Org plan |

## 1.5 Positioning
- **Not** another vector editor. The canvas is where you *refine*, not where you start.
- **Not** an AI image generator bolted onto a laser app (Glowforge "Magic Canvas" and xTool AImake generate art only). Katachi **measures, traces, designs parts with joints, previews, outputs machine code and monitors the burn**: the whole loop.
- **Device-agnostic:** GRBL G-code (most diode lasers) plus SVG export (Cricut, Glowforge, xTool, LightBurn import).

## 1.6 Business model (nominal individual pricing)
| Plan | Price | Includes |
|---|---|---|
| Free | $0 | 3 Snap designs/month, watermark on previews, SVG export |
| **Maker** | **$7.99/mo** | 40 Snap designs, G-code export, Burn Watch, unlimited edits |
| Seller | $19.99/mo | Maker + Wonder batch projects (10/mo), commercial-use previews |
| Pay as you go | $0.50 / design | For occasional users |

**Unit cost** (see 04 §cost): about $0.10–0.20 per Snap design (Spark + SAM + 2–3 Muse Image calls + voice), giving over 70% gross margin at Maker usage.

## 1.7 Success metrics
- **Demo (hackathon):** a sketch-and-mug photo to a finished, correctly sized physical object in **under 5 minutes of software time**, live on camera.
- **Accuracy:** measured dimensions within ±3% of truth when a reference card is visible (Day-1 spike target ±5%).
- **Product:** first-cut success rate (did the user burn something in their first session), time from idea to G-code, designs per active user per month.

## 1.8 Non-goals for the hackathon
- Full CAD (free-form curve editing beyond part-level canvas edits), 3D-print file export, CNC toolpaths with depth.
- Direct machine control over USB/serial (P2: Web Serial streaming).
- Multi-user collaboration, marketplace (post-hackathon, see 08 §8.2).
