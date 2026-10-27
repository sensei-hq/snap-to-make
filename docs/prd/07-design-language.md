# 07 — Design Language ("Workshop")

One visual system for **the app, the pitch deck, the white paper and the demo video**, so everything reads as one product.

## 7.1 Mood
Warm workshop at night: charcoal benches, birch plywood, the amber glow of a laser. Calm, crafted, confident, never "sci-fi AI". The two operation colors (**red = cut, blue = engrave**) are the backbone of the system.

## 7.2 Color tokens
Defined in `app/rokkit.config.js`: the Workshop colors are named-token `overrides` (`ember`, `cut`, `engrave`, `reference`, `charcoal`, `soot`, `ash`, `birch`); the remaining roles map to Rokkit semantic tokens (`success`, `ink`, `ink-mute`, light/dark per skin). `app/uno.config.js` compiles them with UnoCSS `presetRokkit` into utilities and CSS variables (`var(--ink)`, `var(--paper)`…); `app/src/app.css` loads the Rokkit base theme and the shared `.card`, `.chip`, `.pill`, `.btn-ink`/`.btn-line` classes. Use the same hex values in the deck and the white paper.

| Token | Rokkit token | Hex | Use |
|---|---|---|---|
| `--ws-charcoal` | `charcoal` | `#16140F` | App background (dark), deck background |
| `--ws-soot` | `soot` | `#221F19` | Cards, panels |
| `--ws-ash` | `ash` | `#3A352C` | Borders, dividers |
| `--ws-birch` | `birch` | `#EAD9B8` | Light surfaces, white-paper accent panels, wood texture tint |
| `--ws-kraft` | — | `#B98A5A` | Secondary accent, illustrations |
| `--ws-ember` | `ember` | `#FF8A1F` | **Primary accent**: Burn-E avatar, primary buttons, highlights |
| `--ws-cut` | `cut` | `#E5484D` | Cut paths, fit-target masks, destructive |
| `--ws-engrave` | `engrave` | `#3E8BFF` | Engrave paths, art masks |
| `--ws-reference` | `reference` | `#F5B83D` | Reference masks, warnings |
| `--ws-ok` | `success` | `#3FB27F` | Success, preflight ✓ |
| `--ws-text` | `ink` (dark) | `#F3EDE2` | Primary text on dark |
| `--ws-text-muted` | `ink-mute` (dark) | `#A39A8A` | Secondary text |

Rows without an override (`—`, `success`, `ink`, `ink-mute`) take their app values from the Rokkit palette in `app/src/lib/sumi-palette.js`; the hex shown is the deck and white-paper value.

**Model chips** (Under the hood, deck, white paper): Voice Transcribe `#9B7BFF` · Spark 1.3 `#3E8BFF` · SAM 3.1 `#2FC2B5` · Muse Image `#FF6FAE` · Wonder `#FF8A1F` · Glimmer `#B4E05A` · Muse Code `#A39A8A`.

Light mode (for white-paper print): background `#FBF7F0`, text `#16140F`, the same accents.

## 7.3 Typography
- **UI and headings:** Inter (`typography.sans` in `rokkit.config.js`). Headings 600, tight tracking (-0.01em).
- **Numbers, dimensions, G-code, costs:** JetBrains Mono (`typography.mono`, `.mono` class), so "Ø 82 mm" and "$0.11" always look like measurements.
- Deck titles: Inter 700, 44–56 pt; body 20–24 pt. White paper: Inter 11 pt body, 1.5 line height; mono for figures.

## 7.4 Shape, texture, motion
- Radius 10 px (`borderRadius.lg` in `uno.config.js`; `.btn-ink`/`.btn-line` in `app.css`), cards with a 1 px `--ws-ash` border and a soft inner glow on focus.
- Birch-grain texture at 4–6% opacity on large backgrounds only.
- **Signature motion:** SAM masks "burn in" as glowing outlines (stroke-dashoffset animation, 600 ms, ember-tinted edge); the plan illustration **morphs into canvas parts** (shared-element transition); the preview **develops** from blur to sharp.
- Iconography: Solar icon set via Rokkit (`icons.solar` in `rokkit.config.js`), 1.5 px stroke.

## 7.5 Illustration style
- Isometric **line illustrations** (1.5 px warm-white lines on charcoal) for parts diagrams and architecture.
- The architecture diagram uses the "EAR · EYE · BRAIN · HAND · IMAGINATION" metaphor with model chips; reuse it in the app's About panel, deck slide 5 and white paper figure 1.

## 7.6 Voice & copy
- Burn-E speaks like a friendly shop mate: short, specific, opinionated. "Birch is a great pick: nice grain for engraving."
- Product copy: verbs first ("Show it. Say it. Burn it."). Avoid "AI-powered" fluff; name the model that did the work.
- Always honest: "AI preview", "Advisory only", "measured ±2 mm".

## 7.7 Deck & white paper templates
- **Deck:** 16:9, charcoal background, ember accent bar at the left of the title, model chips as legends, a maximum of 1 idea per slide, real screenshots in device frames.
- **White paper:** light mode, birch side panels for callouts, figure numbering, every claim backed by the Under-the-hood trace numbers or the eval table.
