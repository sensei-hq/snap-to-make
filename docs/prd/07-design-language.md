# 07 — Design Language ("Zen-Sumi")

One visual system for **the app, the pitch deck, the white paper and the demo video**, so everything reads as one product. The source of truth is the design mock (`mockups/svelte/src/lib/design/burn-e.uno.js`, local only); the app implements it with Rokkit tokens and components.

## 7.1 Mood
Washi paper, sumi ink and one rationed vermillion accent (朱 *shu*). Calm, crafted, confident, never "sci-fi AI". Hairlines over shadows, generous negative space. On a fabrication drawing the two operation colours are **vermillion = cut, ink = engrave**.

## 7.2 Color tokens
Palettes (`kami` paper, `sumi` ink, `shu` vermillion, `hisui`, `kohaku`, `beni`, `ai`) live in `app/src/lib/design/sumi-palette.js` (OKLCH). `app/rokkit.config.js` maps them onto Rokkit's named tokens with light/dark values, and `app/src/lib/design/tokens.spec.ts` pins every value to the mock. Components use only named-token utilities (`bg-paper`, `text-ink-mute`, `border-paper-edge`, …) or Rokkit components themed by `@rokkit/themes` *zen-sumi*; `bun run test:arch` rejects raw colours outside `src/lib/components/illustrations/`.

| Mock role | Rokkit token | Light | Dark | Use |
|---|---|---|---|---|
| bg | `paper` | `oklch(0.975 0.008 85)` | `oklch(0.170 0.010 50)` | Screen background |
| surface | `paper-soft` | `oklch(0.955 0.010 85)` | `oklch(0.210 0.012 50)` | Cards, bars, composer |
| sunken | `paper-mute` | `oklch(0.920 0.012 85)` | `oklch(0.250 0.012 50)` | Wells, pills, tracks |
| line | `paper-edge` | `oklch(0.880 0.015 85)` | `oklch(0.300 0.010 50)` | Hairlines, borders |
| fg | `ink` | `oklch(0.220 0.012 50)` | `oklch(0.940 0.008 85)` | Primary text, engrave lines |
| muted | `ink-mute` | `oklch(0.380 0.012 50)` | `oklch(0.780 0.008 85)` | Secondary text |
| faint | `ink-soft` | `oklch(0.580 0.010 50)` | `oklch(0.600 0.010 85)` | Meta, mono labels |
| ghost | `ink-faint` | `oklch(0.750 0.008 50)` | `oklch(0.420 0.012 85)` | Placeholders |
| accent | `accent`, `cut` | `oklch(0.580 0.150 35)` | `oklch(0.700 0.150 35)` | The one accent: Burn-E mark, cut lines, links |
| action | `primary` / `on-primary` | ink fill | ink fill (inverted) | Primary buttons, mic |
| ok | `success` | `oklch(0.620 0.080 160)` | `oklch(0.720 0.090 160)` | Preflight ✓, live dot |
| warn | `warning` / `warning-ink` | `oklch(0.720 0.120 75)` | `oklch(0.780 0.120 75)` | Reference masks, warnings |

The camera screen is always dark (it pins `data-mode="dark"` and uses the `camera` token). Photo stand-ins (scene, viewfinder, preview, burn clip, art takes) are illustrations and keep their photographic colours.

**Model chips** (Under the hood, deck, white paper): Voice Transcribe `#9B7BFF` · Spark 1.3 `#3E8BFF` · SAM 3.1 `#2FC2B5` · Muse Image `#FF6FAE` · Wonder `#FF8A1F` · Glimmer `#B4E05A` · Muse Code `#A39A8A`.

## 7.3 Typography
- **Display:** Fraunces 400/500 (`typography.display` → `font-heading`): screen titles, the gate headline, section titles.
- **UI and body:** Inter 400/500/600 (`typography.sans`). Type scale in `app/uno.config.js`: `micro` 11 · `ui` 13 · `body` 15 · `lede` 17 · `title` 22 · `head` 28 · `display` 40 · `hero` 56.
- **Numbers, dimensions, G-code, costs:** JetBrains Mono 500 (`typography.mono`) via the `meta`, `readout`, `eyebrow` and `lane` type roles, so "Ø 82 mm" and "$0.11" always look like measurements.
- Fonts ship with the app (`@fontsource/*`, imported in `app/src/app.css`).

## 7.4 Shape, texture, motion
- Radius 4 / 6 / 10 px (`shape.radius` in `rokkit.config.js`); cards are surface + 1 px hairline, no shadow.
- Textures from tokens only: `grid-bed` graph paper for the sheet and virtual bed, `swatch-birch` grain for material chips and art takes.
- **Signature motion:** SAM masks "burn in" as vermillion outlines; the plan illustration morphs into canvas parts; the preview develops from blur to sharp. Motion is disabled under `prefers-reduced-motion`.
- Iconography: Solar linear icons via Rokkit (`icons.solar`), plus the Burn-E aperture mark (`BurnEMark.svelte`).

## 7.5 Illustration style
- Hairline **line illustrations** (ink on washi paper) for parts diagrams and architecture; cut layers in vermillion, engrave layers in ink.
- The architecture diagram uses the "EAR · EYE · BRAIN · HAND · IMAGINATION" metaphor with model chips; reuse it in the app's About panel, deck slide 5 and white paper figure 1.

## 7.6 Voice & copy
- Burn-E speaks like a friendly shop mate: short, specific, opinionated. "Birch is a great pick: nice grain for engraving."
- Product copy: verbs first ("Show it. Say it. Burn it."). Avoid "AI-powered" fluff; name the model that did the work.
- Always honest: "AI preview", "Advisory only", "measured ±2 mm".

## 7.7 Deck & white paper templates
- **Deck:** 16:9, washi paper background (sumi for section breaks), a vermillion mark beside the title, Fraunces titles, model chips as legends, a maximum of 1 idea per slide, real screenshots in device frames.
- **White paper:** light mode, paper-soft side panels for callouts, figure numbering, every claim backed by the Under-the-hood trace numbers or the eval table.
